<template>
  <div>
    <!-- Navbar Component -->
    <Navbar />  <!-- This imports and renders the Navbar component, which will always be visible at the top of the page -->

    <!-- Main Content -->
    <main class="content-container">
      <h1 class="page-title">Welcome to Poppy Stays!</h1> <!-- Main page title -->
      <p class="page-text">
        {{ fileContent }}  <!-- The content of the file will be displayed here -->
      </p>
    </main>
  </div>
</template>

<script>
// Importing necessary components and functions
import Navbar from '../components/Navbar.vue'; // Ensure this path points correctly to your Navbar.vue component
import { ref, onMounted } from 'vue'; // Importing Vue's ref and onMounted functions for reactivity and lifecycle hooks

export default {
  components: {
    Navbar, // Registering the Navbar component so it can be used in this template
  },
  setup() {
    const fileContent = ref(""); // Create a reactive variable to hold the content from the text file

    // Function to fetch and display the content of the text file
    const fetchTextFile = async () => {
      const response = await fetch("/public/Text_Files/Welcome.txt"); // Fetch the text file from the public directory
      const text = await response.text(); // Convert the fetched response to text
      fileContent.value = text; // Assign the text content to the reactive variable
    };

    // Lifecycle hook to run the fetchTextFile function when the component is mounted
    onMounted(() => {
      fetchTextFile(); // Call the fetchTextFile function when the component is mounted
    });

    return {
      fileContent, // Expose the fileContent variable to the template
    };
  },
};
</script>

<style scoped>
/* Scoped styles for the content container to ensure it takes the full width of the page */
.content-container {
  width: 100%; /* Ensure the content container spans the full width of the page */
  margin-top: 80px; /* Add space below the navbar to ensure it doesn't overlap the content */
  padding: 0 20px; /* Horizontal padding for comfort */
  box-sizing: border-box; /* Ensure padding is included in the width calculation */
  display: flex; /* Use flexbox to structure the content */
  flex-direction: column; /* Arrange items in a column */
  align-items: center; /* Center the content horizontally */
  overflow-x: hidden; /* Prevent horizontal scrolling */
}

/* Title Style */
.page-title {
  font-size: 2.5rem; /* Make the title larger */
  font-weight: bold; /* Make the title bold */
  text-decoration: underline; /* Underline the title */
  text-align: center; /* Center the title */
  margin-bottom: 20px; /* Add space below the title */
  width: 100%; /* Ensure the title takes up the full width of the container */
  padding: 10px; /* Add padding around the text */
  border: 2px solid #fff; /* Add a white border around the title */
  border-radius: 8px; /* Optional: rounded corners for the border */
  color: white; /* Set the text color to white */
  background-color: #333; /* Set a dark background color to contrast with the white text */
}

/* Page text style to ensure full-width usage and wrapping */
.page-text {
  font-size: 1.25rem; /* Set the font size of the text */
  color: white; /* Set the text color to white */
  line-height: 1.6; /* Improve readability by setting line height */
  width: 100%; /* Ensure the text spans the full width of the page */
  max-width: 100%; /* Prevent the text from exceeding the container width */
  word-wrap: break-word; /* Ensure that long words wrap correctly */
  overflow-wrap: break-word; /* Ensures that long words don't overflow */
  white-space: pre-line; /* Preserve line breaks from the .txt file */
  margin: 0 auto; /* Center the text block horizontally */
  word-break: break-word; /* Break long words if necessary */
  border: 2px solid #fff; /* Add a white border around the text */
  border-radius: 8px; /* Optional: rounded corners for the text box */
  padding: 10px; /* Add padding inside the text box */
  background-color: #444; /* Set a slightly lighter dark background for the text */
}

/* Styles for the body */
body {
  width: 100%; /* Ensure the body takes the full width of the page */
  margin: 0; /* Remove default margin */
}

</style>
