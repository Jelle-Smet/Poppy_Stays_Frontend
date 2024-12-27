<template>
  <footer class="footer">
    <!-- Logo in the footer -->
    <img src="@/assets/images/Poppy_stays.png" alt="Poppy Stays Logo" class="footer-logo" />
  </footer>
</template>

<script>
export default {
  name: "Footer"
};
</script>

<style scoped>
.footer {
  width: 100%; /* Full width */
  text-align: center; /* Center the content horizontally */
  padding: 0px; /* Much larger padding for a bigger footer */
  background-color: transparent; /* No background */
}

.footer-logo {
  max-width: 1000px; /* Make the logo much larger */
  height: auto; /* Maintain aspect ratio */
  object-fit: contain; /* Ensure the image fits within its container */
}
</style>
