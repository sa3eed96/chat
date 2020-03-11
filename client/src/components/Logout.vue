<template>
    <a class="nav-link" @click.prevent="logout()">
        Logout
    </a>
</template>

<script>
import router from '../router/index';

export default {
  methods: {
    logout() {
      this.axios.get('/logout').then(() => {
        this.$store.commit('clearData');
        router.push({ path: '/' });
      });
    },
  },
};
</script>
