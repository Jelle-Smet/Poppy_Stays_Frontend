<template>
  <div class="privacy-policy-container">
    <!-- Welcome message and introductory paragraph -->
    <h1>Privacy Policy</h1>
    <p>
      Your privacy is important to us at Poppy Stays. This Privacy Policy outlines the types of personal information we collect and how we use, store, and protect it. By using our services, you agree to the terms outlined in this policy.
    </p>

    <!-- Container for the download link (if needed) -->
    <div class="download-container">
      <!-- Button to download the Privacy Policy PDF file -->
      <a href="/Public/Text_Files/Privacy_Policy/Privacy_Policy.pdf" download="Privacy_Policy.pdf" class="download-link">
        Download Privacy Policy
      </a>
    </div>

    <!-- Divider line to separate sections -->
    <hr class="divider" />

    <!-- Privacy Policy Content Section -->
    <div v-if="loading" class="loading-message">Loading Privacy Policy...</div>

    <!-- If no policy is available, display this message -->
    <div v-else>
      <div v-if="privacyPolicyContent === ''" class="no-policy-message">
        No Privacy Policy available at the moment.
      </div>

      <!-- Display privacy policy content -->
      <pre>{{ privacyPolicyContent }}</pre>
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
  name: 'PrivacyPolicyPage',
  setup() {
    const privacyPolicyContent = ref('');
    const loading = ref(true);

    const fetchPrivacyPolicy = async () => {
      try {
        // Fetch the Privacy Policy file content
        const response = await fetch('/Public/Text_Files/Privacy_Policy/Privacy_Policy.txt');
        if (response.ok) {
          privacyPolicyContent.value = await response.text();
        } else {
          privacyPolicyContent.value = 'Failed to load Privacy Policy.';
        }
      } catch (error) {
        privacyPolicyContent.value = 'Error loading Privacy Policy.';
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      fetchPrivacyPolicy();
    });

    return {
      privacyPolicyContent,
      loading
    };
  }
};
</script>

<style scoped>
/* Styles for the Privacy Policy page container */
.privacy-policy-container {
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

.no-policy-message {
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
