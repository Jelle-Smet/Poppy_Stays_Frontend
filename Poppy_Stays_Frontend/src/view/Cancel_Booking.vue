<template>
  <div class="delete-container">
    <div class="warning-card">
      <h2>Cancel Booking Confirmation</h2>

      <!-- Display booking details (ID and price) -->
      <div v-if="bookingDetails">
        <p><strong>Booking ID:</strong> {{ bookingDetails.id }}</p>
        <p><strong>Booking Price:</strong> ${{ bookingDetails.price }}</p>
      </div>

      <!-- Warning message and details about the consequences of canceling a booking -->
      <div class="warning-section">
        <div class="warning-icon">⚠️</div>
        <h3>Warning: This action cannot be undone</h3>
        <p>You are about to cancel this booking permanently. Please review the following consequences:</p>

        <!-- List of consequences of the cancel action -->
        <div class="consequences">
          <div class="consequence-item">
            <span class="icon">❌</span>
            <p>The booking will be permanently canceled</p>
          </div>
          <div class="consequence-item">
            <span class="icon">💸</span>
            <p>You will receive a 75% refund of the booking cost</p>
          </div>
          <div class="consequence-item">
            <span class="icon">🗓️</span>
            <p>Any associated amenities and services will be lost</p>
          </div>
        </div>
      </div>

      <!-- Confirmation section before canceling -->
      <div class="confirmation-section" v-if="!canceled">
        <!-- Reason for cancellation input -->
        <label for="reason">Cancellation Reason (optional):</label>
        <textarea v-model="cancellationReason" id="reason" placeholder="Explain why you're canceling the booking..."></textarea>

        <!-- Checkbox to confirm understanding -->
        <label class="confirm-checkbox">
          <input type="checkbox" v-model="understood" />
          I understand that this action cannot be undone
        </label>

        <!-- Action buttons -->
        <div class="button-group">
          <button class="cancel-button" @click="goBack">Cancel</button>
          <button
            class="cancel-button"
            :disabled="!understood"
            @click="confirmCancel"
          >
            Cancel Booking
          </button>
        </div>
      </div>

      <!-- Success message after cancellation -->
      <div v-else class="success-message">
        <p>Booking has been successfully canceled</p>
        <button class="return-button" @click="returnToBookings">
          Return to My Bookings
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter, useRoute } from "vue-router";

export default {
  setup() {
    const router = useRouter();
    const route = useRoute();

    const understood = ref(false); // Checkbox state for understanding the consequences
    const canceled = ref(false); // State to track if the booking has been canceled
    const cancellationReason = ref(""); // State for cancellation reason
    const error = ref(null); // To display any error messages
    const bookingDetails = ref(null); // Store the booking details

    const token = localStorage.getItem("authToken");
    const bookingId = route.params.bookingId; // Access bookingId from the route params
    console.log("Booking ID = " + bookingId);

    // Function to confirm the cancellation
    const confirmCancel = async () => {
      try {
        const response = await axios.post("http://localhost:3000/api/cancel-booking",
          {
            bookingId: bookingId, // Use the correct bookingId here
            cancellationReason: cancellationReason.value
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            }
          }
        );
        canceled.value = true; // Update state to show success message
      } catch (err) {
        error.value = "Failed to cancel booking. Please try again.";
        console.error("Error:", err);
      }
    };

    // Function to navigate back to the bookings overview page
    const goBack = () => {
      router.push("/booking/overview");
    };

    // Function to return to the user's bookings page
    const returnToBookings = () => {
      router.push("/my-bookings");
    };

    return {
      understood,
      canceled,
      cancellationReason,
      error,
      bookingDetails,
      confirmCancel,
      goBack,
      returnToBookings,
    };
  },
};

</script>

<style scoped>
/* Container for the cancel booking page */
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

/* Reason textarea */
textarea {
  width: 100%;
  height: 80px;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

/* Checkbox styling */
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

.cancel-button,
.return-button {
  padding: 10px 25px;
  border-radius: 6px;
  font-size: 1em;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.cancel-button {
  background-color: #dc3545;
  color: white;
}

.cancel-button:disabled {
  background-color: #dc354580;
  cursor: not-allowed;
}

.cancel-button:not(:disabled):hover {
  background-color: #c82333;
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
