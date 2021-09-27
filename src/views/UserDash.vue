<template>
  <div id="nav">
    <h2>HeyNeighbor</h2>
    <!-- <Button class="p-button-danger" label="Log in" /> -->
    <Button class="p-button-danger" label="Log out" @click="onLogout" />
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { reactive } from 'vue';
export default {
  name: 'UserDash',
  setup() {
    const store = useStore();
    const user = reactive(store.getters.getCurrentUser);
    const onLogout = () => {
      window.sessionStorage.clear();
      window.location.reload()
    };

    return {
      user,
      onLogout,
      // ...mapGetters({user:'getCurrentUser'})
    };
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

#nav h2 {
  float: left;
  margin: 0 auto;
  color: lightcoral;
}
</style>
