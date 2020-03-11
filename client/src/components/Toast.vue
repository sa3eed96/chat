<template>
<div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
  <div class="toast-header" :class="classObject">
    <strong class="mr-auto">Alert</strong>
    <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
  <div class="toast-body">
    {{ message }}
  </div>
</div>
</template>

<script>
import { EventBus } from '../eventbus/eventBus';

export default {
  data() {
    return {
      message: '',
      class: '',
    };
  },
  mounted() {
    EventBus.$on('notification', (payload) => {
      this.message = payload.message;
      this.class = payload.class;
      $('.toast').toast('show');
    });
  },
  computed: {
    classObject() {
      const obj = {};
      this.class.split(' ').forEach((element) => {
        obj[element] = element;
      });
      return obj;
    },
  },
};
</script>

<style scoped>
.toast{
  position: absolute;
  top: 0;
  left: 0;
}
</style>
