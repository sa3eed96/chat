<template>
    <div class="float-left ml-1 mt-1">
        <input :id="'fileInput-' + room" type="file" class="d-none" :ref="inputRef" @change="uploadImages" accept="image/*" multiple>
        <button type="button" class="btn btn-sm rounded-circle" @click.prevent="openPicker">
            <img src="/icons/image.svg" width="16" height="16" title="upload image">
        </button>
    </div>
</template>

<script>
import { EventBus } from '../eventbus/eventBus';

export default {
  props: ['socket', 'room'],
  methods: {
    openPicker() {
      document.getElementById(`fileInput-${this.room}`).click();
    },
    validate(image) {
      const kbSize = image.size / 1024;
      if (kbSize > 1024) {
        EventBus.$emit('notification', { message: `could not upload ${image.name}. more than 1mb`, class: 'bg-danger text-white' });
        return false;
      }
      if (!image.type.startsWith('image/')) {
        EventBus.$emit('notification', { message: `${image.name} is not an image`, class: 'bg-danger text-white' });
        return false;
      }
      return true;
    },
    uploadImages() {
      this.$refs[`images-${this.room}`].files.forEach((image) => {
        if (!this.validate(image)) { return; }
        console.log('sending to ', this.room);
        this.socket.emit('sendImage', { userName: this.$store.getters.userName, image, room: this.room });
      });
    },
  },
  computed: {
    inputRef() {
      return `images-${this.room}`;
    },
  },
};
</script>
