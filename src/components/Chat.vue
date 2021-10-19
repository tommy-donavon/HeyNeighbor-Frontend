<template>
  <div>
    <ul id="messages">
      <li v-for="(msg, index) in messages" :key="index">
        <div class="message">
          <Avatar
            v-if="msg.user.profile_uri === ''"
            :label="
              msg.user.first_name.charAt(0).toUpperCase() +
                msg.user.last_name.charAt(0).toUpperCase()
            "
            style="color:black;user-select:none;"
            size="large"
          />
          <div>
            <h3>{{ msg.user.username }}</h3>
            <p>{{ msg.message }}</p>
          </div>
        </div>
      </li>
    </ul>
    <div class="chat-input">
      <i class="pi pi-paperclip" style="color:white;" />
      <textarea
        v-on:keyup="textAreaAdjust"
        v-on:keyup.enter="onSubmit"
        v-model="textInput"
      />
    </div>
  </div>
</template>

<script>
import { toRefs, ref, watchEffect } from 'vue';
import { io } from 'socket.io-client';
import { useStore } from 'vuex';
import ChatClient from '../clients/chatClient'
export default {
  name: 'Chat',
  setup(props) {
    const { serverName, room } = toRefs(props);
    const store = useStore();
    const textInput = ref('');
    const messages = ref([]);
    const propTenants = ref([])
    onBeforeMount(async () => {
      try {
        propTenants.value.push(...store.getters.getCurrentUserProperties.filter(p => p.server_code === serverName.value))
        let pstMsg = await ChatClient.getPastChats(serverName.value,room.value[0].toUpperCase() + room.value.slice(1))
        if(pstMsg.messages !== undefined) {
          propTenants.value[0].tenants.forEach(t => {
            pstMsg.messages.forEach(m => {
              if(t.username === m.user_name){
                messages.value.push({
                  user: t,
                  message: m.message
                })
              }
            })
          })
        }
      }catch(err){
        console.error(err)
      }

    })
    let socket = io(`http://localhost:8080/${serverName.value}`, {
      path: `/api/chat/socket/`,
      query: { room: `${room.value[0].toUpperCase() + room.value.slice(1)}` },
      extraHeaders: {
        Authorization: `Bearer ${store.getters.getCurrentToken}`,
      },
    });

    socket.on('connect', () => {
      console.log(socket.connected);
    });

    socket.on('disconnect', (reason) => {
      console.log(reason);
    });

    socket.on('connect_error', (error) => {
      console.error(error);
    });

    socket.on('msg', (msg) => {
      console.log(msg);
      messages.value.push(room.value + ' ' + msg);
    });

    watchEffect(async () => {
      try {
        messages.value = []
        let pstMsg = await ChatClient.getPastChats(serverName.value,room.value[0].toUpperCase() + room.value.slice(1))
        if(pstMsg.messages !== undefined) {
          propTenants.value[0].tenants.forEach(t => {
            pstMsg.messages.forEach(m => {
              if(t.username === m.user_name){
                messages.value.push({
                  user: t,
                  message: m.message
                })
              }
            })
          })
        }
      }catch(err) {
        console.error(err)
      }
      socket.disconnect();
      socket = io(`http://localhost:8080/${serverName.value}`, {
        path: `/api/chat/socket/`,
        query: { room: `${room.value[0].toUpperCase() + room.value.slice(1)}` },
        extraHeaders: {
          Authorization: `Bearer ${store.getters.getCurrentToken}`,
        },
      });
      socket.connect();
    });

    const onSubmit = () => {
      let message = {
        user: store.getters.getCurrentUser,
        message: textInput.value.trim(),
      };
      messages.value.push(message);
      socket.emit('msg', message);
      textInput.value = '';
    };

    const textAreaAdjust = (event) => {
      event.target.style.height = '1px';
      event.target.style.height = `${25 + event.target.scrollHeight}px`;
    };

    return {
      textAreaAdjust,
      textInput,
      onSubmit,
      messages,
    };
  },
  props: {
    serverName: {
      type: String,
      required: true,
    },
    room: {
      type: String,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.chat-input {
  padding: 3px;
  position: fixed;
  display: flex;
  bottom: 0;
  background-color: gray;
  border-radius: 15px;
  width: 70%;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.chat-input > textarea {
  width: 100%;
  max-width: 100%;
  background-color: transparent;
  overflow: hidden;
  resize: none;
  border: none;
  font-size: 15px;
}

.chat-input > textarea:focus {
  outline: none;
}

#messages {
  list-style-type: none;
  margin: 0;
  padding: 0;
}
#messages li {
  padding: 5px 10px;
}
.message {
  background-color: lightgray;
  display: flex;
  width: fit-content;
  justify-content: flex-start;
  align-items: center;
  gap: 15px;
  padding: 5px;
  padding-right: 10px;
  border-radius: 15px;
}
</style>
