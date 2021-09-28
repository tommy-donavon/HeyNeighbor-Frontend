<template>
  <div class="chatarea">
    <div class="card">
      <PanelMenu :model="serverMenuOptions" />
    </div>
    <div v-if="isMounted">
      <Chat :serverName="serverName" :room="serverRoom" />
    </div>
  </div>
</template>

<script>
//TODO fetch property servers from api
import { ref, reactive, toRefs, onMounted } from 'vue';
import { useStore } from 'vuex';

import Chat from '@/components/Chat.vue';
export default {
  name: 'ChatWindow',
  setup(props) {
    const isMounted = ref(false);
    const store = useStore();
    const { server_code } = toRefs(props);
    const property = reactive(
      store.getters.getCurrentUserProperties.find(
        (p) => p.server_code == server_code.value,
      ),
    );
    const serverName = ref(property.server_code);
    const serverRoom = ref('general');
    const serverMenuOptions = property.channels.map((p) => {
      return {
        label: p,
        icon: 'pi pi-check',
        command: () => {
          serverRoom.value = p.toLowerCase();
        },
      };
    });

    onMounted(() => {
      isMounted.value = true;
      console.log(isMounted);
      console.log(serverName.value);
      console.log(serverRoom.value);
    });

    return {
      serverMenuOptions,
      serverName,
      serverRoom,
      isMounted,
    };
  },
  components: {
    Chat,
  },
  props: {
    server_code: {
      type: String,
    },
  },
};
</script>

<style scoped lang="scss">
.p-panelmenu {
  width: 22rem;
}

.chatarea {
  display: flex;
}
</style>
