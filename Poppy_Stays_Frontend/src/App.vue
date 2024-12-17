<script setup>
import Footer from '@/components/Footer.vue'; // Import Footer globally
</script>

<template>
  <div id="app">
    <!-- Content rendered based on the route -->
    <router-view /> <!-- This tag will display different components based on the current route -->

    <!-- Footer will be rendered here globally -->
    <Footer />
  </div>
</template>

<style scoped>
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100vw;
  overflow-x: hidden;
  padding-top: 60px;
}

body {
  width: 100%;
  margin: 0;
}

main {
  flex-grow: 1;
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
}
</style>
