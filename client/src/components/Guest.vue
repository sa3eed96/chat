<template>
    <div class="col-sm-10 offset-sm-1 card p-0">
      <div class="card-header bg-dark text-white">
        Login as Guest
      </div>
      <form class="card-body" @submit.prevent="guestLogin()">
          <div class="form-group">
              <label for="loginUserName">Username</label>
              <input v-model="userName" type="text" class="form-control" id="loginUserName" placeholder="Username">
              <small class="form-text text-danger" v-if="errors.userName">{{ errors.userName }}</small>
          </div>
          <div class="form-group">
              <CountrySelect @countrySelected="setCountry" />
              <small class="form-text text-danger" v-if="errors.country">{{ errors.country }}</small>
          </div>
          <div class="form-group">
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="radio" id="inlinegradio1" value="1" v-model="gender">
              <label class="form-check-label" for="inlinegradio1">Male</label>
            </div>
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="radio" id="inlinegradio2" value="0" v-model="gender">
              <label class="form-check-label" for="inlinegradio2">Female</label>
            </div>
          </div>
          <button type="submit" class="btn btn-outline-primary">Login as Guest</button>
          <div v-if="errors.server" class="alert alert-danger">{{ errors.server }}</div>
      </form>
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
      country: '',
      gender: '1',
      errors: {},
    };
  },
  methods: {
    guestLogin() {
      this.errors = {};
      if (this.userName.length === 0) { Vue.set(this.errors, 'userName', 'username is required'); } else if (this.validateString(this.userName)) { Vue.set(this.errors, 'userName', 'username contains invalid characters'); }

      if (this.country.length === 0) { Vue.set(this.errors, 'country', 'country is required'); } else if (this.validateString(this.country)) { Vue.set(this.errors, 'country', 'country contains invalid characters'); }

      if (Object.keys(this.errors).length > 0) { return; }

      this.axios.post('/guest', {
        userName: this.userName, country: this.country, gender: this.gender === '1',
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
