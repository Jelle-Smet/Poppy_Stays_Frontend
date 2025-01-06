<template>
  <div class="promotions-container">
    <!-- Welcome message and introductory paragraph -->
    <h1>Welcome to Poppy Stays' Special Promotions!</h1>
    <p>
      Whether you're planning a weekend getaway or a longer adventure, we’ve got exclusive deals just for you. Enjoy limited-time discounts, seasonal offers, and special packages that make your next camping experience even more affordable. Check back often for new promotions and book your perfect escape today!
    </p>
    <p>
      By participating in Poppy Stays' Special Promotions, you agree to our
      <!-- Router links for Terms and Conditions and Privacy Policy -->
      <router-link to="/terms-and-conditions">Terms and Conditions</router-link> and acknowledge that all offers are subject to availability and certain restrictions. Promotions cannot be combined with other offers and are valid for a limited time only. Please review our full
      <router-link to="/privacy-policy">Privacy Policy</router-link> for more details on eligibility, cancellations, and any applicable limitations.
    </p>

    <!-- Container for the download link (now at the top of promotions) -->
    <div class="download-container">
      <!-- Button to download the Promotions.txt file -->
      <a href="/public/Text_Files/promotions/Promotions.pdf" download="Promotions.pdf" class="download-link">
        Download Promotions
      </a>
    </div>

    <!-- Divider line to separate sections -->
    <hr class="divider" />

    <!-- Active Promotions Section -->
    <h2>Active Promotions:</h2>

    <!-- Loading message if promotions are still being fetched -->
    <div v-if="loading" class="loading-message">Loading promotions...</div>

    <!-- If no promotions are available, display this message -->
    <div v-else>
      <div v-if="promotions.length === 0" class="no-promotions-message">
        No active promotions at the moment.
      </div>

      <!-- Loop through each promotion and display its details -->
      <div v-for="(promotion, index) in promotions" :key="promotion.Promotion_Code" class="promotion">
        <!-- Display promotion header with its index number and name -->
        <div class="promotion-header">
          <strong>{{ index + 1 }}) {{ promotion.Promotion_Name }}</strong>
        </div>
        <!-- Display the description of the promotion -->
        <p>{{ promotion.Promotion_Description }}</p>
        <!-- Display the promo code -->
        <p><strong>Promo Code:</strong> <span class="promo-code">{{ promotion.Promotion_Code }}</span></p>
        <!-- Divider between promotions -->
        <hr />
      </div>
    </div>

    <!-- Another divider line before the CTA message -->
    <hr class="divider" />

    <!-- Router link for the "Book your adventure today!" message, directing users to the all-spots page -->
    <router-link to="/all-spots" class="cta-message">Book your adventure today!</router-link>
  </div>
</template>


<script>
import { ref, onMounted } from 'vue';

export default {
  name: 'Promotions', // Name of the component
  setup() {
    // Reactive references to hold promotions data and loading state
    const promotions = ref([]);
    const loading = ref(true);

    // Fetch the promotions from the API endpoint
    const fetchPromotions = async () => {
      try {
        // Make a request to the backend API to get the active promotions
        const response = await fetch('http://localhost:3000/api/promotions');
        if (response.ok) {
          // Parse the response as JSON and store it in the promotions array
          const data = await response.json();
          promotions.value = data.promotions;
        } else {
          // If no promotions are found, set the promotions array to empty
          promotions.value = [];
        }
      } catch (error) {
        // Log any errors encountered during the fetch operation
        console.error('Error fetching promotions:', error);
      } finally {
        // Once the fetch operation is complete (success or failure), set loading to false
        loading.value = false;
      }
    };

    // Fetch promotions when the component is mounted
    onMounted(() => {
      fetchPromotions();
    });

    // Return the data and loading state to be used in the template
    return {
      promotions,
      loading
    };
  }
};
</script>

<style scoped>
/* Styles for the promotions page container */
.promotions-container {
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

.promotion-header {
  font-size: 1.4rem;
  color: #2980b9;
  margin-top: 10px;
}

.promotion {
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 20px;
}

.promo-code {
  font-weight: bold;
  color: #e74c3c;
}

.loading-message {
  font-size: 1.2rem;
  color: #95a5a6;
}

.no-promotions-message {
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
