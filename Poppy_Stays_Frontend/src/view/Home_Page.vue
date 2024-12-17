<template>
  <div>
    <!-- Main Content -->
    <main class="content-container">
      <h1 class="page-title">Welcome to Poppy Stays!</h1> <!-- Main page title -->
      <p class="page-text">
        {{ fileContent }}  <!-- Content from the file displayed here -->
      </p>
    </main>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  setup() {
    const fileContent = ref("");

    const fetchTextFile = async () => {
      const response = await fetch("/public/Text_Files/Welcome.txt");
      const text = await response.text();
      fileContent.value = text;
    };

    onMounted(() => {
      fetchTextFile();
    });

    return {
      fileContent,  // Expose the file content
    };
  },
};
</script>

<style scoped>
/* Layout and content container */
.content-container {
  width: 100%;
  margin-top: 80px;
  padding: 0 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-x: hidden;
  min-height: 100vh; /* Ensure content takes full height */
}

.page-title {
  font-size: 2.5rem;
  font-weight: bold;
  text-decoration: underline;
  text-align: center;
  margin-bottom: 20px;
  width: 100%;
  padding: 10px;
  border: 2px solid #fff;
  border-radius: 8px;
  color: white;
  background-color: #333;
}

.page-text {
  font-size: 1.25rem;
  color: white;
  line-height: 1.6;
  width: 100%;
  max-width: 100%;
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: pre-line;
  margin: 0 auto;
  word-break: break-word;
  border: 2px solid #fff;
  border-radius: 8px;
  padding: 10px;
  background-color: #444;
}

body {
  width: 100%;
  margin: 0;
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* Make sure footer stays at the bottom */
}
</style>
