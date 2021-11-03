<template>
  <div class="chatarea">
    <div class="card">
      <PanelMenu :model="state.serverMenuOptions" />
    </div>
    <div v-if="state.isMounted" class="chat-window">
      <Chat :serverName="state.server_code" :room="state.server_room" />
    </div>
  </div>
</template>

<script>
import { toRefs, onMounted, reactive } from 'vue';
import { useStore } from 'vuex';

import Chat from '@/components/Chat.vue';
export default {
  name: 'ChatWindow',
  setup(props) {
    const store = useStore();
    const { server_code } = toRefs(props);
    const property = store.getters.getCurrentUserProperties.find((p) => p.server_code == server_code.value)
    const state = reactive({
      isMounted: false,
      server_code: server_code,
      avaliableUsers: property.tenants.filter(
        (t) =>
          t.user_status === 0 &&
          t.username !== store.getters.getCurrentUser.username,
      ),
      server_room: 'general',
      serverMenuOptions: property.channels.map((p) => {
        return {
          label: p,
          icon: 'pi pi-check',
          command: () => {
            state.server_room = p;
          },
        };
      }),
    });

    onMounted(() => (state.isMounted = true));

    return { state };
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
