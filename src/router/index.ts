import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useUserStore } from '../stores/user';

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/',
    component: () => import('../layouts/AdminLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: '/dashboard'
      },
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('../views/Dashboard.vue')
      },
      {
        path: 'products',
        name: 'products',
        component: () => import('../views/Products.vue')
      },
      {
        path: 'orders',
        name: 'orders',
        component: () => import('../views/Orders.vue')
      },
      {
        path: 'users',
        name: 'users',
        component: () => import('../views/Users.vue')
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory('/admin/'),
  routes
});

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    next('/login');
  } else if (to.meta.requiresGuest && userStore.isLoggedIn) {
    next('/dashboard');
  } else {
    next();
  }
});

export default router; 