import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../view/Home_Page.vue'; // Import the HomePage component
import SignUpLogin from '../view/Sign_Up_Log_In.vue'; // import the log in / sign uo component
import MainLayout from '@/components/Main_Layout.vue';
import Profile from'../view/Profile_Page.vue'; // Import the Profile page component

const routes = [
  {
    path: '/',
    component: MainLayout, // Use MainLayout as the wrapper for all pages
    children: [
      {
        path: '',
        name: 'homePage',
        component: HomePage,
      },

      {
        path: '/sign-up-login', // Define the route for the sign up / login page
        name: 'signUpLogin',
        component: SignUpLogin, // This is the sign up / login component
      },

      {
        path: '/profile', // Define the route for the Profile page
        name: 'profile',
        component: Profile, // This is the Profile component
      },
    ],
  },
];


const router = createRouter({
  history: createWebHistory(), // Enables modern history mode (no # in URLs)
  routes,
});

export default router;
