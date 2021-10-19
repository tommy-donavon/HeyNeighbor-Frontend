<template>
  <Toolbar style="background-color:transparent;border:none;">
    <template #left>
      <Avatar
        v-if="usrImg === ''"
        :label="user.username.charAt(0).toUpperCase()"
        style="color:black;user-select:none;"
      />
      <h3 style="color:white;">{{ user.username }}</h3>
    </template>
    <template #right>
      <Button label="Log out" @click="onLogout" />
      <Dropdown
        v-model="selectedProperty"
        :options="propOptions"
        class="drop"
        @change="testChange"
      />
    </template>
  </Toolbar>
  <div id="nav">
    <div class="user-options"></div>
  </div>
  <div class="my-grid">
    <div class="row">
      <div class="column">
        <DashOptions
          optName="Tenant Chat"
          optImg="../assets/appstore.svg"
          :optFunction="goToChat"
          optDescription="Communicate with other Tenants"
          ><ChatWindow :server_code="serverCode"
        /></DashOptions>
      </div>
      <div class="column">
        <DashOptions
          optName="Amount Owed:"
          optImg="../assets/appstore.svg"
          :optFunction="goToChat"
          optDescription="Submit a Rent Payment"
        >
        </DashOptions>
      </div>
      <div class="column">
        <DashOptions
          optName="Make Service Request"
          optImg="../assets/appstore.svg"
          :optFunction="goToChat"
          optDescription="Submit a Maintenance Request"
        >
        </DashOptions>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import DashOptions from '../components/DashOptions.vue';
import ChatWindow from './ChatWindow.vue';
export default {
  name: 'UserDash',
  setup() {
    const store = useStore();
    const router = useRouter();
    const user = reactive(store.getters.getCurrentUser);
    const properties = store.getters.getCurrentUserProperties;
    const serverCode = ref(properties[0].server_code);
    const selectedProperty = ref(properties[0].property_name || '');
    const propImg = ref(properties[0].property_img || '');
    const usrImg = ref(user.profile_uri || '');
    let propOptions = properties.map((p) => p.property_name);

    const onLogout = () => {
      window.sessionStorage.clear();
      window.location.reload();
    };

    const testChange = () => {
      console.log(selectedProperty.value);
    };

    const goToChat = () => {
      const code = properties.find(
        (p) => (p.property_name = selectedProperty.value),
      ).server_code;
      router.push({ name: 'Chat', query: { code: code } });
    };

    return {
      user,
      onLogout,
      selectedProperty,
      propOptions,
      testChange,
      goToChat,
      propImg,
      usrImg,
      serverCode,
    };
  },
  components: {
    DashOptions,
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
</style>
