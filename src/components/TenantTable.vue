<template>
  <div style="margin: 50px;">
    <DataTable
      :value="tenants"
      :paginator="true"
      class="p-datatable-customers"
      :rows="10"
      dataKey="id"
      :rowHover="true"
      v-model:selection="selectedCustomers"
      v-model:filters="filters"
      filterDisplay="menu"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      :rowsPerPageOptions="[10, 25, 50]"
      currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
      :globalFilterFields="['username', 'name', 'phonenumber', 'status']"
      responsiveLayout="scroll"
    >
      <template #header>
        <div class="p-d-flex p-jc-between p-ai-center">
          <h5 class="p-m-0">Tenants</h5>
          <span class="p-input-icon-left" >
            <i class="pi pi-search" />
            <InputText
              v-model="filters['global'].value"
              placeholder="Keyword Search"
              
            />
          </span>
        </div>
      </template>
      <template #empty>
        No tenants found.
      </template>
      <template #loading>
        Loading tenant data. Please wait.
      </template>
      <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
      <Column
        field="username"
        header="Username"
        sortable
        style="min-width: 14rem"
      >
        <template #body="{data}">
          <Avatar
            v-if="data.profile_uri === ''"
            :label="
              data.first_name.charAt(0).toUpperCase() +
                data.last_name.charAt(0).toUpperCase()
            "
            style="color:black;user-select:none;"
          />
          <Avatar v-else :image="data.profile_uri"/>
          {{ data.username }}
        </template>
        <template #filter="{filterModel}">
          <InputText
            type="text"
            v-model="filterModel.value"
            class="p-column-filter"
            placeholder="Search by username"
          />
        </template>
      </Column>
      <Column field="name" header="Name" sortable>
        <template #body="{data}">
          {{ data.first_name[0].toUpperCase() + data.first_name.substring(1,data.first_name.length) }} {{ data.last_name[0].toUpperCase() + data.last_name.substring(1,data.last_name.length) }}
        </template>
      </Column>
      <Column
        field="phonenumber"
        header="Phone Number"
        sortable
        filterMatchMode="contains"
        style="min-width: 14rem"
      >
        <template #body="{data}">
          {{ data.phone_number }}
        </template>
        <template #filter="{filterModel}">
          <InputText
            type="text"
            v-model="filterModel.value"
            class="p-column-filter"
            placeholder="Search by country"
          />
        </template>
      </Column>
      <Column
        header="Unit"
        sortable
        :showFilterMatchModes="false"
        :filterMenuStyle="{ width: '14rem' }"
        
      >
        <template #body="{data}">
          <div v-if="!data.unit_number" style="display: flex; gap: 15px;">
            <InputNumber v-model="state.unitNumber" mode="decimal" locale="en-US" />
            <Button type="button" @click="updateTenantUnitNumber" icon="pi pi-check" />
          </div>
          <div v-else>
            {{data.unit_number}}
          </div>
        </template>
      </Column>
      <Column
        field="balance"
        header="Rent Balance"
        sortable
        dataType="numeric"
      >
        <template #body="{data}">
          <div style="display: flex; gap: 15px;"
            v-if="
              data.rent_agreement.amount_due === 0 &&
                !data.rent_agreement.last_payment
            "
          >
            <InputNumber mode="decimal" locale="en-US" />
            <Button type="button" icon="pi pi-check" />
          </div>
          <div v-else>
          {{ formatCurrency(data.rent_agreement.amount_due)}}
          </div>
        </template>
        <template #filter="{filterModel}">
          <InputNumber
            v-model="filterModel.value"
            mode="currency"
            currency="USD"
            locale="en-US"
          />
        </template>
      </Column>
      <Column
        field="date"
        header="Last Payment"
        sortable
        dataType="date"
        style="min-width: 8rem"
      >
      <template #body={data}>
        <div>
          {{data.rent_agreement.last_date_paid}}
          <!-- {{formatDate(data.rent_agreement.last_date_paid)}} -->
          <!-- {{new Date(data.rent_agreement.last_date_paid).getMonth()}}/{{new Date(data.rent_agreement.last_date_paid).getDay()}}/{{new Date(data.rent_agreement.last_date_paid).getFullYear()}} -->
        </div>
      </template>
      </Column>
      <!-- <Column
        field="status"
        header="Status"
        sortable
        :filterMenuStyle="{ width: '14rem' }"
        style="min-width: 10rem"
      >
      <template #body="{data}" >
        <div v-if="new Date('12/1/2021').getDate() - new Date(data.rent_agreement.last_date_paid).getDate() > 25">asdf</div>
      </template>
      </Column> -->
      <Column
        headerStyle="width: 4rem; text-align: center"
        bodyStyle="text-align: center; overflow: visible"
      >
        <template #body="{data}">
          <Button type="button" icon="pi pi-send" @click="goToPrivateChat(data.username)" />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script>
import { reactive, ref,toRefs } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import PropertyClient from '../clients/propertyClient'
import {useStore} from 'vuex'
import {useRouter} from 'vue-router'
export default {
  name: 'TenantTable',
  setup(props) {
    const selectedCustomers = ref();
    const filters = ref({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      username: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      name: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      'country.name': {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      representative: { value: null, matchMode: FilterMatchMode.IN },
      date: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
      },
      balance: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
      status: {
        operator: FilterOperator.OR,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
      activity: { value: null, matchMode: FilterMatchMode.BETWEEN },
      verified: { value: null, matchMode: FilterMatchMode.EQUALS },
    });
    const loading = ref(true);
    const store = useStore()
    const router = useRouter()
    const statuses = ref([
      'unqualified',
      'qualified',
      'new',
      'negotiation',
      'renewal',
      'proposal',
    ]);
    const {server_code} = toRefs(props)
    const state = reactive({
      unitNumber: 0
    })
    const formatDate = (value) => {
        return value.toLocaleDateString("en-US", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };
    const formatCurrency = (value) => {
      return value.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
      });
    };
    const updateTenantUnitNumber = async () => {
      try{
        await PropertyClient.updateTenantInProperty({unit_number: state.unitNumber}, store.getters.getCurrentToken)
      }catch(err){
        console.error(err)
      }

    }
    const goToPrivateChat = (username) => {
      let room = `${store.getters.getCurrentUser.username}:${username}`
      router.push({
        name: 'Private-Chat',
        query:{server_code: server_code.value, server_room:room}
      })

    }
    return {
      filters,
      loading,
      formatCurrency,
      selectedCustomers,
      statuses,
      state,
      updateTenantUnitNumber,
      formatDate,
      goToPrivateChat
    };
  },
  props: {
    tenants: {
      type: Array,
    },
    server_code: {
      type:String
    }
  },
};
</script>

<style lang="scss" scoped>
img {
  vertical-align: middle;
}
::v-deep(.p-paginator) {
  .p-paginator-current {
    margin-left: auto;
  }
}

::v-deep(.p-progressbar) {
  height: 0.5rem;
  background-color: #d8dadc;

  .p-progressbar-value {
    background-color: #607d8b;
  }
}

::v-deep(.p-datepicker) {
  min-width: 25rem;

  td {
    font-weight: 400;
  }
}

::v-deep(.p-datatable.p-datatable-customers) {
  .p-datatable-header {
    padding: 1rem;
    text-align: left;
    font-size: 1.5rem;
  }

  .p-paginator {
    padding: 1rem;
  }

  .p-datatable-thead > tr > th {
    text-align: left;
  }

  .p-datatable-tbody > tr > td {
    cursor: auto;
  }

  .p-dropdown-label:not(.p-placeholder) {
    text-transform: uppercase;
  }
}
</style>
