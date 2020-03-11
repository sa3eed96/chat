<template>
    <div class="dropdown">
        <a class="nav-link dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" @click.prevent="manageList()">
            <span v-if="unreadCount != 0" class="badge badge-danger">{{ unreadCount }}</span> Friend Requests
        </a>
        <div class="dropdown-menu">
            <div class="dropdown-header" v-if="requests.length === 0">
                <p>There is no requests to show</p>
            </div>
            <ul class="list-group list-group-flush" id="requestList">
                <li v-for="(request, index) in requests" v-bind:key="request._id" class="list-group-item border-bottom">
                    {{ requestBody(request) }}
                    <div class="mt-1" v-if=" request.reciever.userName === userName ">
                        <button @click.prevent="respond(true, index)" class="btn btn-sm btn-success">Accept</button>
                        <button @click.prevent="respond(false, index)" class="btn btn-sm btn-danger float-right">Reject</button>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import { EventBus } from '../eventbus/eventBus';

export default {
  props: ['userName'],
  data() {
    return {
      requests: [],
      unreadCount: 0,
      isRegistered: null,
      socket: null,
    };
  },
  created() {
    this.isRegistered = this.$store.getters.isRegistered;
    this.socket = this.$store.getters.getSocket;

    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'setSocket') {
        this.socket = state.socket;
        this.socket.on('friendRequest', ({ request }) => {
          console.log('got friend request ', request);
          this.requests.unshift(request);
          this.unreadCount += 1;
        });
      }
      if (mutation.type === 'setIsRegistered') {
        this.isRegistered = state.isRegistered;
      }
    });
    if (this.isRegistered) {
      this.getRequests(1);
    }
  },
  methods: {
    getRequests(page) {
      this.axios.get(`/requests?page=${page}`).then(({ data }) => {
        console.log('got requests ', data);
        this.requests = data.requests;
        data.requests.forEach(req => (req.sender.userName === this.userName || req.read ? null : this.unreadCount += 1));
      });
    },
    requestBody(request) {
      return `${request.sender.userName === this.userName ? 'you sent' : `${request.sender.userName} sent you`} a friend request ${request.reciever.userName !== this.userName ? `to ${request.reciever.userName}` : ''}`;
    },
    manageList() {
      if (!this.isRegistered) {
        EventBus.$emit('notification', { message: 'Register to recieve friend requests', class: 'bg-warning text-dark' });
      } else if (this.unreadCount > 0) {
        const ids = [];
        for (let index = 0; index < this.requests.length; index++) {
          if (this.requests[index].sender.userName !== this.userName && this.requests[index].read === false) {
            this.requests[index].read = true;
            ids.push(this.requests[index]._id);
          }
        }
        this.axios.patch('/requests', { ids }).then((res) => {
          this.unreadCount = 0;
        }).catch((err) => {
          for (let index = 0; index < this.requests.length; index++) {
            if (ids.includes(this.requests[index]._id)) { this.requests[index].read = false; }
          }
        });
      }
    },
    respond(response, index) {
      this.axios.delete(`/requests/${this.requests[index]._id}?response=${response}`).then((res) => {
        this.requests.splice(index, 1);
      }).catch(err => EventBus.$emit('error', { message: 'error try again later', class: 'bg-danger text-dark' }));
    },
  },
};
</script>

<style scoped>
#requestList{
    width:250px;
    height:300px;
    overflow: scroll;
}
</style>
