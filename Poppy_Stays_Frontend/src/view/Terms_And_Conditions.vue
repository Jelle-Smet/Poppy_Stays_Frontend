<template>
  <div class="terms-conditions-container">
    <!-- Welcome message and introductory paragraph -->
    <h1>Terms and Conditions</h1>
    <p>
      Welcome to Poppy Stays! By using our website and services, you agree to the following terms and conditions. Please read them carefully before using our platform.
    </p>

    <!-- Container for the download link (if needed) -->
    <div class="download-container">
      <!-- Button to download the Terms and Conditions PDF file -->
      <a href="/Public/Text_Files/Terms_And_Conditions/Terms_And_Conditions.pdf" download="Terms_And_Conditions.pdf" class="download-link">
        Download Terms and Conditions
      </a>
    </div>

    <!-- Divider line to separate sections -->
    <hr class="divider" />

    <!-- Terms and Conditions Content Section -->
    <div v-if="loading" class="loading-message">Loading Terms and Conditions...</div>

    <!-- If no terms are available, display this message -->
    <div v-else>
      <div v-if="termsContent === ''" class="no-terms-message">
        No Terms and Conditions available at the moment.
      </div>

      <!-- Display terms and conditions content -->
      <pre>{{ termsContent }}</pre>
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
  name: 'TermsConditionsPage',
  setup() {
    const termsContent = ref('');
    const loading = ref(true);

    const fetchTermsConditions = async () => {
      try {
        // Fetch the Terms and Conditions file content
        const response = await fetch('/Public/Text_Files/Terms_And_Conditions/Terms_And_Conditions.txt');
        if (response.ok) {
          termsContent.value = await response.text();
        } else {
          termsContent.value = 'Failed to load Terms and Conditions.';
        }
      } catch (error) {
        termsContent.value = 'Error loading Terms and Conditions.';
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      fetchTermsConditions();
    });

    return {
      termsContent,
      loading
    };
  }
};
</script>

<style scoped>
/* Styles for the Terms and Conditions page container */
.terms-conditions-container {
  padding: 20px;
  font-family: 'Courier New', Courier, monospace;
  background-color: #f1f1f1;
  color: #333;
  text-align: left;
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

.no-terms-message {
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
