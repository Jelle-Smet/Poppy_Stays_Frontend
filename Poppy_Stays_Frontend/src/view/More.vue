<template>
  <div class="more-container">
    <!-- Title and intro text -->
    <h1>Explore More Information</h1>
    <p>
      We offer detailed resources to help you. Choose an option below to either explore frequently asked questions (FAQs) or learn how to book your perfect spot.
    </p>

    <!-- Decision buttons: FAQs or Booking Guide -->
    <div class="decision-buttons">
      <!-- FAQs Button -->
      <button @click="toggleSection('faqs')" class="decision-button">
        <span class="icon">❓</span> View FAQs
      </button>

      <!-- Booking Guide Button -->
      <button @click="toggleSection('guide')" class="decision-button">
        <span class="icon">📖</span> View Booking Guide
      </button>
    </div>

    <!-- FAQ Section -->
    <div v-if="activeSection === 'faqs'" class="content-section">
      <h2 class="section-title">Frequently Asked Questions (FAQs)</h2>

      <!-- Loading state for FAQs -->
      <div v-if="loadingFaqs" class="loading-message">Loading FAQs...</div>

      <!-- FAQs content -->
      <div v-else>
        <pre>{{ faqContent }}</pre>
      </div>

      <!-- Download button for the FAQ PDF -->
      <div class="download-container">
        <a href="/Public/Text_Files/More/FAQ/FAQs.pdf" download="FAQs.pdf" class="download-link">
          Download FAQs as PDF
        </a>
      </div>
    </div>

    <!-- Booking Guide Section -->
    <div v-if="activeSection === 'guide'" class="content-section">
      <h2 class="section-title">How Poppy Stays Works (Step-by-Step Guide)</h2>

      <!-- Loading state for Booking Guide -->
      <div v-if="loadingGuide" class="loading-message">Loading Booking Guide...</div>

      <!-- Booking Guide content -->
      <div v-else>
        <pre>{{ guideContent }}</pre>
      </div>

      <!-- Download button for the Booking Guide PDF -->
      <div class="download-container">
        <a href="/Public/Text_Files/More/Poppy's_Guide/Poppy's_Guide.pdf" download="Poppy's_Guide.pdf" class="download-link">
          Download Booking Guide as PDF
        </a>
      </div>
    </div>

    <!-- Divider -->
    <hr class="divider" />

    <!-- Navigate to All Spots -->
    <router-link to="/all-spots" class="cta-message">
      Explore all available camping spots
    </router-link>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'MorePage',
  setup() {
    // Single variable to track active section
    const activeSection = ref(null);

    // Content variables
    const faqContent = ref('');
    const guideContent = ref('');

    // Loading states
    const loadingFaqs = ref(false);
    const loadingGuide = ref(false);

    /**
     * Fetch content from a file (FAQ or Booking Guide).
     * Updates corresponding content and loading states.
     */
    const fetchContent = async (filePath, contentRef, loadingRef) => {
      loadingRef.value = true;
      try {
        const response = await fetch(filePath);
        if (response.ok) {
          contentRef.value = await response.text();
        } else {
          contentRef.value = 'Failed to load content.';
        }
      } catch (error) {
        contentRef.value = 'Error loading content.';
      } finally {
        loadingRef.value = false;
      }
    };

    const loadFaqs = () => fetchContent('/Public/Text_Files/More/FAQ/FAQs.txt', faqContent, loadingFaqs);
    const loadGuide = () => fetchContent('/Public/Text_Files/More/Poppy\'s_Guide/Poppy\'s_Guide.txt', guideContent, loadingGuide);

    /**
     * Toggles the visibility of the selected section and loads content.
     * Closes the other section when a new one is opened.
     */
    const toggleSection = (section) => {
      if (activeSection.value === section) {
        activeSection.value = null; // Close section if it's already open
      } else {
        activeSection.value = section;
        if (section === 'faqs') {
          loadFaqs();
        } else if (section === 'guide') {
          loadGuide();
        }
      }
    };

    return {
      activeSection,
      faqContent,
      guideContent,
      loadingFaqs,
      loadingGuide,
      toggleSection
    };
  }
};
</script>

<style scoped>
/* General Container Styling */
.more-container {
  padding: 30px;
  font-family: 'Arial', sans-serif;
  background-color: #f9f9f9;
  color: #333;
  text-align: center;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Header and Intro Text */
h1 {
  font-size: 2.8rem;
  color: #2c3e50;
  margin-bottom: 20px;
  text-transform: uppercase;
}

p {
  font-size: 1.2rem;
  line-height: 1.6;
  margin: 20px 0;
}

/* Buttons for Decision Making */
.decision-buttons {
  display: flex;
  justify-content: space-around;
  margin: 20px 0;
}

.decision-button {
  padding: 20px 40px;
  font-size: 1.5rem;
  color: #fff;
  background-color: #2980b9;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 15px;
  transition: background-color 0.3s ease;
}

.decision-button .icon {
  font-size: 2rem;
}

.decision-button:hover {
  background-color: #3498db;
}

/* Content Sections */
.content-section {
  margin-top: 30px;
  text-align: left;
  font-family: 'Courier New', Courier, monospace;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 2.2rem;
  color: #2980b9;
  margin-bottom: 20px;
  text-transform: uppercase;
}

/* Divider */
hr.divider {
  margin-top: 30px;
  border-top: 2px solid #2980b9;
  width: 100%;
}

/* Loading Message */
.loading-message {
  font-size: 1.2rem;
  color: #95a5a6;
}

/* Download Link Styling */
.download-container {
  margin-top: 20px;
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

/* CTA Message */
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
</style>
