<template>
    <div class="dropdown"   >
        <button class="btn w-75 btn-outline-secondary dropdown-toggle" id="dropdownMenuButton" @click.prevent="checkReg()" data-toggle="dropdown">
            <span v-if="onlineCount > 0" class="badge badge-success"> {{ onlineCount }}</span>
            Friends
        </button>
        <div class="dropdown-menu">
            <h6 v-if="onlineCount=== 0 && offlineCount === 0" class="dropdown-header">0 Friends</h6>
            <h6 v-if="onlineCount > 0" class="dropdown-header">Online</h6>
            <div class="list-group px-1">
                <a
                    v-for="username in Object.keys(onlineFriends)" @click.prevent="initiatChat(username)"
                    v-bind:key="username" class="friend list-group-item list-group-item-action list-group-item-success my-2"
                >
                    {{ username }}
                </a>
            </div>
            <div v-if="onlineCount > 0" class="dropdown-divider"></div>
            <h6 v-if="offlineCount > 0" class="dropdown-header">Offline</h6>
            <ul class="list-group px-1">
                <li v-for="username in Object.keys(offlineFriends)" v-bind:key="username"
                 class="list-group-item list-group-item-dark my-2"
                >
                    {{username}}
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import { EventBus } from '../eventbus/eventBus';

export default {
  props: ['isRegistered'],
  data() {
    return {
      offlineFriends: {},
      onlineFriends: {},
      socket: null,
    };
  },
  created() {
    this.socket = this.$store.getters.getSocket;

    this.socket.on('userConnected', ({ userName, socketId }) => {
      if (this.offlineFriends.hasOwnProperty(`${userName}`)) {
        Vue.delete(this.offlineFriends, `${userName}`);
        Vue.set(this.onlineFriends, `${userName}`, socketId);
      }
    });

    this.socket.on('userDisconnected', ({ userName }) => {
      if (this.onlineFriends.hasOwnProperty(`${userName}`)) {
        Vue.delete(this.onlineFriends, `${userName}`);
        Vue.set(this.offlineFriends, `${userName}`, '1');
      }
    });

    this.socket.on('addToMyFriends', ({
      userName, socketId, sender, online,
    }) => {
      console.log('add to my friends is called');
      if (online) { Vue.set(this.onlineFriends, `${userName}`, socketId); } else { Vue.set(this.offlineFriends, `${userName}`, '1'); }
      if (sender) { EventBus.$emit('notification', { message: `${userName} accepted your friend request`, class: 'bg-primary text-white' }); }
    });
  },
  mounted() {
    if (this.isRegistered) {
      this.axios.get('/users/friends').then(({ data }) => {
        this.offlineFriends = data.offlineFriends;
        this.onlineFriends = data.onlineFriends;
      });
    }
  },
  computed: {
    onlineCount() {
      return Object.keys(this.onlineFriends).length;
    },
    offlineCount() {
      return Object.keys(this.offlineFriends).length;
    },
  },
  methods: {
    initiatChat(reciever) {
      this.$store.commit('addFriendChat', { socket: this.onlineFriends[`${reciever}`], reciever });
    },
    checkReg() {
      if (!this.isRegistered) { EventBus.$emit('notification', { message: 'Register to add friends', class: 'bg-warning text-dark' }); }
    },
  },
};
</script>

<style scoped>
.list-group a{
    cursor: pointer;
}
</style>
