<template>
  <div class="partners-container">
    <!-- Welcome message and introductory paragraph -->
    <h1>Our Official Partners</h1>
    <p>
      At Poppy Stays, we are proud to collaborate with incredible individuals and brands that share our passion for adventure and quality. From property owners who provide unique camping spots and BnBs, to brands that enhance your outdoor experience, our partners help make every trip memorable.
    </p>

    <!-- Divider line to separate sections -->
    <hr class="divider" />

    <!-- Partner Content Section -->
    <div v-if="loading" class="loading-message">Loading partner content...</div>

    <!-- If no partner content is available, display this message -->
    <div v-else>
      <div v-if="partnerContent === ''" class="no-partner-message">
        No partner content available at the moment.
      </div>

      <!-- Display partner content -->
      <pre>{{ partnerContent }}</pre>
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
  name: 'PartnersPage',
  setup() {
    const partnerContent = ref('');
    const loading = ref(true);

    const fetchPartnerContent = async () => {
      try {
        // Fetch the partner content from the file
        const response = await fetch(
          "public/Text_Files/Official_Partners/Official_Partners.txt"
        );
        if (response.ok) {
          partnerContent.value = await response.text();
        } else {
          partnerContent.value = 'Failed to load partner content.';
        }
      } catch (error) {
        partnerContent.value = 'Error loading partner content.';
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      fetchPartnerContent();
    });

    return {
      partnerContent,
      loading,
    };
  },
};
</script>

<style scoped>
/* Styles for the partners page container */
.partners-container {
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

.no-partner-message {
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


</style>
