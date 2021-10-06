<template>
  <div id="nav">
    <h2>HeyNeighbor</h2>
    <div class="spacer">pad</div>
    <div class="btns">
      <Button label="Log in" @click="ToggleLogin" />
      <Button label="Sign up" @click="ToggleAccount" />
    </div>
  </div>
  <div>
    <Popup v-if="popupLogin" :TogglePopup="ToggleLogin">
      <LoginForm />
    </Popup>
    <Popup v-if="popupAcocunt" :TogglePopup="ToggleAccount">
      <CreateAccountForm />
    </Popup>
  </div>
</template>

<script>
import LoginForm from '@/components/LoginForm.vue';
import CreateAccountForm from '../components/CreateAccountForm.vue'
import Popup from '@/components/Popup.vue';
import { ref } from 'vue';

export default {
  name: 'Home',
  setup() {
    const popupLogin = ref(false);
    const popupAcocunt = ref(false)
    const ToggleLogin = () => (popupLogin.value = !popupLogin.value);
    const ToggleAccount = () => (popupAcocunt.value = !popupAcocunt.value);

    return {
      popupLogin,
      ToggleLogin,
      popupAcocunt,
      ToggleAccount
    };
  },
  components: {
    LoginForm,
    Popup,
    CreateAccountForm
  },
};
</script>
<style lang="scss" scoped>
#nav {
  padding: 10px;
  position: sticky;
  display: flex;
  background-color: #3f403f;
  justify-content: space-evenly;
  border-radius: 2px;
  gap: 10px;
}

#nav h2 {
  color: #9fb8ad;
}

#nav .btns {
  display: flex;
  justify-content: space-evenly;
  gap: 10px;
}

#nav .spacer {
  visibility: hidden;
  flex-grow: 2;
}
</style>
