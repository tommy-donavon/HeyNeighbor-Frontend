<template>
  <Toolbar style="background-color:transparent;border:none;">
    <template #left>
      <i
        class="pi pi-arrow-left back"
        style="color:white;"
        @click="() => router.go(-1)"
      />
    </template>
  </Toolbar>
  <chat class="chat-window" :room="server_room" :serverName="server_code" />
</template>

<script>
import { useRouter } from 'vue-router';
// import { onBeforeMount,toRefs, reactive  } from 'vue';
// import {useStore} from 'vuex'
import Chat from '../components/Chat.vue';
export default {
  name: 'AdminPrivateChat',
  setup() {
    const router = useRouter();
    // const store = useStore()
    // const {server_code} = toRefs(props)
    // const state = reactive({
    //   textInput: '',
    //   messages: [],
    //   propTenants: [],
    // });
    // onBeforeMount(async () => {
    //   try {
    //     state.messages = [];
    //     state.propTenants.push(
    //       ...store.getters.getCurrentUserProperties.filter(
    //         (p) => p.server_code === server_code.value,
    //       ),
    //     );
    //   } catch (err) {
    //     console.error(err);
    //   }
    // });
    return { router };
  },
  props: {
    server_code: {
      type: String,
      required: true,
    },
    server_room: {
      type: String,
      required: true,
    },
  },
  components: {
    Chat,
  },
};
</script>

<style scoped lang="scss">
.chat-window {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: 90%;
  height: 80%;
}
</style>
