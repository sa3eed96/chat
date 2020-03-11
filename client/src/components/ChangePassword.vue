<template>
    <div class="card-body">
        <form @submit.prevent="update()">
            <label for="old">Enter Old Password</label>
            <input type="password" class="form-control" id="old" v-model="oldPassword">

            <label for="new">Enter New Password</label>
            <input type="password" class="form-control" id="new" v-model="newPassword">

            <button type="submit" class="btn btn-outline-success my-4">Update Password</button>
        </form>
        <button class="btn btn-outline-primary" @click="$emit('changeFinished')">Cancel</button>
    </div>
</template>

<script>
export default {
  data() {
    return {
      oldPassword: '',
      newPassword: '',
    };
  },
  methods: {
    update() {
      this.axios.post('/password', { old: this.oldPassword, new: this.newPassword }).then((res) => {
        this.$emit('changeFinished');
        EventBus.$emit('notification', { message: 'password was updated', class: 'bg-success text-white' });
      }).catch((err) => {
        EventBus.$emit('notification', { message: 'could not update password', class: 'bg-danger text-white' });
      });
    },
  },
};
</script>
