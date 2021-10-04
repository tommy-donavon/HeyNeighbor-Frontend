<template>
  <div id="nav">
    <h2>HeyNeighbor</h2>
    <div class="spacer">pad</div>
    <div class="btns">
      <Button label="Log in" @click="TogglePopup" />
      <Button label="Sign up" />
    </div>
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
