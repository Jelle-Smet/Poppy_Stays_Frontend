import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../view/Home_Page.vue'; // Import the HomePage component
import SignUpLogin from '../view/Sign_Up_Log_In.vue'; // Import the log in / sign up component
import MainLayout from '@/components/Main_Layout.vue'; // Main Layout wrapper for all pages
import Profile from '../view/Profile_Page.vue'; // Import the Profile page component
import AllSpots from '../view/All_Spots.vue'; // Import All Spots component
import SpotDetails from '../view/Spot_Details.vue'; // Import the SpotDetails component
import CategoryPage from '../view/Category_Spots.vue'; // Import the CategoryPage component

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
        component: SignUpLogin,
      },
      {
        path: '/profile', // Define the route for the Profile page
        name: 'profile',
        component: Profile,
      },
      {
        path: '/all-spots', // Define the route for All Spots
        name: 'allSpots',
        component: AllSpots,
      },
      {
        path: '/spot/:id', // Define the route for a specific spot
        name: 'spotDetails',
        component: SpotDetails,
        props: true, // Pass route params as props to the component
      },
      {
        path: '/categories', // Add the route for the Category Page
        name: 'categories',
        component: CategoryPage, // Component to display the categories dropdown
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(), // Enables modern history mode (no # in URLs)
  routes,
});

export default router;
