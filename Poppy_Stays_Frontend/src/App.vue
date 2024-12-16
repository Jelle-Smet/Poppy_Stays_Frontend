<script setup>
// Import the Navigation Bar component
import NavigationBar from '@/components/Navbar.vue'; // This imports the Navbar component, which will be used in the app layout.
</script>

<template>
  <div id="app">
    <!-- Navigation Bar, always at the top -->
    <NavigationBar /> <!-- This renders the navigation bar component at the top of the page -->

    <!-- Content rendered based on the route -->
    <router-view /> <!-- This tag will display different components based on the current route -->
  </div>
</template>

<style scoped>
/* Scoped styles for App.vue */

/* The main container for the entire application */
#app {
  display: flex; /* Use Flexbox layout */
  flex-direction: column; /* Stack children vertically */
  min-height: 100vh; /* Ensure the app takes up at least the full viewport height */
  width: 100vw; /* Set the width of the app to 100% of the viewport width */
  overflow-x: hidden; /* Prevent horizontal scrolling in the app */
}

/* Styles for the body element */
body {
  width: 100%; /* Ensure body element takes up full width */
  margin: 0; /* Remove any default margin around the body */
}

/* The <main> element which contains the primary content of the page */
main {
  flex-grow: 1; /* Allow main content to expand and fill the remaining space */
  width: 100%; /* Ensure the main content takes up the full width of the page */
  box-sizing: border-box; /* Include padding in the width calculation, preventing overflow */
  overflow-x: hidden; /* Prevent horizontal scrolling in the main content */
}

/* Additional padding for the #app container to account for the navbar height */
#app {
  padding-top: 60px; /* Adjust the top padding to avoid content being hidden under the fixed navbar */
}
</style>
