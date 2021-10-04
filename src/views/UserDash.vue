<template>
  <div id="nav">
    <div class="user-options">
      <i class="pi pi-user" style="fontSize: 1rem" />
      <h3>{{ user.username }}</h3>
      <i class="pi pi-cog" style="fontSize: 1rem" />
    </div>
    <Button label="Log out" @click="onLogout" />
    <Dropdown
      v-model="selectedProperty"
      :options="propOptions"
      class="drop"
      @change="testChange"
    />
  </div>
  <div>
    <DashOptions
      optName="Tenant Chat"
      optImg="https://images1.apartments.com/i2/V81rGxWnZzR5onflaSGtH6cpUET0hfRD7MH5gitkUbU/116/the-piccadilly-apartments-salt-lake-city-ut-primary-photo.jpg?p=1"
      :optFunction="goToChat"
    />
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import DashOptions from '../components/DashOptions.vue';
export default {
  name: 'UserDash',
  setup() {
    const store = useStore();
    const router = useRouter();
    const user = reactive(store.getters.getCurrentUser);
    const properties = reactive(store.getters.getCurrentUserProperties);
    const selectedProperty = ref(properties[0].property_name || '');
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
    };
  },
  components: {
    DashOptions,
  },
};
</script>

<style lang="scss" scoped>
#nav {
  padding: 30px;
  position: sticky;
}
#nav button {
  float: right;
  margin: 0.1% 0.5%;
}
#nav .drop {
  float: right;
  margin: 0.1% 0.5%;
}
#nav .user-options {
  float: left;
  margin: 0 auto;
  color: #c5e1a5;
  display: flex;
}
#nav .user-options > * {
  margin: 0% 1.5%;
  user-select: none;
}
</style>
