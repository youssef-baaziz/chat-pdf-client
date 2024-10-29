import { createWebHistory, createRouter } from 'vue-router';

import HomeView from '../views/HomeView.vue';
import ErrorView from '../views/ErrorView.vue';
import Login from '../components/user/login.vue';
import Register from '../components/user/register.vue';

const routes = [
  { name: 'app', path: '/:identifiant?', component: HomeView, meta: { requiresAuth: true } },
  { name: 'login', path: '/login', component: Login },
  { name: 'inscription', path: '/register', component: Register },
  { name: 'error', path: '/:notFound', component: ErrorView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('authToken');
  const isAuthenticated = !!localStorage.getItem('authToken');

  // 
  // else next();

  if (to.path === '/login' && isAuthenticated) {
    // If user is logged in and tries to access login, redirect to home
    next('/');
  } else if (!isAuthenticated && to.path !== '/login') {
    // If user is not logged in and trying to access anything but login, redirect to login
    next('/login');
  } else {
    next(); // Proceed to the route
  }
});

export default router;
