<template>
    <nav class="navbar navbar-expand-md navbar-dark bg-dark mb-4">
        <span class="navbar-brand mb-0 h1">Chat</span>
        <button v-if="userName" class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div v-if="userName" class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav ml-auto">
                <li v-if="userName" class="nav-item">
                    <FriendRequests :userName="userName" />
                </li>
                <li v-if="userName" class="nav-item">
                    <Profile :isRegistered="isRegistered" />
                </li>
                <li v-if="userName" class="nav-item">
                    <Logout />
                </li>
            </ul>
        </div>
    </nav>
</template>

<script>
import Logout from './Logout';
import Profile from './Profile';
import FriendRequests from './FriendRequests';

export default {
  data() {
    return {
      userName: null,
      socket: null,
      isRegistered: null,
    };
  },
  created() {
    this.userName = this.$store.getters.userName;
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'setUserName') {
        this.userName = state.userName;
      }
      if (mutation.type === 'setSocket') {
        this.socket = state.socket;
      }
      if (mutation.type === 'setIsRegistered') {
        this.isRegistered = state.isRegistered;
      }
    });
  },
  components: {
    Logout,
    Profile,
    FriendRequests,
  },
};
</script>

<style scoped>
    li{
        cursor: pointer;
    }
</style>
