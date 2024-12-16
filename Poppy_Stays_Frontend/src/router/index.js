import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../view/Home_Page.vue'; // Import your HomePage component

const routes = [
  {
    path: '/', // The default route (starting page)
    name: 'Home',
    component: HomePage,
  },
];

const router = createRouter({
  history: createWebHistory(), // Enables modern history mode (no # in URLs)
  routes,
});

export default router;
