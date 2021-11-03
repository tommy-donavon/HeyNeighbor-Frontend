<template>
  <Toolbar style="background-color:transparent;border:none;">
    <template #left>
      <Avatar
        v-if="state.user.profile_uri === ''"
        :label="state.user.username.charAt(0).toUpperCase()"
        style="color:black;user-select:none;"
      />
      <h3 style="color:white;">{{ state.user.username }}</h3>
      <Button @click="gotoMaintenancePage" label="Manage Maintenance Request" />
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
      <Button label="Log out" @click="onLogout" />
    </template>
  </Toolbar>
</template>

<script>
import { reactive, watchEffect } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

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
      currentProperty: {}
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
    })



    return { state, propOptions, onLogout, gotoMaintenancePage };
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
</style>
