<template>
  <div class="row">
    <div class="col-sm-10 offset-sm-1 col-md-8">
      <ul id="messageBody" class="border pt-1">
        <li
          v-for="(message, index) in messages"
          v-bind:key="index"
          :class="message.class" class="pr-1 mr-4 mb-0 py-0 text-left"
        >
          <small class="text-primary">{{ message.userName ? `${message.userName}: `: ''}}</small>
          <br />
          <span id="imgcontainer" @click.prevent="fullImage(message.img)" v-html="message.img"></span>
          {{message.message }}
        </li>
      </ul>
      <form @submit.prevent="sendMessage()">
        <div class="form-row">
            <div class="col-8">
              <input v-model="messageInput" class="form-control" type="text">
            </div>
            <div class="col-4">
              <EmojiPicker @emojiSelected="insertEmoji" />
              <ImageUpload :socket="socket" :room="room" />
              <button class="btn btn-outline-success float-left ml-1">Send</button>
            </div>
        </div>
      </form>
    </div>
    <div class="col-sm-10 offset-sm-1 col-md-2">
      <ul id="users" class="border p-0 list-group list-group-flush">
        <li class="list-group-item disabled">Room Users {{ (Object.keys(userSocket)).length }}</li>
        <input v-model="search" type="text" class="form-control no-border" placeholder="search users....">
        <li
          v-for="({userName: username, gender, country}, index) in usernames"
          v-bind:key="index" class="list-group-item"
        >
          <span :class="`gender ${gender? 'male': 'female'} d-block float-left`"></span>
          <p class="float-left pl-1"> {{ username }} </p>
          <small class="text-primary float-right">{{ country }}</small>
          <div v-if="username !== userName" class="float-left pl-1">
            <button class="btn btn-sm btn-outline-primary mr-1 rounded-circle" @click.prevent="initiateChat(userSocket[username].socketId)">
              <img src="/icons/chat.svg" width="16" height="16" title="chat">
            </button>
            <AddFriend v-if="isRegistered && userReg[`${username}`]" :userName="username" />
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import AddFriend from './AddFriend.vue';
import EmojiPicker from './EmojiPicker';
import ImageUpload from './Image';
import { EventBus } from '../eventbus/eventBus';

export default {
  props: ['room', 'isRegistered'],
  data() {
    return {
      socket: null,
      userSocket: {},
      userReg: {},
      socketUser: {},
      messageInput: '',
      messages: [],
      search: '',
      userName: null,
    };
  },
  created() {
    this.socket = this.$store.getters.getSocket;
    this.userName = this.$store.getters.userName;

    this.socket.on('roomJoin', ({ user, socketId, isRegistered }) => {
      console.log('chat.vue room join');
      Vue.set(this.userSocket, `${user.userName}`, user);
      Vue.set(this.socketUser, `${socketId}`, user);
      Vue.set(this.userReg, `${user.userName}`, isRegistered);
      this.messages.push({ message: `${user.userName} joined`, class: 'text-center' });
    });

    this.socket.on('roomLeave', ({ userName }) => {
      console.log('left room with username: ', userName);
      Vue.delete(this.socketUser, this.userSocket[`${userName}`].socketId);
      Vue.delete(this.userSocket, `${userName}`);
      Vue.delete(this.userReg, `${userName}`);
    });

    this.socket.on('userDisconnected', ({ socketId, userName }) => {
      if (this.socketUser.hasOwnProperty(`${socketId}`)) {
        console.log('user disconnect socketId: ', socketId, ' username: ', userName);
        Vue.delete(this.userSocket, `${userName}`);
        Vue.delete(this.userReg, `${userName}`);
        Vue.delete(this.socketUser, `${socketId}`);
      }
    });

    this.socket.on('newMessage', ({ userName, message }) => {
      this.messages.push({ userName, message, class: (userName === this.userName ? 'text-success' : '') });

      this.scrollDown();
    });

    this.socket.on('newImage', ({ userName, image, room }) => {
      console.log('chat ', room, ' ', this.room);
      if (room === this.room) {
        const img = `<img src="data:image/png;base64, ${image}" class="img-thumbnail mb-3" width="96" height="96" />`;
        this.messages.push({ userName, img, class: '' });
        this.scrollDown();
      }
    });

    this.axios.get(`/users/room/${this.room}`).then(({ data }) => {
      data.users.forEach((user) => {
        Vue.set(this.userSocket, `${user.userName}`, user);
        Vue.set(this.userReg, `${user.userName}`, user.isRegistered);
        Vue.set(this.socketUser, `${user.socketId}`, user);
      });
    });
  },
  methods: {
    sendMessage() {
      this.socket.emit('sendMessage', {
        message: this.messageInput,
        room: this.room,
        userName: this.$store.getters.userName,
      });
      this.messageInput = '';
    },
    initiateChat(socket) {
      if (socket != this.socket.id) {
        this.$store.commit('addChat', { socket, recieverUserName: this.socketUser[`${socket}`].userName, senderUserName: this.socketUser[`${this.socket.id}`].userName });
      }
    },
    insertEmoji(emoji) {
      this.messageInput += emoji;
    },
    fullImage(img) {
      img = img.replace('width="96"', '');
      img = img.replace('height="96"', '');
      EventBus.$emit('showImage', { img });
    },
    scrollDown() {
      const messageBody = document.querySelector('#messageBody');
      messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight + 48;
    },
  },
  computed: {
    usernames() {
      if (this.search === '') return this.userSocket;
      const users = [];
      Object.keys(this.userSocket).forEach((element) => {
        if (element.includes(this.search)) users.push(this.userSocket[element]);
      });
      return users;
    },
  },
  watch: {
    room() {
      this.axios.get(`/users/room/${this.room}`).then(({ data }) => {
        console.log('chat.vue watch room');
        this.userSocket = {};
        this.socketUser = {};
        this.userReg = {};
        this.messages = null;
        this.messages = [];
        this.messageInput = '';
        data.users.forEach((user) => {
          Vue.set(this.userSocket, `${user.userName}`, user);
          Vue.set(this.userReg, `${user.userName}`, user.isRegistered);
          Vue.set(this.socketUser, `${user.socketId}`, user);
        });
      });
    },
  },
  components: {
    EmojiPicker,
    AddFriend,
    ImageUpload,
  },
};
</script>

<style scoped>
ul{
  list-style: none;
  height: 400px;
  overflow-y: auto;
}

#users li{
  cursor:pointer;
}
#users li:hover{
  text-decoration:underline;
}

#imgcontainer{
  cursor: pointer;
}

.no-border{
  border: 0;
}

.gender{
  height: 100%;
  width: 5%;
}

.male{
  background-color: cadetblue;
}

.female{
  background-color: pink;
}
</style>
