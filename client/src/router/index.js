import Vue from 'vue';
import VueRouter from 'vue-router';
import axios from 'axios';
import LoginRegister from '../views/LoginRegister.vue';
import Home from '../views/Home.vue';
import { store } from '../store/index.js';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'login-register',
    component: LoginRegister,
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
    meta: {
      requiresAuth: true,
    },
  },
//   {
//     path: '/about',
//     name: 'about',
//     // route level code-splitting
//     // this generates a separate chunk (about.[hash].js) for this route
//     // which is lazy-loaded when the route is visited.
//     component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
//   },
];


const router = new VueRouter({
  routes,
});

router.beforeEach((to, from, next) => {
  axios.get('/isAuth').then(({ data }) => {
    store.commit('setUserName', data.user.userName);
    if (!to.meta.requiresAuth) next({ path: '/home' });
    else next();
  }).catch((err) => {
    if (to.meta.requiresAuth) next({ path: '/' });
    else next();
  });
});

export default router;
