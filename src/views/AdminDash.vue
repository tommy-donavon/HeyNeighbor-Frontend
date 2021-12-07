<template>
  <Toolbar style="background-color:transparent;border:none;">
    <template #left>
      <Avatar
        v-if="state.user.profile_uri === ''"
        :label="state.user.username.charAt(0).toUpperCase()"
        style="color:black;user-select:none;"
      />
      <Avatar v-else :image="state.user.profile_uri" />
      <h3 style="color:white;">{{ state.user.username }}</h3>
      <Button @click="gotoMaintenancePage" label="Manage Maintenance Request" />
    </template>
    <template #right>
      <Button label="Get Code" @click="() => state.viewServerCode = !state.viewServerCode" />
      <Dialog header="Server Code"
        v-model:visible="state.viewServerCode"
        style="width:fit-content;">
      {{state.currentProperty['server_code']}}
      </Dialog>
      <Button label="Create Property" @click="()=> state.viewPropertyForm = !state.viewPropertyForm"/>
      <Dialog header="Create Property"
        v-model:visible="state.viewPropertyForm"
        style="width:fit-content;">
        <create-property/>
      </Dialog>
      <Dropdown
        v-if="state.selectedProperty"
        v-model="state.selectedProperty"
        :options="propOptions"
        class="drop"
      />
      <Dropdown
        v-else
        v-model="state.selectedProperty"
        :options="propOptions"
        class="drop"
      />
      <Button label="Log out" @click="onLogout" />
    </template>
  </Toolbar>
  <tenant-table :tenants="state.tenants" :server_code="state.currentProperty.server_code" />
</template>

<script>
import { reactive, watchEffect } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import TenantTable from '../components/TenantTable.vue'
import CreateProperty from '../components/CreateProperty.vue'

export default {
  name: 'AdminDash',
  setup() {
    const store = useStore();
    const router = useRouter();
    const user = store.getters.getCurrentUser;
    const properties = store.getters.getCurrentUserProperties;
    const state = reactive({
      user: user,
      properties: properties,
      selectedProperty:
        properties[0] === undefined ? '' : properties[0].property_name,
      currentProperty: {server_code:''},
      tenants: [],
      viewPropertyForm: false,
      viewServerCode: false,
    });
    const propOptions = state.properties.map((p) => p.property_name);
    const onLogout = () => {
      window.sessionStorage.clear();
      window.location.reload();
    };

    const gotoMaintenancePage = () => {
      router.push({
        name: 'Admin-Maintenance-Dash',
        query: { server_code: state.currentProperty.server_code },
      });
    };

    watchEffect(() => {
      state.currentProperty = state.properties.filter(p => p.property_name === state.selectedProperty)[0]
      state.tenants = state.currentProperty.tenants
    })



    return { state, propOptions, onLogout, gotoMaintenancePage };
  },
  components:{
    TenantTable,
    CreateProperty
  }
};
</script>

<style lang="scss" scoped>
.p-toolbar-group-right > * {
  margin: 5px;
}
.p-toolbar-group-left > * {
  margin: 5px;
}
</style>
