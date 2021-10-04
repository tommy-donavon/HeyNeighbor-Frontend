<template>
  <div>
    <ul id="messages">
      <li v-for="(msg, index) in messages" :key="index">{{ msg }}</li>
    </ul>
    <div class="chat-input">
      <Textarea
        class="chat-text"
        rows="1"
        v-model="textInput"
        v-on:keyup.enter="onSubmit"
      />
    </div>
  </div>
</template>

//TODO make dynamic
<script>
import { toRefs, ref, watchEffect } from 'vue';
import { io } from 'socket.io-client';
import { useStore } from 'vuex';
export default {
  name: 'Chat',
  setup(props) {
    const { serverName, room } = toRefs(props);
    const store = useStore();
    const textInput = ref('');
    const messages = ref([]);
    console.log(room.value);
    let socket = io(`http://localhost:8080/${serverName.value}`, {
      path: `/api/chat/`,
      query: { room: `${room.value[0].toUpperCase() + room.value.slice(1)}` },
      extraHeaders: {
        Authorization: `Bearer ${store.getters.getCurrentToken}`,
      },
    });

    socket.on('connect', () => console.log(socket.connected));
    
    socket.on('disconnect', (reason) => console.log(reason));

    socket.on('connect_error', (error) => console.error(error));

    socket.on('msg', (msg) => {
      console.log(msg);
      messages.value.push(room.value + ' ' + msg);
    });

    watchEffect(() => {
      messages.value = [];
      // socket.disconnect()
      socket = io(`http://localhost:8080/${serverName.value}`, {
        path: `/api/chat/`,
        query: { room: `${room.value[0].toUpperCase() + room.value.slice(1)}` },
        extraHeaders: {
          Authorization: `Bearer ${store.getters.getCurrentToken}`,
        },
      });
    });

    const onSubmit = () => {
      // messages.value.push(textInput.value)
      socket.emit('msg', textInput.value);
      textInput.value = '';
    };

    return {
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
}

// .chat-input .chat-text{

// }

#messages {
  list-style-type: none;
  margin: 0;
  padding: 0;
}
#messages li {
  padding: 5px 10px;
}
#messages li:nth-child(odd) {
  background: #eee;
}
</style>
