<script setup>
// Importing the Navigation Bar Component (or Header component)
import NavigationBar from '@/components/Navigation_bar.vue'; // Adjust path if necessary
</script>

<template>
  <div id="app">
    <!-- Include the Navigation Bar Component at the top -->
    <NavigationBar />

    <!-- Content Area where the different pages will render -->
    <router-view /> <!-- Displays the content based on the current route -->
  </div>
</template>

<style scoped>
/* Scoped styles for App.vue */

header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>

