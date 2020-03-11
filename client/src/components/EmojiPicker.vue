<template>
    <div class="float-left ml-1 mt-1">
        <button type="button" class="btn btn-sm rounded-circle" @click="toggle = !toggle">
            <img src="/icons/outlet.svg" width="16" height="16" title="emoji">
        </button>
        <picker
            :showPreview="false"
            :style="{ position: 'absolute', bottom: '20px', right: '20px' }"
            v-show="toggle"
            @select="addEmoji"
            title="Emoji"
        />
    </div>
</template>

<script>
import { Picker } from 'emoji-mart-vue';

export default {
  data() {
    return {
      toggle: false,
    };
  },
  methods: {
    addEmoji(emoji) {
      this.$emit('emojiSelected', emoji.native);
    },
  },
  components: {
    Picker,
  },
};
</script>
