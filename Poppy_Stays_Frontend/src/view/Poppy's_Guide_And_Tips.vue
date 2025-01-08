<template>
  <div class="guide-container">
    <!-- Welcome message and introductory paragraph -->
    <h1>Poppy's Guide: Tips & Tricks</h1>
    <p>
      Discover essential tips and tricks to make the most of your stay with Poppy Stays! Whether you're planning a camping adventure or a cozy BnB getaway, this guide has everything you need to ensure a seamless and enjoyable experience.
    </p>

    <!-- Container for the download link -->
    <div class="download-container">
      <!-- Button to download the guide file -->
      <a
        href="/Public/Text_Files/Poppy's_Guide_And_Tips/Poppy's_Guide_And_Tips.pdf"
        download="Poppy's_Guide_And_Tips.pdf"
        class="download-link"
      >
        Download Poppy's Guide (PDF)
      </a>
    </div>

    <!-- Divider line to separate sections -->
    <hr class="divider" />

    <!-- Guide Content Section -->
    <div v-if="loading" class="loading-message">Loading guide content...</div>

    <!-- If no guide content is available, display this message -->
    <div v-else>
      <div v-if="guideContent === ''" class="no-guide-message">
        No guide available at the moment.
      </div>

      <!-- Display guide content -->
      <pre>{{ guideContent }}</pre>
    </div>

    <!-- Another divider line before the CTA message -->
    <hr class="divider" />

    <!-- Call to action to explore more or book -->
    <router-link to="/all-spots" class="cta-message">Explore Our Spots</router-link>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  name: 'GuidePage',
  setup() {
    const guideContent = ref('');
    const loading = ref(true);

    const fetchGuide = async () => {
      try {
        // Fetch the guide file content
        const response = await fetch(
          "/Public/Text_Files/Poppy's_Guide_And_Tips/Poppy's_Guide_And_Tips.txt"
        );
        if (response.ok) {
          guideContent.value = await response.text();
        } else {
          guideContent.value = 'Failed to load the guide.';
        }
      } catch (error) {
        guideContent.value = 'Error loading the guide.';
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      fetchGuide();
    });

    return {
      guideContent,
      loading,
    };
  },
};
</script>

<style scoped>
/* Styles for the guide page container */
.guide-container {
  padding: 20px;
  font-family: 'Courier New', Courier, monospace;
  background-color: #f1f1f1;
  color: #333;
  text-align: center;
}

h1 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 20px;
  text-transform: uppercase;
}

p {
  font-size: 1.2rem;
  line-height: 1.6;
  margin: 20px 0;
}

hr.divider {
  margin: 30px 0;
  border-top: 2px solid #2980b9;
  width: 100%;
}

.loading-message {
  font-size: 1.2rem;
  color: #95a5a6;
}

.no-guide-message {
  font-size: 1.2rem;
  color: #e74c3c;
}

.cta-message {
  font-size: 1.4rem;
  color: #2980b9;
  margin-top: 30px;
  font-weight: bold;
  text-transform: uppercase;
  text-decoration: none;
}

.cta-message:hover {
  color: #e74c3c;
  cursor: pointer;
}

/* Style for the download link */
.download-container {
  margin-bottom: 20px; /* Space below the download link */
}

.download-link {
  display: inline-block;
  padding: 10px 20px;
  font-size: 1.2rem;
  color: #fff;
  background-color: #2980b9;
  text-decoration: none;
  border-radius: 5px;
}

.download-link:hover {
  background-color: #3498db;
}
</style>
