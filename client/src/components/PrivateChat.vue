<template>
    <div v-show="show" class="card col-md-3 position-fixed fixed-bottom chatContainer px-0" :class="offset">
        <div class="card-header bg-dark p-1">
          <a role="button" data-toggle="collapse" class="text-white" :href="target">
              {{ otherUsername  }}
          </a>
          <button class="btn btn-sm btn-danger float-right text-white" @click="close">X</button>
        </div>
        <div class="card-body collapse p-1" :id="id">
          <div class="card-text">
            <ul :id="messageBodyId" class="p-1 m-2 border rounded">
                <li v-for="(msg, index) in messages" v-bind:key="index" :class="msg.class">
                  <small class="text-primary">{{msg.userName}}:</small>
                  <br/>
                  <span id="imgcontainer" @click.prevent="fullImage(msg.img)" v-html="msg.img"></span>
                  {{msg.message}}
                </li>
            </ul>
          </div>
          <form @submit.prevent= "sendMessage">
            <div class="form-row">
              <div class="col-7">
                <input v-model="msgInput" type="text" class="form-control">
              </div>
              <div class="col-5">
                <EmojiPicker @emojiSelected="insertEmoji" />
                <ImageUpload :socket="socket" :room="endSocket.room" />
                <button class="btn btn-sm btn-outline-success float-left mt-1">send</button>
              </div>
            </div>
          </form>
        </div>
    </div>
</template>

<script>
import EmojiPicker from './EmojiPicker';
import ImageUpload from './Image';
import { EventBus } from '../eventbus/eventBus';

export default {
  props: ['endSocket', 'number'],
  data() {
    return {
      socket: null,
      show: true,
      userName: null,
      messages: [],
      msgInput: '',
    };
  },
  created() {
    this.socket = this.$store.getters.getSocket;
    this.userName = this.$store.getters.userName;

    this.socket.on('recievePrivateMessage', ({ message, userName, room }) => {
      if (room === this.endSocket.room) this.messages.push({ message, userName, class: userName == this.userName ? 'text-left' : 'text-right' });
      this.scrollDown();
    });

    this.socket.on('newImage', ({ userName, image, room }) => {
      if (room === this.endSocket.room) {
        const img = `<img src="data:image/png;base64, ${image}" class="img-thumbnail mb-3" width="64" height="64" />`;
        this.messages.push({ userName, img, class: userName == this.userName ? 'text-left' : 'text-right' });
        this.scrollDown();
      }
    });
    this.socket.on('userDisconnected', ({ socketId, userName }) => {
      if (socketId === this.endSocket.socket) this.messages.push({ message: `${userName} disconnected`, userName, class: 'text-danger text-right' });
      this.scrollDown();
    });

    this.socket.on('chatClosed', () => {
      this.messages.push({ message: `${this.otherUsername} closed chat, open new chat to talk again`, userName: this.otherUsername, class: 'text-danger text-right' });
      this.scrollDown();
    });
  },
  computed: {
    offset() {
      if (this.number > 2) return 'd-none';
      return `offset-md-${this.number * 3}`;
    },
    target() {
      return `#collapse${this.number}`;
    },
    id() {
      return `collapse${this.number}`;
    },
    messageBodyId() {
      return `messageBody-${this.endSocket.room}`;
    },
    otherUsername(){
      const usernames = this.endSocket.room.split('-');
      console.log(usernames);
      if(usernames[0] !== this.endSocket.userName)
        return `${usernames[0]}`;
      else
        return `${usernames[1]}`;
    },
  },
  methods: {
    sendMessage() {
      this.socket.emit('sendPrivateMessage', { message: this.msgInput, room: this.endSocket.room, userName: this.$store.getters.userName });
      this.msgInput = '';
    },
    fullImage(img) {
      img = img.replace('width="64"', '');
      img = img.replace('height="64"', '');
      EventBus.$emit('showImage', { img });
    },
    insertEmoji(emoji) {
      this.msgInput += emoji;
    },
    scrollDown() {
      const messageBody = document.querySelector(`#messageBody-${this.endSocket.room}`);
      messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
    },
    close() {
      this.show = false;
      this.$store.dispatch('removeChat', this.endSocket.socket);
      this.$emit('deleteChat', this.endSocket.socket);
      this.socket.emit('chatClosed', { room: this.endSocket.room });
    },
  },
  components: {
    EmojiPicker,
    ImageUpload,
  },
};
</script>

<style scoped>

.chatContainer ul{
    height: 250px;
    overflow-y:auto;
    list-style-type: none;
}

#imgcontainer{
  cursor: pointer;
}


</style>
