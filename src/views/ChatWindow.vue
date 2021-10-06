<template>
  <div class="chatarea">
    <div class="card">
      <PanelMenu :model="serverMenuOptions" />
      <!-- <Tree :value="onlineUsers" selectionMode="single" /> -->
    </div>
    <div v-if="isMounted" class="chat-window">
      <Chat :serverName="serverName" :room="serverRoom" />
    </div>
  </div>
</template>

<script>
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
          serverRoom.value = p;
        },
      };
    });
    const onlineUsers = property.tenants.map((t) => {
      if(t.user_status === 0) return t.username
    })

    onMounted(() => (isMounted.value = true));

    return {
      serverMenuOptions,
      serverName,
      serverRoom,
      isMounted,
      onlineUsers
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

.chat-window {
  margin: 20px;
}

.chatarea {
  display: flex;
}
</style>
