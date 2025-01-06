<template>
  <div>
    <!-- Navbar is included here -->
    <Navbar />
    <router-view/> <!-- This renders the page content (e.g., HomePage.vue) -->
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
