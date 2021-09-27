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
    <Button class="p-button-danger" label="Submit" @click="onSubmit({username:usernameValue, password:passwordValue}); onSuccessfulSubmit()" />
  </div>
</template>
//TODO check for user type
<script>
import { ref } from 'vue';
import {mapActions, useStore} from "vuex";
import {useRouter} from "vue-router"

export default {
  name: 'LoginForm',
  setup() {
    const usernameValue = ref('');
    const passwordValue = ref('');
    const store = useStore()
    const router = useRouter()

    const onSuccessfulSubmit = () => {
      const loginStatus = store.getters.getCurrentToken
      if(!loginStatus || loginStatus === ""){
        //present error message
      }
      router.push({name: 'User-Dash'})

      

    }

    return {
      usernameValue,
      passwordValue,
      ...mapActions({onSubmit:"setCurrentToken"}),
      onSuccessfulSubmit
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
