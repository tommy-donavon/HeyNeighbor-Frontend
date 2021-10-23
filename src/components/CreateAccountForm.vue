<template>
  <Toast />
  <Toast position="top-center" group="tc" />
  <div class="parent-form">
    <div class="p-float-label">
      <InputText
        id="username"
        v-model="state.username.value"
        :class="{ 'p-isInvalid': state.username.isInvalid }"
        @focus="() => (state.username.focused = true)"
      />
      <label for="username" :class="{ 'p-error': state.username.isInvalid }"
        >Username</label
      >
    </div>
    <small v-if="state.username.isInvalid" class="p-error"
      >Please Enter in Username</small
    >
    <div class="p-float-label">
      <Password
        v-model="state.password.value"
        @focus="() => (state.password.focused = true)"
      >
        <template #header>
          <h6>Pick a password</h6>
        </template>
        <template #footer="sp">
          {{ sp.level }}
          <Divider />
          <p class="p-mt-2">Suggestions</p>
          <ul class="p-pl-2 p-ml-2 p-mt-0" style="line-height: 1.5">
            <li>At least one lowercase</li>
            <li>At least one uppercase</li>
            <li>At least one numeric</li>
            <li>Minimum 8 characters</li>
          </ul>
        </template>
      </Password>
      <label for="password" :class="{ 'p-error': state.password.isInvalid }"
        >Password</label
      >
    </div>
    <small v-if="state.password.isInvalid" class="p-error"
      >Please enter at least a medium strength password</small
    >
    <div class="p-float-label">
      <InputText
        id="first_name"
        v-model="state.first_name.value"
        :class="{ 'p-isInvalid': state.first_name.isInvalid }"
        @focus="() => (state.first_name.focused = true)"
      />
      <label for="first_name" :class="{ 'p-error': state.username.isInvalid }"
        >First Name</label
      >
    </div>
    <small v-if="state.first_name.isInvalid" class="p-error"
      >Please Enter Your First Name</small
    >
    <div class="p-float-label">
      <InputText
        id="last_name"
        v-model="state.last_name.value"
        :class="{ 'p-isInvalid': state.last_name.isInvalid }"
        @focus="() => (state.last_name.focused = true)"
      />
      <label for="last_name" :class="{ 'p-error': state.last_name.isInvalid }"
        >Last Name</label
      >
    </div>
    <small v-if="state.last_name.isInvalid" class="p-error"
      >Please Enter Your Last Name</small
    >
    <div class="p-float-label">
      <InputText
        id="email"
        v-model="state.email.value"
        :class="{ 'p-isInvalid': state.email.isInvalid }"
        @focus="() => (state.email.focused = true)"
      />
      <label for="email" :class="{ 'p-error': state.email.isInvalid }"
        >Email</label
      >
    </div>
    <small v-if="state.email.isInvalid" class="p-error"
      >Please Enter A Valid Email</small
    >
    <div class="account-types">
      <div class="p-field-radiobutton">
        <RadioButton
          name="accountTenant"
          value="Tenant"
          v-model="accountType"
        />
        <label for="accountTenant"> Tenant</label>
      </div>
      <div class="p-field-radiobutton">
        <RadioButton name="accountAdmin" value="Admin" v-model="accountType" />
        <label for="accountAdmin"> Property Manager</label>
      </div>
    </div>
    <Button label="Submit" @click="submit" />
  </div>
</template>

<script>
import { reactive, watchEffect, ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import UserClient from '../clients/userClient';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  name: 'CreateAccountForm',
  setup() {
    const state = reactive({
      username: { value: '', isInvalid: true, focused: false },
      password: { value: '', isInvalid: true, focused: false },
      first_name: { value: '', isInvalid: true, focused: false },
      last_name: { value: '', isInvalid: true, focused: false },
      email: { value: '', isInvalid: true, focused: false },
      account_type: { value: 1 },
    });
    const accountType = ref('Tenant');
    const toast = useToast();
    const store = useStore();
    const router = useRouter();

    watchEffect(() => {
      state.username.isInvalid =
        state.username.focused && !/^\w+$/.test(state.username.value);

      state.password.isInvalid =
        state.password.focused &&
        !/^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})./.test(
          state.password.value,
        );

      state.first_name.isInvalid =
        state.first_name.focused && !/^[A-z]+$/.test(state.first_name.value);

      state.last_name.isInvalid =
        state.last_name.focused && !/^[A-z]+$/.test(state.last_name.value);
      state.email.isInvalid =
        state.email.focused &&
        !/^([\w.-]+)@([\w-]+)((\.(\w){2,3})+)$/.test(state.email.value);

      state.account_type.value = accountType.value === 'Tenant' ? 1 : 0;
    });

    const submit = async () => {
      let userInfo = {};
      for (const prop in state) {
        if (state[prop].isInvalid) {
          toast.add({
            severity: 'error',
            summary: 'Please Try Again',
            detail: 'Sign Up Failed',
            group: 'tc',
            life: 4000,
          });
          return;
        }
        userInfo[prop] = state[prop].value;
      }
      try {
        await UserClient.createUserAccount(userInfo);
        await store.dispatch('setCurrentToken', {
          username: state.username.value,
          password: state.password.value,
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
        if (user.account_type === 1) {
          router.push({ name: 'User-Dash' });
        }
      } catch (err) {
        toast.add({
          severity: 'error',
          summary: 'Please Try Again',
          detail: 'Sign Up Failed',
          group: 'tc',
          life: 4000,
        });
      }
    };
    return {
      state,
      accountType,
      submit,
    };
  },
};
</script>

<style lang="scss" scoped>
.sizes {
  .p-inputtext {
    display: block;
    margin-bottom: 0.5rem;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.parent-form {
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  align-items: center;
  align-content: space-around;
  gap: 25px;
}
</style>
