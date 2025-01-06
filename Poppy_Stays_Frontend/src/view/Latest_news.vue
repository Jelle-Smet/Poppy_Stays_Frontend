<template>
  <div class="news-container">
    <!-- Welcome message and introductory paragraph -->
    <h1>Latest News</h1>
    <p>
      Stay updated with all the exciting news and updates from Poppy Stays!
      From new locations to special promotions and new features, we’ve got a lot to share with you. Read on for all the latest announcements!
    </p>

    <!-- Container for the download link (if needed) -->
    <div class="download-container">
      <!-- Button to download the News.txt file -->
      <a href="/Public/Text_Files/News/Latest_News.pdf" download="Latest_News.pdf" class="download-link">
        Download Latest News
      </a>
    </div>

    <!-- Divider line to separate sections -->
    <hr class="divider" />

    <!-- News Section -->
    <div v-if="loading" class="loading-message">Loading news...</div>

    <!-- If no news is available, display this message -->
    <div v-else>
      <div v-if="newsContent === ''" class="no-news-message">
        No news available at the moment.
      </div>

      <!-- Display news content -->
      <pre>{{ newsContent }}</pre>
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
  name: 'NewsPage',
  setup() {
    const newsContent = ref('');
    const loading = ref(true);

    const fetchNews = async () => {
      try {
        // Fetch the news file content
        const response = await fetch('/Public/Text_Files/News/Latest_News.txt');
        if (response.ok) {
          newsContent.value = await response.text();
        } else {
          newsContent.value = 'Failed to load news.';
        }
      } catch (error) {
        newsContent.value = 'Error loading news.';
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      fetchNews();
    });

    return {
      newsContent,
      loading
    };
  }
};
</script>

<style scoped>
/* Styles for the news page container */
.news-container {
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

.no-news-message {
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
