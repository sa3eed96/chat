<template>
  <div>
    <Room v-if="flag" />
  </div>
</template>

<script>
import io from 'socket.io-client';
import Room from '../components/Room.vue';
import router from '../router/index';
import { EventBus } from '../eventbus/eventBus';

export default {
  name: 'home',
  data() {
    return {
      flag: false,
    };
  },
  created() {
    this.axios.get('/checkConnection').then(async (res) => {
      if (!this.$store.getters.user) {
        const sessionRes = await this.axios.get('/userssession');
        this.$store.commit('setUser', sessionRes.data.user);
      }
      const { user } = this.$store.getters;
      if (user.hasOwnProperty('_id')) this.$store.commit('setIsRegistered', true);
      else this.$store.commit('setIsRegistered', false);
      this.$store.commit('setSocket', io('http://localhost:3000'));
      this.flag = true;
    }).catch((err) => {
      this.axios.get('/duplicateLogout').then(() => {
        this.$store.commit('clearData');
        EventBus.$emit('notification', { message: 'error logging in, make sure you\'re not logged in elsewhere', class: 'bg-danger text-white' });
        router.push({ path: '/' });
      });
    });
  },
  components: {
    Room,
  },
};
</script>
