<template>
  <div class="delete-container">
    <div class="warning-card">
      <h2>Delete Spot Confirmation</h2>

      <!-- Warning message and details about the consequences of deleting a spot -->
      <div class="warning-section">
        <div class="warning-icon">⚠️</div>
        <h3>Warning: This action cannot be undone</h3>
        <p>You are about to delete this spot permanently. Please review the following consequences:</p>

        <!-- List of consequences of the delete action -->
        <div class="consequences">
          <div class="consequence-item">
            <span class="icon">🗑️</span>
            <p>All spot information will be permanently deleted</p>
          </div>
          <div class="consequence-item">
            <span class="icon">📸</span>
            <p>All uploaded images will be removed</p>
          </div>
          <div class="consequence-item">
            <span class="icon">📅</span>
            <p>All availability schedules will be erased</p>
          </div>
          <div class="consequence-item">
            <span class="icon">⚡</span>
            <p>You'll need to manually recreate everything if you change your mind</p>
          </div>
          <div class="consequence-item">
            <span class="icon">👥</span>
            <p>Existing bookings linked to this spot will be canceled</p>
          </div>
          <div class="consequence-item">
            <span class="icon">💰</span>
            <p>You may lose potential revenue from future bookings</p>
          </div>
          <div class="consequence-item">
            <span class="icon">🌐</span>
            <p>This spot will no longer appear in search results, reducing visibility</p>
          </div>
          <div class="consequence-item">
            <span class="icon">⏳</span>
            <p>Recreating this spot and restoring its details will take time and effort</p>
          </div>
        </div>
      </div>

      <!-- Confirmation section before deleting -->
      <div class="confirmation-section" v-if="!deleted">
        <!-- Checkbox to confirm understanding -->
        <label class="confirm-checkbox">
          <input type="checkbox" v-model="understood" />
          I understand that this action cannot be undone
        </label>

        <!-- Action buttons -->
        <div class="button-group">
          <button class="cancel-button" @click="goBack">Cancel</button>
          <button
            class="delete-button"
            :disabled="!understood"
            @click="confirmDelete"
          >
            Delete Spot
          </button>
        </div>
      </div>

      <!-- Success message after deletion -->
      <div v-else class="success-message">
        <p>Spot has been successfully deleted</p>
        <button class="return-button" @click="returnToSpots">
          Return to My Spots
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import axios from "axios";
import { useRouter, useRoute } from "vue-router";

export default {
  setup() {
    // Use Vue Router for navigation
    const router = useRouter();
    const route = useRoute();

    // Reactive variables for UI state management
    const understood = ref(false); // Checkbox state for understanding the consequences
    const deleted = ref(false); // State to track if the spot has been deleted
    const error = ref(null); // To display any error messages

    // Fetch the token from localStorage (assuming user authentication)
    const token = localStorage.getItem("authToken");

    /**
     * Function to confirm the deletion of the spot.
     * Sends a DELETE request to the backend with the spot ID and authorization token.
     */
    const confirmDelete = async () => {
      try {
        await axios.delete("http://localhost:3000/api/delete-spot", {
          headers: {
            Authorization: `Bearer ${token}`, // Authorization header with token
            "Content-Type": "application/json", // Set content type
          },
          data: { spotId: route.params.id }, // Pass spot ID in request body
        });
        deleted.value = true; // Update state to show success message
      } catch (err) {
        // Handle errors and display message
        error.value = "Failed to delete spot. Please try again.";
        console.error("Error:", err);
      }
    };

    /**
     * Function to navigate back to the previous page.
     * Called when the user clicks the "Cancel" button.
     */
    const goBack = () => {
      router.push("/spot/delete-overview"); // Use Vue Router's back method to navigate to the previous page
    };

    /**
     * Function to navigate to the owner's spots page.
     * Called after successful deletion or from the success message.
     */
    const returnToSpots = () => {
      router.push("/spot-overview"); // Navigate to the route named 'ownerSpots'
    };

    // Expose variables and functions to the template
    return {
      understood,
      deleted,
      error,
      confirmDelete,
      goBack,
      returnToSpots,
    };
  },
};
</script>

<style scoped>
/* Container for the delete confirmation page */
.delete-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: #f8f9fa;
}

/* Card containing the warning and confirmation details */
.warning-card {
  background: white;
  border-radius: 12px;
  padding: 30px;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  color: black;
}

/* Header and warning message */
h2 {
  color: #dc3545;
  text-align: center;
  margin-bottom: 30px;
}

.warning-section {
  text-align: center;
  margin-bottom: 30px;
}

.warning-icon {
  font-size: 48px;
  margin-bottom: 20px;
}

/* Consequences list */
.consequences {
  margin-top: 20px;
}

.consequence-item {
  display: flex;
  align-items: center;
  margin: 15px 0;
  padding: 10px;
  background: #fff5f5;
  border-radius: 8px;
}

.consequence-item .icon {
  font-size: 24px;
  margin-right: 15px;
  min-width: 40px;
}

/* Confirmation section styling */
.confirmation-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.confirm-checkbox {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

/* Buttons */
.button-group {
  display: flex;
  gap: 15px;
  margin-top: 20px;
}

.delete-button,
.cancel-button,
.return-button {
  padding: 10px 25px;
  border-radius: 6px;
  font-size: 1em;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.delete-button {
  background-color: #dc3545;
  color: white;
}

.delete-button:disabled {
  background-color: #dc354580;
  cursor: not-allowed;
}

.delete-button:not(:disabled):hover {
  background-color: #c82333;
}

.cancel-button {
  background-color: #6c757d;
  color: white;
}

.cancel-button:hover {
  background-color: #5a6268;
}

.return-button {
  background-color: #007bff;
  color: white;
}

.return-button:hover {
  background-color: #0056b3;
}

/* Success message styling */
.success-message {
  text-align: center;
  color: #28a745;
}

/* Error styling */
.error {
  color: #dc3545;
  text-align: center;
  margin-top: 10px;
}
</style>
