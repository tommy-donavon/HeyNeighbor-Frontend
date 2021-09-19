<template>
  <div>
    <ul id="messages"></ul>
    <div class="chat-input">
      <Textarea rows="1" cols="150" /><Button
        label="Enter"
        class="p-button-danger"
      />
    </div>
  </div>
</template>

<script>
import { toRefs, watchEffect } from 'vue';
import { io } from 'socket.io-client';
export default {
  name: 'ChatWindow',
  setup(props) {
    const { serverName, room } = toRefs(props);
    let socket = io('http://localhost:8080', {
      path: `/api/chat/${serverName.value}`,
      query: { room: `${room.value}` },
    });
    socket.on('connect', () => {
      console.log('hi');
    });
    socket.on('disconnect', (reason) => {
      console.log(reason);
    });

    watchEffect(() => {
      socket.disconnect()
      socket = io('http://localhost:8080', {
      path: `/api/chat/${serverName.value}`,
      query: { room: `${room.value}` },
    });
    })
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
  display: flex;
}

.chat-input > * {
  margin: 0.5%;
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
