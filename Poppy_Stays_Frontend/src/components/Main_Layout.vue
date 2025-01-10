<template>
  <div>
    <!-- Navbar is included here -->
    <Navbar />
    <router-view /> <!-- This renders the page content (e.g., HomePage.vue) -->
  </div>
</template>

<script>
import Navbar from '../components/Navbar.vue'; // Ensure Navbar is imported

export default {
  components: {
    Navbar, // Register Navbar
  },
};
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  font-family: 'Arial', sans-serif; /* Clean modern font */
  z-index: -1;
}

/* Full page background with dark grey color */
body::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 1000%; /* Full width */
  height: 1000%; /* Full height */
  background-color: darkgrey; /* Dark grey color behind the triangles */
  z-index: -3; /* Place it behind content */
  filter: blur(2px);
}

/* Create a full-page triangle pattern */
body::after {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%; /* Ensure the background fills the full page */
  height: 100%; /* Ensure the triangles cover the full height */
  background:
    linear-gradient(45deg, rgba(255, 255, 255, 0.1) 25%, transparent 25%) -50px 0,
    linear-gradient(45deg, rgba(255, 255, 255, 0.1) 25%, transparent 25%) 0px 0,
    linear-gradient(45deg, rgba(255, 255, 255, 0.1) 25%, transparent 25%) 50px 0;
  background-size: 100px 100px; /* Adjust this for the size of the triangles */
  opacity: 0.2;
  z-index: -2; /* Ensure this stays behind content */
}

/* Logo overlay that stays in front of the background but behind the content */
body::before {
  content: '';
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* Center the logo */
  width: 100%; /* Adjust width as needed */
  height: 100%; /* Adjust height as needed */
  background-image: url('@/assets/images/Poppy_stays_Long.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  opacity: 0.3; /* Subtle logo effect */
  z-index: -2; /* Ensure the logo is in front of the background but behind the content */
}
</style>
