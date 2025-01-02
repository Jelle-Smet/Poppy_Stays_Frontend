import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../view/Home_Page.vue'; // Import the HomePage component
import SignUpLogin from '../view/Sign_Up_Log_In.vue'; // Import the log in / sign up component
import MainLayout from '@/components/Main_Layout.vue'; // Main Layout wrapper for all pages
import Profile from '../view/Profile_Page.vue'; // Import the Profile page component
import AllSpots from '../view/All_Spots.vue'; // Import All Spots component
import SpotDetails from '../view/Spot_Details.vue'; // Import the SpotDetails component
import CategoryPage from '../view/Category_Spots.vue'; // Import the CategoryPage component
import OwnerSpotPage from '../view/Owner_Spots.vue'; // Import the new OwnerSpotPage component
import SpotOverview from '../view/Spot_Overview.vue'; // Import the new SpotOverview component
import UpdateSpotPage from '../view/Spot_Update.vue'; // Import the UpdateSpotPage component
import AddSpot from '../View/Add_Spot.vue'; // import the AddSpot component
import DeleteSpotOverviewView from '../view/Overwiev_Delete_Spot.vue'; // import the DeleteSpotview component
import DeleteSpot from '../view/Spot_Delete.vue'; // import the DeleteSpot component
import FavoriteSpot from '../view/Favorite_Spots.vue'; // import the FavoriteSpot component
import UpcomingBookings from '../view/Upcoming_bookings.vue'; // import the UpcomingBookings components
import CancelBooking from '../view/Cancel_Booking.vue'; // import the UpcomingBookings components
import PastAndCancelledBookings from '../view/Past_And_Cancelled_bookings.vue'; // Import the PastAndCancelledBookings component.
import SubmitReview from '../view/Submit_Review.vue'; // import the SubmitReview component.
import ThankYouPage from '../view/Thank_You.vue'; // import the ThankYouPage component
import AccountSettings from '../view/Account_Settings.vue'; // import the AccountSettings component
import PastAndUpcomingBookingsOwner from '../view/Spot_Booking.vue'; // import the PastAndUpcomingBookingsOwner component.
import PastAndCancelledOwnerBookings from '../view/Spot_Past_bookings.vue';// import the PastAndCancelledOwnerBookings component
import UpcomingOwnerBookings from '../view/Spot_Upcoming_Bookings.vue'; // import the UpcomingOwnerBookings component.

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
      {
        path: '/owner-spots', // New route for browsing spots as an owner
        name: 'ownerSpots',
        component: OwnerSpotPage, // Component for owner spots
      },
      {
        path: '/spot-overview', // New route for Spot Overview page
        name: 'spotOverview',
        component: SpotOverview, // Component for the spot overview
        props: true, // Pass route params as props to the component
      },

      {
        path: '/spot/update/:id',
        name: 'spotUpdate',
        component: UpdateSpotPage,
        props: true
      },

      {
        path: '/add-spot', // Define the path for the new AddSpot page
        name: 'addSpot', // Name the route
        component: AddSpot, // The component to render when this route is visited
      },

      {
        path: '/spot/delete-overview',
        name: 'spotDeleteOverview',
        component: DeleteSpotOverviewView,
        props: true
      },

      {
        path: '/spot/delete/:id',
        name: 'spotDelete',
        component: DeleteSpot, // This should handle the logic for deleting a specific spot
        props: true // Enables passing `id` as a prop to the component
      },

      {
        path: '/spot/favorite',
        name: 'favoriteSpots',
        component: FavoriteSpot,
        props: true
      },

      {
        path: '/upcoming_bookings',
        name: 'UpcomingBookings',
        component: UpcomingBookings,
        props: true
      },

      {
        path: '/cancel-booking/:bookingId', // Path with the booking ID as a parameter
        name: 'cancelBooking',
        component: CancelBooking, // Ensure you have the CancelBooking component
        props: true, // Pass the bookingId as a prop to the component
      },

      {
        path: '/past-cancelled-bookings', // Define the URL path
        name: 'pastCancelledBookings', // Name of the route
        component: PastAndCancelledBookings, // Component to render
        props: true, // Enable props if the component needs route parameters
      },

      {
        path: "/submit-review/:spotId", // Dynamic route with userId and spotId
        name: "SubmitReview", // name of the route
        component: SubmitReview, // component to render
        props: true, // Pass route params as props to the component
      },

      {
        path: "/thank-you",
        name: "ThankYou",
        component: ThankYouPage,
      },

      {
        path: '/settings',
        name: 'Settings',
        component: AccountSettings,  // Register the Settings page route here
      },

      {
        path: '/Booking_Management',
        name: 'Booking_Management',
        component: PastAndUpcomingBookingsOwner,
        props: true
      },

      {
        path: '/past-bookings/:spotId',
        name: 'PastAndCancelledOwnerBookings',
        component: PastAndCancelledOwnerBookings,
        props: true, // This allows the spotId to be passed as a prop.
      },

      {
        path: '/upcoming-bookings/:spotId',
        name: 'UpcomingOwnerBookings',
        component: UpcomingOwnerBookings,  // Replace with the actual component name for the upcoming bookings page.
        props: true,  // This will allow the spotId to be passed as a prop to the component.
      }


    ],
  },
];

const router = createRouter({
  history: createWebHistory(), // Enables modern history mode (no # in URLs)
  routes,
});

export default router;
