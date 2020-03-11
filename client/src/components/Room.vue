<template>
    <div>
        <div class="row">
          <div class="col-sm-10 offset-sm-1 col-md-5">
            <div class="form-group">
              <select @change="joinRoom()" class="form-control" v-model="selected">
                  <option v-for="(room,index) in rooms" v-bind:value="room.name" v-bind:key="index">{{ room.name }}</option>
              </select>
            </div>
          </div>
          <div class="col-sm-9 col-md-2">
            <CreateRoom @room-created="switchToNewRoom" :currentRoom="selected" />
          </div>
          <div v-if="rooms[index] && userName == rooms[index].userName" class="col-sm-2 col-md-1">
            <DeleteRoom :room="this.selected"/>
          </div>
          <div class="col-md-3">
            <Friends :isRegistered="isRegistered" />
          </div>
        </div>
        <Chat :room="selected" :isRegistered="isRegistered" />
    </div>
</template>

<script>
import Chat from './Chat.vue';
import CreateRoom from './CreateRoom.vue';
import DeleteRoom from './DeleteRoom.vue';
import Friends from './Friends.vue';

export default {
  data() {
    return {
      socket: null,
      oldSelected: 'public',
      selected: 'public',
      rooms: [],
      userName: '',
      index: 0,
      isRegistered: null,
    };
  },
  created() {
    this.isRegistered = this.$store.getters.isRegistered;
    this.socket = this.$store.getters.getSocket;
    this.userName = this.$store.getters.userName;

    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'setIsRegistered') {
        this.isRegistered = state.isRegistered;
      }
    });

    this.axios.get('/rooms').then((res) => {
      this.rooms = res.data.rooms;
    }).catch((err) => {
      this.rooms.push({ name: 'public', userName: 'admin' });
    });

    this.socket.emit('roomJoinRequest', { roomName: this.selected, user: this.$store.getters.user, isRegistered: this.$store.getters.isRegistered });

    this.socket.on('roomAdded', ({ name, userName }) => {
      this.rooms.push({ name, userName });
    });

    this.socket.on('roomDeleted', (roomName) => {
      const index = this.rooms.findIndex(room => room.name === roomName);
      this.rooms.splice(index, 1);
      this.switchToPublic();
    });
  },
  methods: {
    joinRoom() {
      console.log('switching to ', this.selected, 'with user ', this.$store.getters.user);
      this.index = this.rooms.findIndex(room => room.name == this.selected);
      this.socket.emit('roomLeaveRequest', { userName: this.userName, roomName: this.oldSelected });
      this.socket.emit('roomJoinRequest', { roomName: this.selected, user: this.$store.getters.user, isRegistered: this.$store.getters.isRegistered });
      this.oldSelected = this.selected;
    },
    switchToNewRoom(newRoomName) {
      this.rooms.push({ name: newRoomName, userName: this.userName });
      this.selected = newRoomName;
      this.index = this.rooms.findIndex(room => room.name == newRoomName);
      this.oldSelected = this.selected;
      EventBus.$emit('notification', { message: 'Room created', class: 'bg-success text-white' });
    },
    switchToPublic() {
      this.selected = 'public';
      this.index = this.rooms.findIndex(room => room.name == 'public');
      this.oldSelected = 'public';
      EventBus.$emit('notification', { message: 'room deleted, switched to public channel', class: 'bg-success text-white' });
    },
  },
  components: {
    Chat,
    CreateRoom,
    DeleteRoom,
    Friends,
  },
};
</script>
