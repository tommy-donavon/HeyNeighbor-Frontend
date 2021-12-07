<template>
  <Toolbar style="background-color:transparent;border:none;">
    <template #left>
      <Avatar
        v-if="state.user.profile_uri === ''"
        :label="
          state.user.first_name.charAt(0).toUpperCase() +
            state.user.last_name.charAt(0).toUpperCase()
        "
        style="color:black;user-select:none;"
      />
      <Avatar v-else :image="state.user.profile_uri" />
      <h3 style="color:white;">{{ state.user.username }}</h3>
      <Button
        label="Pay Rent"
        @click="() => (state.showPayments = !state.showPayments)"
      />
      <Dialog
        header="Please Enter Your Information Below"
        v-model:visible="state.showPayments"
        style="width:fit-content;"
        @show="lookupRent"
      >
        <h3>Balance: {{ state.userBalance }}</h3>
        <Button label="Pay Now" @click="openPayPal" />
      </Dialog>
      <Button label="New Service Request" @click="goToMaintenanceDash" />
    </template>
    <template #right>
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
      <Button
        label="Add Property"
        @click="
          () =>
            (newPropertyInfo.dialog_visible = !newPropertyInfo.dialog_visible)
        "
      />
      <Dialog
        header="Add Property"
        v-model:visible="newPropertyInfo.dialog_visible"
        style="width:fit-content;"
      >
        <div class="new-prop-options">
          <div class="p-float-label">
            <InputText
              id="newPropCode"
              v-model="newPropertyInfo.server_code"
              style="width:100%;"
            />
            <label for="newPropCode">Please Enter Code Here</label>
          </div>
          <Button
            label="Enter"
            @click="submitCode(newPropertyInfo.server_code)"
          />
        </div>
      </Dialog>
      <Button label="Log out" @click="onLogout" />
    </template>
  </Toolbar>
  <ChatWindow
    v-if="state.currentProperty"
    class="chatWindow"
    :server_code="state.currentProperty.server_code"
  />
  <div v-else class="no-chat">
    <h2>
      Add a Property
    </h2>
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { reactive, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import ChatWindow from './ChatWindow.vue';
import PayPalClient from '../clients/paypalClient'
export default {
  name: 'UserDash',
  setup() {
    const store = useStore();
    const router = useRouter();
    let user = store.getters.getCurrentUser;
    let properties = store.getters.getCurrentUserProperties;
    const state = reactive({
      user: user,
      properties: properties,
      selectedProperty:
        properties[0] === undefined ? '' : properties[0].property_name,
      showPayments: false,
      currentProperty: {
        server_code: '',
        tenants: [],
      },
      userBalance: 0,
    });
    let propOptions = state.properties.map((p) => p.property_name);

    const newPropertyInfo = reactive({
      server_code: '',
      dialog_visible: false,
    });
    const lookupRent = () => {
      let rUser;
      if(state.currentProperty !== undefined){
        rUser = state.currentProperty.tenants.filter(
        (t) => t.username.toUpperCase() === state.user.username.toUpperCase(),
      )[0];
      return rUser.rent_agreement.amount_due;
      }
      return 0
    };
    const goToMaintenanceDash = () => {
      router.push({
        name: 'Maintenance-Dash',
        query: { server_code: state.currentProperty.server_code },
      });
    };

    watchEffect(() => {
      state.currentProperty = properties.filter(
        (p) => p.property_name === state.selectedProperty,
      )[0];

      state.userBalance = `$${lookupRent()}.00`
    });

    const onLogout = () => {
      window.sessionStorage.clear();
      window.location.reload();
    };

    const submitCode = async (server_code) =>
      await store.dispatch('addTenantToProperty', server_code);

    const openPayPal = async () => {
      const link = await PayPalClient.getActionUrl();
      window.open(link,"test", "popup")
    }

    return {
      state,
      propOptions,
      onLogout,
      newPropertyInfo,
      submitCode,
      goToMaintenanceDash,
      lookupRent,
      openPayPal
    };
  },
  components: {
    ChatWindow,
  },
};
</script>

<style lang="scss" scoped>
.p-toolbar-group-right > * {
  margin: 5px;
}
.p-toolbar-group-left > * {
  margin: 5px;
}
.new-prop-options {
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
  gap: 15px;
}
.no-chat {
  display: flex;
  justify-content: center;
  align-content: center;
  color: white;
}

.row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
}

.my-grid {
  border-radius: 5px;
}

.column {
  display: flex;
  flex-direction: column;
  flex-basis: 100%;
  flex: 1;
}

.chatWindow {
  margin: 10px;
}

.test-bt {
  width: 2rem;
  height: 2rem;
}
</style>
