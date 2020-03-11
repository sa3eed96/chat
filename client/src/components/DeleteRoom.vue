<template>
    <button @click="deleteRoom()" class="btn btn-outline-danger">Delete</button>
</template>

<script>
export default {
  props: ['room'],
  methods: {
    deleteRoom() {
      this.axios.delete(`/rooms/${this.room}`).then(() => {}).catch(() => {});
    },
  },
};
</script>
