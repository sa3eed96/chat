<template>
    <button class="btn btn-sm btn-outline-success rounded-circle" @click.prevent="add()">
        <img src="/icons/plus.svg" width="16" height="16" title="add">
    </button>
</template>

<script>
import { EventBus } from '../eventbus/eventBus';

export default {
  props: ['userName'],
  methods: {
    add() {
      this.axios.post('/requests', { userName: this.userName }).then((res) => {
        if (res.data.status) { return EventBus.$emit('notification', { message: 'request pending', class: 'bg-warning text-dark' }); }
        if (res.data.friends) { return EventBus.$emit('notification', { message: 'already friends', class: 'bg-primary text-white' }); }
        EventBus.$emit('notification', { message: 'friend request sent', class: 'bg-success text-white' });
      }).catch(err => EventBus.$emit('notification', { message: 'could not send request', class: 'bg-danger text-white' }));
    },
  },
};
</script>
