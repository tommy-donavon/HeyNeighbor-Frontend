<template>
  <Toast />
  <Toast position="top-center" group="tc" />
  <div class="login-info">
    <span class="p-float-label">
      <InputText id="username" type="text" v-model="state.username" />
      <label for="username">Username</label>
    </span>
    <span class="p-float-label">
      <Password
        id="password"
        :feedback="false"
        :toogleMask="true"
        v-model="state.password"
      ></Password>
      <label for="password">Password</label>
    </span>

    <Button label="Submit" @click="onSuccessfulSubmit(state)" />
  </div>
</template>
<script>
import { reactive } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';

export default {
  name: 'LoginForm',
  setup() {
    const state = reactive({
      username: '',
      password: '',
    });
    const store = useStore();
    const router = useRouter();
    const toast = useToast();

    const onSuccessfulSubmit = async ({ username, password }) => {
      await store.dispatch('setCurrentToken', {
        username: username,
        password: password,
      });
      const loginStatus = await store.getters.getCurrentToken;
      const user = await store.getters.getCurrentUser;
      if (!loginStatus || loginStatus === '') {
        toast.add({
          severity: 'error',
          summary: 'Please Try Again',
          detail: 'Log In Failed',
          group: 'tc',
          life: 4000,
        });
      }
      if (user.account_type === 1) router.push({ name: 'User-Dash' });
      else if (user.account_type === 0) router.push({ name: 'Admin-Dash' });
    };

    return {
      state,
      onSuccessfulSubmit,
    };
  },
};
</script>

<style lang="scss" scoped>
.login-info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 15px;
}
.login-info > * {
  margin: 5px;
}
</style>
