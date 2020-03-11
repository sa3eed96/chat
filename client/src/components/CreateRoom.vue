<template>
    <div>
        <button class="btn btn-outline-success" type="button" data-toggle="modal" data-target="#createRoomForm">
            Create Room +
        </button>
        <div class="modal fade" id="createRoomForm" tabindex="-1" role="dialog">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLongTitle">Create Room</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="create()">
                            <input type="text" v-model="roomName" class="form-control mb-1" placeholder="Enter Name" />
                            <button class="btn btn-success">Create</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  props: ['currentRoom'],
  data() {
    return {
      roomName: '',
    };
  },
  methods: {
    create() {
      this.axios.post('/rooms', { newRoomName: this.roomName, currentRoomName: this.currentRoom }).then((res) => {
        this.$emit('room-created', this.roomName);
        this.roomName = '';
      }).catch(error => EventBus.$emit('notification', { message: error.response.data.message, class: 'bg-danger text-white' }));
    },
  },
};
</script>
