<template>
  <div id="nav">
    <h2>HeyNeighbor</h2>
    <Button class="p-button-danger" label="Log in" @click="TogglePopup" />
    <Button class="p-button-danger" label="Sign up" />
  </div>
  <div>
    <Popup v-if="popupTrigger" :TogglePopup="TogglePopup">
      <LoginForm />
    </Popup>
  </div>
</template>

<script>
import LoginForm from '@/components/LoginForm.vue';
import Popup from '@/components/Popup.vue';
import { ref } from 'vue';

export default {
  name: 'Home',
  setup() {
    const popupTrigger = ref(false);
    const TogglePopup = () => (popupTrigger.value = !popupTrigger.value);

    return {
      popupTrigger,
      TogglePopup,
    };
  },
  components: {
    LoginForm,
    Popup,
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
