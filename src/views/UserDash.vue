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
      <h3 style="color:white;">{{ state.user.username }}</h3>
      <Button label="Pay Rent" />
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
            (newPropertyInfo.dialog_visable = !newPropertyInfo.dialog_visable)
        "
      />
      <Dialog
        header="Add Property"
        v-model:visible="newPropertyInfo.dialog_visable"
        style="width:fit-content;"
      >
        <div class="new-prop-options">
          <div class="p-float-label">
            <InputText id="newPropCode" v-model="newPropertyInfo.server_code" style="width:100%;" />
            <label for="newPropCode">Please Enter Code Here</label>
          </div>
          <Button label="Enter" @click="submitCode(newPropertyInfo.server_code)" />
        </div>
      </Dialog>
      <Button label="Log out" @click="onLogout" />
    </template>
  </Toolbar>
  <ChatWindow
    v-if="currentProperty"
    class="chatWindow"
    :server_code="currentProperty.server_code"
  />
  <div v-else class="no-chat">
    <h2>
      Add a Property
    </h2>
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import ChatWindow from './ChatWindow.vue';
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
      selectedProperty: properties[0] === undefined ? '' : properties[0].property_name,
    });

    const newPropertyInfo = reactive({
      server_code: '',
      dialog_visable: false,
    });


    const currentProperty = properties[0];
    let propOptions = state.properties.map((p) => p.property_name);
    const goToMaintenanceDash = () =>{
      router.push({name: 'Maintenance-Dash', query:{server_code: currentProperty.server_code}})
    }

    const onLogout = () => {
      window.sessionStorage.clear();
      window.location.reload();
    };

    

    const submitCode = async (server_code) => await store.dispatch('addTenantToProperty',server_code)

    return {
      state,
      propOptions,
      onLogout,
      currentProperty,
      newPropertyInfo,
      submitCode,
      goToMaintenanceDash
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
