<template>
  <div class="container mt-4">
    <h2 class="text-center mb-4">Upcoming Bookings</h2>

    <div v-if="loading" class="text-center">
      Loading bookings...
    </div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <div v-else>
      <!-- Pending Bookings Section -->
      <div class="bookings-section">
        <h3>Pending Bookings</h3>
        <div v-if="pendingBookings.length === 0" class="warning-card">
          No pending bookings found.
        </div>
        <div v-else class="bookings-grid">
          <div v-for="booking in pendingBookings" :key="booking.bookingId" class="booking-card">
            <div class="booking-details">
              <h4>{{ booking.spot.spotName }}</h4>
              <p>Check-in: {{ formatDate(booking.checkInDate) }}</p>
              <p>Check-out: {{ formatDate(booking.checkOutDate) }}</p>
              <p>Total Price: ${{ booking.bookingTotal }}</p>
              <p>Booking Status: {{ booking.bookingStatus }}</p>
              <p>Payment Status: {{ booking.paymentStatus }}</p>
              <p>Payment Method: {{ booking.paymentMethod }}</p>
              <div v-if="booking.promotion.name" class="promotion-details">
                <p>Promotion: {{ booking.promotion.name }}</p>
                <p>Discount: {{ booking.promotion.amount }}</p>
              </div>
              <!-- Accept Button for Pending Bookings -->
              <button v-if="booking.bookingStatus === 'Pending'" @click="acceptBooking(booking.bookingId, booking.spot.spotName)" class="btn btn-success">
                Accept Booking
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Confirmed Bookings Section -->
      <div class="bookings-section">
        <h3>Confirmed Bookings</h3>
        <div v-if="confirmedBookings.length === 0" class="warning-card">
          No confirmed bookings found.
        </div>
        <div v-else class="bookings-grid">
          <div v-for="booking in confirmedBookings" :key="booking.bookingId" class="booking-card">
            <div class="booking-details">
              <h4>{{ booking.spot.spotName }}</h4>
              <p>Check-in: {{ formatDate(booking.checkInDate) }}</p>
              <p>Check-out: {{ formatDate(booking.checkOutDate) }}</p>
              <p>Total Price: ${{ booking.bookingTotal }}</p>
              <p>Booking Status: {{ booking.bookingStatus }}</p>
              <p>Payment Status: {{ booking.paymentStatus }}</p>
              <p>Payment Method: {{ booking.paymentMethod }}</p>
              <div v-if="booking.promotion.name" class="promotion-details">
                <p>Promotion: {{ booking.promotion.name }}</p>
                <p>Discount: {{ booking.promotion.amount }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

export default {
  name: 'UpcomingBookings',
  setup() {
    const router = useRouter();
    const route = useRoute();
    const spotId = ref(Number(route.params.spotId));  // Make spotId reactive

    const upcomingBookings = ref([]);  // All bookings
    const pendingBookings = ref([]);  // Filtered pending bookings
    const confirmedBookings = ref([]);  // Filtered confirmed bookings
    const loading = ref(true);
    const error = ref(null);

    // Fetch bookings whenever spotId changes
    const fetchBookings = async () => {
      try {
        loading.value = true;
        error.value = null;

        const token = localStorage.getItem('authToken');
        if (!token) {
          error.value = 'Authentication required. Please login.';
          router.push('/sign-up-login');
          return;
        }

        console.log("Current Spot ID:", spotId.value); // Check if the spotId is correctly passed
        if (!spotId.value || isNaN(spotId.value)) {
          error.value = 'Invalid Spot ID';
          return;
        }

        const response = await fetch('http://localhost:3000/api/Owner_Bookings', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ spotId: spotId.value }), // Ensure the spotId is correctly passed
        });

        // Log raw response for debugging
        const rawText = await response.text();
        console.log("Raw Response:", rawText);

        // Check if the response is JSON
        try {
          const data = JSON.parse(rawText);
          if (data.upcomingBookings) {
            pendingBookings.value = data.upcomingBookings.filter(booking => booking.bookingStatus === 'Pending');
            confirmedBookings.value = data.upcomingBookings.filter(booking => booking.bookingStatus !== 'Pending');
          }
        } catch (jsonError) {
          error.value = 'Failed to parse response as JSON: ' + jsonError.message;
          console.error('Error parsing JSON:', jsonError);
        }
      } catch (err) {
        console.error('Error fetching bookings:', err);
        if (err.message === 'Unauthorized' || err.response?.status === 401) {
          error.value = 'Session expired. Please login again.';
          router.push('/login');
        } else {
          error.value = err.message || 'Failed to load bookings. Please try again later.';
        }
      } finally {
        loading.value = false;
      }
    };

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    };

    // Accept booking function (API call to update booking status)

    const acceptBooking = async (bookingId, spotName) => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          error.value = 'Authentication required. Please login.';
          router.push('/sign-up-login');
          return;
        }

        // Send spotName in the request body along with the bookingId
        const response = await fetch(`http://localhost:3000/api/booking/${bookingId}/status`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            spotName: spotName,  // Pass spotName to the API
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error updating booking status');
        }

        const data = await response.json();
        console.log('Booking status updated:', data.message);

        // Optionally, update the local state to reflect the changes
        const updatedBooking = pendingBookings.value.find(booking => booking.bookingId === bookingId);
        if (updatedBooking) {
          updatedBooking.bookingStatus = 'Confirmed'; // Update the status to 'Confirmed'
        }

        // Reload the bookings after the update
        fetchBookings();
      } catch (err) {
        console.error('Error accepting booking:', err);
        error.value = err.message || 'Failed to accept booking. Please try again later.';
      }
    };

    // Watch for changes in spotId and fetch new data
    watch(() => route.params.spotId, (newSpotId) => {
      spotId.value = Number(newSpotId); // Update the spotId
      fetchBookings(); // Fetch new bookings
    });

    onMounted(fetchBookings);

    return {
      pendingBookings,
      confirmedBookings,
      loading,
      error,
      formatDate,
      acceptBooking
    };
  }
};
</script>

<style scoped>
.container {
  background-color: #f8f9fa;
  min-height: 100vh;
  color: black;
  border-radius: 12px;
  padding: 20px;
}

.bookings-section {
  margin-bottom: 40px;
}

.bookings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.booking-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.booking-details {
  h4 {
    margin-bottom: 15px;
    color: #333;
  }

  p {
    margin: 8px 0;
    color: #666;
  }
}

.promotion-details {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #eee;
}

.warning-card {
  background: white;
  border-radius: 12px;
  padding: 30px;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  color: black;
  margin: 20px auto;
  text-align: center;
}

.cancelled-label {
  padding: 5px 15px;
  background-color: #dc3545;
  color: white;
  font-weight: bold;
  border-radius: 5px;
  display: inline-block;
  margin-top: 10px;
}

.error {
  color: #dc3545;
  text-align: center;
  margin: 20px 0;
  padding: 15px;
  background: #ffe6e6;
  border-radius: 8px;
}

.loading {
  text-align: center;
  font-size: 1.2em;
  color: #666;
  margin: 40px 0;
}

.btn-success {
  background-color: #28a745;
  border-color: #28a745;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.btn-success:hover {
  background-color: #218838;
  border-color: #1e7e34;
}
</style>
