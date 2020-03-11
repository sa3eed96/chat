<template>
    <div>
        <a class="nav-link" @click.prevent="fetchProfile()">
            Profile
        </a>
        <div v-if="show">
            <div v-if="isRegistered" class="position-fixed fixed-top" id="overlay">
                <div id="closeButton">
                    <button class="btn btn-danger" @click="show = false">X</button>
                </div>

                <div class="card w-75 h-75 m-4 p-4" id="profileCard">
                    <div class="card-header">Your Profile</div>

                    <div v-if="passwordChange">
                        <ChangePassword @changeFinished="showProfile()" />
                    </div>

                    <div v-else class="card-body">
                        <div class="w-25 my-4">
                            <button class="btn btn-warning" @click="passwordChange = true">Change Password</button>
                        </div>
                        <form @submit.prevent="update()">
                            <label for="userName">Username</label>
                            <input type="text" class="form-control" id="userName" v-model="userName">

                            <CountrySelect :default="country" @countrySelected="setCountry" />

                            <button v-if="modified" type="submit" class="btn btn-outline-success my-4">Update</button>
                        </form>
                    </div>
                </div>
            </div>
            <div v-else>{{ alertGuest() }}</div>
        </div>
    </div>
</template>

<script>
import ChangePassword from './ChangePassword';
import CountrySelect from './CountrySelect';
import { EventBus } from '../eventbus/eventBus';

export default {
  props: ['isRegistered'],
  data() {
    return {
      userName: '',
      country: '',
      userCopy: { userName: '', country: '' },
      passwordChange: false,
      show: false,
    };
  },
  computed: {
    modified() {
      return this.userName.trim() !== this.userCopy.userName || this.country.trim() !== this.userCopy.country;
    },
  },
  methods: {
    fetchProfile() {
      this.show = false;
      if (this.isRegistered) {
        this.axios.get(`/users/${this.$store.getters.userName}`).then(({ data }) => {
          this.userName = data.user.userName;
          this.country = data.user.country;
          this.userCopy = data.user;
          this.show = true;
        }).catch(err => EventBus.$emit('notification', { message: 'could not fetch profile', class: 'bg-danger text-white' }));
      }
      this.show = true;
    },
    alertGuest() {
      EventBus.$emit('notification', { message: 'Register to edit profile', class: 'bg-warning text-dark' });
    },
    update() {
      this.axios.post('/users', { oldUserName: this.userCopy.userName, user: { userName: this.userName, country: this.country } })
        .then((res) => {
          this.userCopy.userName = this.userName;
          this.userCopy.country = this.country;
          EventBus.$emit('notification', { message: 'profile updated, refresh to reflect changes', class: 'bg-success text-white' });
        }).catch((err) => {
          this.userName = this.userCopy.userName;
          this.country = this.userCopy.country;
          console.log(err);
          EventBus.$emit('notification', { message: 'Register to edit profile', class: 'bg-danger text-white' });
        });
    },
    showProfile() {
      this.passwordChange = false;
    },
    setCountry(val) {
      this.country = val;
    },
  },
  components: {
    ChangePassword,
    CountrySelect,
  },
};
</script>

<style scoped>
#overlay{
    height: 100%;
    width: 100%;
    background-color: rgba(15, 15, 15, 0.5);
}

#profileCard{
    left:12.5%;
    top:10%;
}

#closeButton button{
    float:right;
}
</style>
