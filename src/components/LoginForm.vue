<template>
  <div class="login-form">
    <span class="p-float-label">
      <InputText id="username" type="text" v-model="usernameValue" />
      <label for="username">Username</label>
    </span>
    <span class="p-float-label">
      <Password id="password" v-model="passwordValue" toogleMask></Password>
      <label for="password">Password</label>
    </span>
    <Button class="p-button-danger" label="Submit" @click="onSubmit({username:usernameValue, password:passwordValue})" />
  </div>
</template>

<script>
import { ref } from 'vue';
import {mapActions} from "vuex";

export default {
  name: 'LoginForm',
  setup() {
    const usernameValue = ref('');
    const passwordValue = ref('');
    return {
      usernameValue,
      passwordValue,
      ...mapActions({onSubmit:"setCurrentToken"}),
    };
  },
  // computed: {
  //   ...mapGetters({token:"getCurrentToken"}),
  //   ...mapGetters({user:"getCurrentUser"})
  // }
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
.login-form > * {
  margin: 30px 0;
}
.login-form{
  display: flex;
  flex-direction: column;
  width: fit-content;
  background-color: gray;
  border-radius: 5%;
  padding: 1%;
}

.p-field * {
  display: block;
}
</style>
