<template>
  <div>
    <ul id="messages">
      <li v-for="(msg,index) in messages" :key="index" >{{msg}}</li>
    </ul>
    <div class="chat-input">
      <Textarea rows="1" cols="150" v-model="textInput" />
      <Button label="Enter" class="p p-button-danger" @click="onSubmit" />
    </div>
  </div>
</template>

//TODO make dynamic
<script>
import { toRefs, ref, watchEffect } from 'vue';
import { io } from 'socket.io-client';
export default {
  name: 'Chat',
  setup(props) {
    const { serverName, room } = toRefs(props);
    const textInput = ref('');
    const messages = ref([]);
    let socket = io(`http://localhost:8080/${serverName.value}`, {
      path: `/api/chat/`,
      query: { room: `${room.value}` },
    });

    socket.on('connect', () => {
      console.log(socket.connected);
    });
    socket.on('disconnect', () => {
      console.log(socket.connected);
    });
    socket.on('connect_error', (error) => {
      console.log(error);
    });

    socket.on('msg', (msg) => {
      messages.value.push(msg)
    });

    watchEffect(() => {
      socket.disconnect()
      socket = io(`http://localhost:8080/${serverName.value}`, {
      path: `/api/chat/`,
      query: { room: `${room.value}` },
    });
    })

    const onSubmit = () => {
      messages.value.push(textInput.value)
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
  bottom: 0;
}

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
