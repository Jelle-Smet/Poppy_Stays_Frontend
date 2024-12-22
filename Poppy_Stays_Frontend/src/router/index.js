import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../view/Home_Page.vue'; // Import the HomePage component
import SignUpLogin from '../view/Sign_Up_Log_In.vue'; // Import the log in / sign up component
import MainLayout from '@/components/Main_Layout.vue';
import Profile from '../view/Profile_Page.vue'; // Import the Profile page component
import AllSpots from '../view/All_Spots.vue'; // Adjust the path as needed
import SpotDetails from '../view/Spot_Details.vue'; // Import the SpotDetails component

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
      {
        path: '/all-spots', // Define the route for All Spots
        name: 'allSpots',
        component: AllSpots, // This is the All Spots component
      },
      {
        path: '/spot/:id', // Define the route for a specific spot
        name: 'spotDetails',
        component: SpotDetails, 
        props: true, // Ensure that route params are passed as props to the component
      }
    ],
  },
];

const router = createRouter({
  history: createWebHistory(), // Enables modern history mode (no # in URLs)
  routes,
});

export default router;
