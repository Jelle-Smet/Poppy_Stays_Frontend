<template>
  <div class="container mt-4">
    <h2 class="text-center mb-4">Past and Cancelled Bookings</h2>

    <div v-if="loading" class="text-center">
      Loading bookings...
    </div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <div v-else>
      <!-- Past Bookings Section -->
      <div class="bookings-section">
        <h3>Past Bookings</h3>
        <div v-if="pastBookings.length === 0" class="warning-card">
          No past bookings found.
        </div>
        <div v-else class="bookings-grid">
          <div v-for="booking in pastBookings" :key="booking.bookingId" class="booking-card">
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

      <!-- Cancelled Bookings Section -->
      <div class="bookings-section">
        <h3>Cancelled Bookings</h3>
        <div v-if="cancelledBookings.length === 0" class="warning-card">
          No cancelled bookings found.
        </div>
        <div v-else class="bookings-grid">
          <div v-for="booking in cancelledBookings" :key="booking.bookingId" class="booking-card">
            <div class="booking-details">
              <h4>{{ booking.spot.spotName }}</h4>
              <p>Check-in: {{ formatDate(booking.checkInDate) }}</p>
              <p>Check-out: {{ formatDate(booking.checkOutDate) }}</p>
              <p>Total Price: ${{ booking.bookingTotal }}</p>
              <p>Cancelled on: {{ formatDate(booking.cancellationDate) }}</p>
              <span class="cancelled-label">Cancelled</span>
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
  name: 'PastAndCancelledBookings',
  setup() {
    const router = useRouter();
    const route = useRoute();
    const spotId = ref(Number(route.params.spotId));  // Make spotId reactive

    const pastBookings = ref([]);
    const cancelledBookings = ref([]);
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
          router.push('/login');
          return;
        }

        console.log("Current Spot ID:", spotId.value);  // Check if the spotId is correctly passed
        // Validate spotId
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

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch bookings');
        }

        const data = await response.json();

        if (data.pastBookings && data.canceledBookings) {
          pastBookings.value = data.pastBookings.map(booking => ({
            ...booking,
            checkInDate: new Date(booking.checkInDate),
            checkOutDate: new Date(booking.checkOutDate),
            cancellationDate: booking.cancellationDate ? new Date(booking.cancellationDate) : null
          }));

          cancelledBookings.value = data.canceledBookings.map(booking => ({
            ...booking,
            checkInDate: new Date(booking.checkInDate),
            checkOutDate: new Date(booking.checkOutDate),
            cancellationDate: booking.cancellationDate ? new Date(booking.cancellationDate) : null
          }));
        } else {
          // Ensure empty arrays if no data is returned
          pastBookings.value = [];
          cancelledBookings.value = [];
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

    // Watch for changes in spotId and fetch new data
    watch(() => route.params.spotId, (newSpotId) => {
      spotId.value = Number(newSpotId); // Update the spotId
      fetchBookings(); // Fetch new bookings
    });

    onMounted(fetchBookings);

    return {
      pastBookings,
      cancelledBookings,
      loading,
      error,
      formatDate,
      spotId
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
</style>
