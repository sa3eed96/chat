<template>
    <div class="row">
        <PrivateChat @deleteChat="deleteChat" v-for="(socket, index) in sockets" :key="socket.userName" :endSocket="socket" :number="index"></PrivateChat>
        <div v-if="sockets.length > 1" class="dropup col-md-1">
          <button class="btn btn-sm btn-outline-secondary dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown">
            <span class="badge badge-success"> {{ sockets.length - 1 }}</span>
            chats
          </button>
          <div class="dropdown-menu">
            <div class="list-group px-1">
                <a
                    v-for="i in sockets.length-3" @click.prevent="swap(i+2)"
                    v-bind:key="sockets[i+2].userName" class="list-group-item list-group-item-action list-group-item-success my-2"
                >
                    {{ sockets[i+2].userName }}
                </a>
            </div>
          </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import PrivateChat from './PrivateChat';
import { EventBus } from '../eventbus/eventBus';

export default {
  data() {
    return {
      socket: null,
      sockets: [],
    };
  },
  computed: {
    friendsChatCount() {
      return this.$store.getters.friendsPrivateChatsCount;
    },
    count() {
      return this.$store.getters.privateChatsCount;
    },
    currentSocket() {
      return this.$store.getters.getSocket;
    },
  },
  watch: {
    friendsChatCount(newCount, oldCount) {
      const sockets = this.$store.getters.friendsPrivateChats;
      if (newCount > oldCount) {
        this.socket.emit('privateJoinConfirmed', {
          userSocket: sockets[newCount - 1].socket,
          senderUserName: sockets[newCount - 1].senderUserName,
          recieverUserName: sockets[newCount - 1].recieverUserName,
        });
      }
    },
    count(newCount, oldCount) {
      const sockets = this.$store.getters.privateChats;
      if (newCount > oldCount) {
        this.socket.emit('joinUserSocket', {
          userSocket: sockets[newCount - 1].socket,
          recieverUserName: sockets[newCount - 1].recieverUserName,
          senderUserName: sockets[newCount - 1].senderUserName,
        });
        EventBus.$emit('notification', { message: 'private chat request sent', class: 'bg-success text-white' });
      }
    },
    currentSocket(newSocket, oldSocket) {
      this.socket = newSocket;

      this.socket.on('confirmJoinUserSocket', ({ socket, recieverUserName, senderUserName }) => {
        if (confirm(`private message request from ${senderUserName}`)) {
          this.socket.emit('privateJoinConfirmed', { userSocket: socket, senderUserName, recieverUserName });
        }
      });

      this.socket.on('createPrivateChat', ({
        userSocket, userName, senderUserName, recieverUserName,
      }) => {
        const chat = this.sockets.find(sok => sok.socket == userSocket);
        if (!chat) {
          this.sockets.push({ socket: userSocket, userName, room: `${senderUserName}-${recieverUserName}` });
          this.socket.emit('privateChatJoin', { userSocket, senderUserName, recieverUserName });
        }
      });
    },
  },
  methods: {
    swap(i) {
      const temp = this.sockets[0];
      Vue.set(this.sockets, 0, this.sockets[i]);
      Vue.set(this.sockets, i, temp);
    },
    deleteChat(socket) {
      setTimeout(() => {
        this.sockets = this.sockets.filter(s => s.socket !== socket);
      }, 2000);
    },
  },
  components: {
    PrivateChat,
  },
};
</script>
