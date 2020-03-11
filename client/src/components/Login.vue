<template>
    <div class="col-sm-10 offset-sm-1 card p-0 mb-1">
      <div class="card-header bg-dark text-white">
        Login
      </div>
      <form class="card-body" @submit.prevent="login()">
          <div class="form-group">
              <label for="loginUserName">Username</label>
              <input v-model="userName" type="text" class="form-control" id="loginUserName" placeholder="Username">
              <small class="form-text text-danger" v-if="errors.userName">{{ errors.userName }}</small>
          </div>
          <div class="form-group">
              <label for="loginPassword">Password</label>
              <input v-model="password" type="password" class="form-control" id="loginPassword" placeholder="Password">
              <small class="form-text text-danger" v-if="errors.password">{{ errors.password }}</small>
          </div>
          <div class="form-check text-left mb-2">
            <input type="checkbox" class="form-check-input" id="remeberCheck" v-model="rememberMe">
            <label class="form-check-label" for="remeberCheck">remember me for  week</label>
          </div>
          <button type="submit" class="btn btn-outline-primary">Login</button>
          <div class="alert alert-danger mt-4" v-if="errors.server">{{ errors.server }}</div>
      </form>
    </div>
</template>

<script>
import Vue from 'vue';
import router from '../router/index';

export default {
  data() {
    return {
      userName: '',
      password: '',
      errors: {},
      rememberMe: false,
    };
  },
  methods: {
    login() {
      this.errors = {};
      if (this.userName.length === 0) { Vue.set(this.errors, 'userName', 'username is required'); } else if (this.validateString(this.userName)) { Vue.set(this.errors, 'userName', 'username contains invalid characters'); }

      if (this.password.length < 8) { Vue.set(this.errors, 'password', 'password is required'); }

      if (Object.keys(this.errors).length > 0) { return; }

      this.axios.post('/login', {
        userName: this.userName, password: this.password, rememberMe: this.rememberMe,
      }).then((res) => {
        this.$store.commit('setUser', res.data.user);
        this.$store.commit('setUserName', res.data.user.userName);
        router.push({ path: '/home' });
      }).catch((error) => {
        Vue.set(this.errors, 'server', error.response.data.message);
      });
    },
    validateString(value) {
      const regex = /[~`!@#$%^&*()\[\]><:;\"\'\+\=]/g;
      return regex.test(value);
    },
  },
};
</script>
