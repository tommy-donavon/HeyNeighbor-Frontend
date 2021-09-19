<template>
  <div class="chatarea">
    <div class="card">
      <PanelMenu :model="serverMenuOptions" />
    </div>
    <ChatWindow :serverName="serverName" :room="serverRoom"/>
  </div>
</template>

<script>
//TODO fetch property servers from api
import { ref} from "vue"
import ChatWindow from "@/components/ChatWindow.vue"
export default {
    name: 'Chat',
    setup() {
      const serverName = ref('test')
      const serverRoom = ref('general')
  
        return {
            serverMenuOptions: [
              {
                label: 'General',
                icon: "pi pi-check",
                command:() => {
                  serverRoom.value = "general"
                }
              },
              {
                label: 'Announcments',
                icon: "pi pi-check",
                command:() => {
                  serverRoom.value = "announcements"
                }
              }
            ],
            serverName,
            serverRoom
        }
    },
    components:{
      ChatWindow,
    }

}
</script>

<style scoped lang="scss">
.p-panelmenu {
    width: 22rem;
}

.chatarea {
  display: flex;
}
</style>