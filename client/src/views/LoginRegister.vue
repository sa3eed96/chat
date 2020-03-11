<template>
    <div class="row">
      <div class="col-sm-12">
        <button class="btn btn-outline-secondary offset-md-9 mb-4" @click.prevent="toggle">
          {{buttonToggle}}
        </button>
      </div>
      <div v-if="reg" class="col-sm-12 col-md-8 offset-md-2 row">
          <Register />
      </div>
      <div v-if="!reg" class="col-sm-12 col-md-6 row">
          <Login />
      </div>
      <div v-if="!reg" class="col-sm-12 col-md-6 row">
          <Guest />
      </div>
    </div>
</template>

<script>
import Login from '@/components/Login.vue';
import Register from '@/components/Register.vue';
import Guest from '@/components/Guest.vue';

export default {
  name: 'login-register',
  data() {
    return {
      reg: false,
      buttonToggle: 'Register',
    };
  },
  methods: {
    toggle() {
      this.reg = !this.reg;
      if (this.reg) {
        this.buttonToggle = 'Login';
      } else {
        this.buttonToggle = 'Register';
      }
    },
  },
  components: {
    Login,
    Register,
    Guest,
  },
};
</script>
