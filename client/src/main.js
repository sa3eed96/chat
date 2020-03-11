import Vue from 'vue';
import axios from 'axios';
import JQuery from 'jquery';
import App from './App.vue';
import router from './router';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { store } from './store/index';


Vue.config.productionTip = false;
Vue.prototype.axios = axios;
window.$ = JQuery;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
