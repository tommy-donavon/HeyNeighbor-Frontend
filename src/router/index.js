import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import store from '../store';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/user-dash',
    name: 'User-Dash',
    component: () =>
      import(/* webpackChunkName: "userdash" */ '../views/UserDash.vue'),
  },
  {
    path: '/admin-dash',
    name: 'Admin-Dash',
    component: () => import(/* webpackChunkName: "admindash" */ '../views/AdminDash.vue')
  },
  {
    path: '/service-dash',
    name: 'Maintenance-Dash',
    component: () =>
      import(
        /* webpackChunkName: "maintenancedash" */ '../views/MaintenanceDash.vue'
      ),
    props: (route) => ({ server_code: route.query.server_code }),
  },
  {
    path: '/admin-service-dash',
    name: 'Admin-Maintenance-Dash',
    component: () =>
      import(
        /* webpackChunkName: "maintenancedash" */ '../views/AdminMaintenanceDash'
      ),
    props: (route) => ({ server_code: route.query.server_code }),
  },
  {
    path: '/private-chat',
    name: 'Private-Chat',
    component: () => import(/* webpackChunkName: 'privateChat' */ '../views/AdminPrivateChat.vue'),
    props: (route) => ({server_code: route.query.server_code, server_room: route.query.server_room})
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

  authRequired && !loggedIn ? next('/') : next();
});

export default router;
