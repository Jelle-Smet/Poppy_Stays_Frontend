<template>
  <div>
    <!-- Hero Section -->
    <section class="hero-section">
      <video autoplay muted loop playsinline class="background-video">
        <source src="/public/videos/Home_Page_Video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div class="hero-overlay">
        <h1 class="hero-title">Welcome to Poppy Stays</h1>
        <p class="hero-subtitle">Discover the perfect spot for your next adventure</p>
        <router-link to="/all-spots">
          <button class="cta-button">Start Exploring</button>
        </router-link>
      </div>
    </section>

    <!-- Main Content -->
    <main class="content-container">
      <h2 class="section-title">About Poppy Stays</h2>
      <p class="page-text">
        {{ fileContent }} <!-- Content from the file displayed here -->
      </p>
    </main>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";

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
      fileContent,
    };
  },
};
</script>

<style scoped>
/* Hero Section */
.hero-section {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 60vh;
  overflow: hidden;
}

.background-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
  border-radius: 8px; /* Makes the edges of the video rounded */
}

.hero-overlay {
  position: relative;
  z-index: 1;
  background: rgba(0, 0, 0, 0.5); /* Semi-transparent overlay for readability */
  padding: 20px;
  border-radius: 8px;
}

.hero-title {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 10px;
  color: white;
  text-shadow: 2px 2px 5px #000;
}

.hero-subtitle {
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: white;
  text-shadow: 1px 1px 3px #000;
}

.cta-button {
  background-color: rgb(42, 79, 160);
  color: white;
  font-size: 1.2rem;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  box-shadow: 2px 2px 5px #000;
  transition: transform 0.2s ease-in-out;
}

.cta-button:hover {
  transform: scale(1.05);
}

/* Content Section */
.content-container {
  width: 100%;
  max-width: 1200px;
  margin: 20px auto;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #333;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.section-title {
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
  color: #ddd;
  text-decoration: underline;
}

.page-text {
  font-size: 1.25rem;
  line-height: 1.6;
  width: 100%;
  color: #ddd;
  text-align: justify;
  word-wrap: break-word;
  white-space: pre-line;
}
</style>
