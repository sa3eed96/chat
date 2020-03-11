<template>
  <div class="modal fade" id="exampleModalLong" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true" >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
            <span v-html="img"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { EventBus } from '../eventbus/eventBus';

export default {
  data() {
    return {
      img: '',
    };
  },
  mounted() {
    $('#exampleModalLong').modal({ show: false });
    EventBus.$on('showImage', (payload) => {
      this.img = payload.img;
      $('#exampleModalLong').modal('show');
    });
  },
};
</script>
