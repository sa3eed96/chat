<template>
  <div class="col-sm-10 offset-sm-1">
    <div class="card p-0">
      <div class="card-header bg-dark text-white">
        Register
      </div>
      <form class="card-body" @submit.prevent="register()">
          <div class="form-group">
              <label for="registerUserName">Username</label>
              <input type="text" v-model="userName" class="form-control" id="registerUserName" placeholder="Username">
              <small class="form-text text-danger" v-if="errors.userName">{{ errors.userName }}</small>
          </div>
          <div class="form-group">
              <label for="registerUserName">Email address</label>
              <input type="email" v-model="email" class="form-control" id="registerEmail" placeholder="Email">
              <small class="form-text text-danger" v-if="errors.email">{{ errors.email }}</small>
          </div>
          <div class="form-group">
              <CountrySelect @countrySelected="setCountry" />
              <small class="form-text text-danger" v-if="errors.country">{{ errors.country }}</small>
          </div>
          <div class="form-group">
              <label for="registerPassword">Password</label>
              <input type="password" v-model="password" class="form-control" id="registerPassword" placeholder="Password">
              <small class="form-text text-danger" v-if="errors.password">{{ errors.password }}</small>
          </div>
          <div class="form-group">
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="radio" id="inlineradio1" value="1" v-model="gender">
              <label class="form-check-label" for="inlineradio1">Male</label>
            </div>
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="radio" id="inlineradio2" value="0" v-model="gender">
              <label class="form-check-label" for="inlineradio2">Female</label>
            </div>
          </div>
          <button type="submit" class="btn btn-outline-success">Register</button>
          <div v-if="errors.server" class="alert alert-danger">{{ errors.server }}</div>
      </form>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import router from '../router/index';
import CountrySelect from './CountrySelect';

export default {
  data() {
    return {
      userName: '',
      email: '',
      country: '',
      password: '',
      gender: '1',
      errors: {},
    };
  },
  methods: {
    register() {
      this.errors = {};
      if (this.userName.length === 0) { Vue.set(this.errors, 'userName', 'username is required'); } else if (this.validateString(this.userName)) { Vue.set(this.errors, 'userName', 'username contains invalid characters'); }

      if (this.country.length === 0) { Vue.set(this.errors, 'country', 'country is required'); } else if (this.validateString(this.country)) { Vue.set(this.errors, 'country', 'country contains invalid characters'); }

      if (this.email.length === 0) { Vue.set(this.errors, 'email', 'email is required'); }

      if (this.password.length < 8) { Vue.set(this.errors, 'password', 'password must be atleast 8 characters'); }

      if (Object.keys(this.errors).length > 0) { return; }

      this.axios.post('/register', {
        userName: this.userName, country: this.country, email: this.email, password: this.password, gender: this.gender === '1',
      }).then((res) => {
        this.$store.commit('setUser', res.data.user);
        this.$store.commit('setUserName', res.data.user.userName);
        router.push('/home');
      }).catch((error) => {
        Vue.set(this.errors, 'server', error.response.data.message);
      });
    },
    validateString(value) {
      const regex = /[~`!@#$%^&*()\[\]><:;\"\'\+\=]/g;
      return regex.test(value);
    },
    setCountry(val) {
      this.country = val;
    },
  },
  components: {
    CountrySelect,
  },
};
</script>
