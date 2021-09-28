import { createRouter, createWebHistory } from 'vue-router';
import store from '../store'
import Home from '../views/Home.vue';
import ChatWindow from '../views/ChatWindow.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/user-dash',
    name: 'User-Dash',
    component: () => import(/* webpackChunkName: "userdash" */ '../views/UserDash.vue')
  },
  {
    path: '/chat',
    name: 'Chat',
    component: ChatWindow,
    props: route => ({server_code: route.query.code})
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const publicPages = ['/'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = store.getters.getCurrentToken;

  if (authRequired && loggedIn === "") next('/');
  else next();
});

export default router;
