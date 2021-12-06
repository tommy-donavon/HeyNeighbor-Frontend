<template>
  <div class="chat-area">
    <div class="msg-scroll">
      <ul id="messages">
        <li v-for="(msg, index) in state.messages" :key="index">
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
            <Avatar v-else :image="msg.user.profile_uri" size="large" />
            <div>
              <h3>{{ msg.user.username }}</h3>
              <p v-if="msg.message">{{ msg.message }}</p>
              <Image
                v-if="msg.image_uri || msg.image"
                :src="msg.image_uri || msg.image"
                alt="image"
                width="250"
                preview
              />
            </div>
          </div>
        </li>
      </ul>
    </div>

    <div class="chat-input">
      <i
        class="pi pi-paperclip"
        style="color:white;"
        type="file"
        @click="handleFileClick"
      />
      <input
        style="visibility: hidden;width:1px;"
        type="file"
        id="upload-img"
        name="upload-img"
        @change="addAttachment($event)"
        accept="image/*"
      />
      <textarea
        v-on:keyup="textAreaAdjust"
        v-on:keyup.enter="onSubmit"
        v-model="state.textInput"
      />
    </div>
  </div>
</template>

<script>
import { toRefs, reactive, watchEffect, onBeforeMount } from 'vue';
import { io } from 'socket.io-client';
import { useStore } from 'vuex';
import ChatClient from '../clients/chatClient';
import AWSCLient from '../clients/awsBucketClient';
export default {
  name: 'Chat',
  setup(props) {
    const { serverName, room } = toRefs(props);

    const state = reactive({
      textInput: '',
      messages: [],
      propTenants: [],
    });
    const store = useStore();
    let pstMsg = [];
    onBeforeMount(async () => {
      try {
        state.messages = [];
        state.propTenants.push(
          ...store.getters.getCurrentUserProperties.filter(
            (p) => p.server_code === serverName.value,
          ),
        );
      } catch (err) {
        console.error(err);
      }
    });
    let socket = io(`http://localhost:8080/${serverName.value}`, {
      path: `/api/chat/socket/`,
      query: { room: `${room.value[0].toUpperCase() + room.value.slice(1)}` },
      extraHeaders: {
        Authorization: `Bearer ${store.getters.getCurrentToken}`,
      },
    });

    socket.on('connect', async () => {
      console.log(socket.connected);
    });

    socket.on('disconnect', (reason) => {
      console.log(reason);
    });

    socket.on('connect_error', (error) => {
      console.error('hi');
      console.error(error);
    });

    socket.on('msg', (msg) => {
      console.log(msg);
      state.messages.push(room.value + ' ' + msg);
    });

    watchEffect(async () => {
      try {
        state.messages = [];
        pstMsg = await ChatClient.getPastChats(
          serverName.value,
          room.value[0].toUpperCase() + room.value.slice(1),
        );
        if (pstMsg.messages !== undefined) {
          state.propTenants[0].tenants.forEach((t) => {
            pstMsg.messages.forEach((m) => {
              if (t.username === m.user_name) {
                state.messages.push({
                  user: t,
                  message: m.message,
                  image: m.image_uri,
                  time: m.time,
                });
              }
            });
          });
        }
        state.messages = state.messages.sort((a,b) => new Date(a.time).getTime() - new Date(b.time).getTime())
      } catch (err) {
        console.error(err);
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
        message: state.textInput.trim(),
      };
      state.messages.push(message);
      socket.emit('msg', message);
      state.textInput = '';
    };

    const textAreaAdjust = (event) => {
      event.target.style.height = '1px';
      event.target.style.height = `${25 + event.target.scrollHeight}px`;
    };

    const handleFileClick = () => document.getElementById('upload-img').click();
    const addAttachment = async (fileInput) => {
      const file = fileInput.target.files[0];
      console.log(file);
      const response = await AWSCLient.uploadPhoto(
        store.getters.getCurrentUser.username,
        file,
        'image/*',
      );
      let message = {
        user: store.getters.getCurrentUser,
        image_uri: response,
      };
      state.messages.push(message);
      socket.emit('msg', message);
    };

    return {
      textAreaAdjust,
      state,
      onSubmit,
      handleFileClick,
      addAttachment,
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
.chat-area {
  display: flex;
  width: 70vw;
  height: 80vh;
  flex-flow: column nowrap;
  border-radius: 5px;
  background-color: lightgray;
  justify-content: space-between;
  align-content: center;
}

.chat-input {
  display: flex;
  background-color: gray;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 5px;
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
.msg-scroll {
  overflow: hidden;
  overflow-y: auto;
}

#messages {
  list-style-type: none;
  margin: 0;
  padding: 0;
  top: 0;
  animation: scroll 10s linear 1s infinite;
}
@keyframes scroll {
  100% {
    top: -360px;
  }
}
#messages li {
  padding: 5px 10px;
  border-top: 1px solid #9d989e;
  border-bottom: 1px solid #9d989e;
}
.message {
  background-color: lightgray;
  display: flex;
  width: fit-content;
  justify-content: flex-start;
  align-items: center;
  gap: 15px;
  padding-right: 10px;
}
</style>
