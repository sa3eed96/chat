import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    userName: null,
    isRegistered: true,
    privateChats: [],
    friendsPrivateChats: [],
    socket: null,
    user: null,
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setUserName(state, userName) {
      state.userName = userName;
    },
    addChat(state, { socket, senderUserName, recieverUserName }) {
      const chat = state.privateChats.find(obj => obj.socket == socket);
      if (!chat) {
        state.privateChats.push({ socket, recieverUserName, senderUserName });
      }
    },
    addFriendChat(state, { socket, reciever }) {
      const chat = state.friendsPrivateChats.find(obj => obj.socket == socket);
      if (!chat) {
        state.friendsPrivateChats.push({ socket, recieverUserName: reciever, senderUserName: state.userName });
      }
    },
    setSocket(state, socket) {
      state.socket = socket;
      state.user.socketId = state.socket.id;
      this.commit('setIsRegistered', !!state.user._id);
    },
    clearData(state) {
      state.socket.emit('endConnection');
      this.commit('setUser', null);
      this.commit('setChats', []);
      this.commit('setfriendChats', []);
      this.commit('setUserName', null);
    },
    setIsRegistered(state, flag) {
      state.isRegistered = flag;
    },
    setChats(state, value) {
      state.privateChats = value;
    },
    setfriendChats(state, value) {
      state.friendsPrivateChats = value;
    },
    removeChat(state, socket) {
      state.privateChats = state.privateChats.filter(chat => chat.socket !== socket);
      state.friendsPrivateChats = state.friendsPrivateChats.filter(chat => chat.socket !== socket);
    },
  },
  actions: {
    removeChat(context, socket) {
      setTimeout(() => {
        context.commit('removeChat', socket);
      }, 2000);
    },
  },
  getters: {
    userName: state => state.userName,
    privateChats: state => state.privateChats,
    friendsPrivateChats: state => state.friendsPrivateChats,
    friendsPrivateChatsCount: state => state.friendsPrivateChats.length,
    privateChatsCount: state => state.privateChats.length,
    getSocket: state => state.socket,
    isRegistered: state => state.isRegistered,
    user: state => state.user,
  },
});
