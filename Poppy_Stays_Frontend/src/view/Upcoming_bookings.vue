<template>
  <div class="container mx-auto px-6 py-12 max-w-6xl rounded-lg shadow-lg">
    <!-- Header Section -->
    <header class="mb-10">
      <h1 class="text-3xl font-semibold text-gray-800">Upcoming Bookings</h1>
      <p class="mt-2 text-gray-600">View and manage your reservations</p>
    </header>

    <!-- Loading State -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div v-for="n in 4" :key="n" class="animate-pulse bg-white rounded-xl shadow-lg transform hover:scale-105 transition-all">
        <div class="aspect-video bg-gray-200 rounded-t-xl"></div>
        <div class="p-6 space-y-4">
          <div class="h-4 bg-gray-200 rounded w-2/3"></div>
          <div class="space-y-2">
            <div v-for="i in 3" :key="i" class="h-3 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error">
      <i class="bi bi-exclamation-circle text-2xl text-red-500"></i>
      <p>{{ error }}</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="!upcomingBookings.length" class="text-center py-20">
      <i class="bi bi-calendar-x text-5xl text-gray-400"></i>
      <h3 class="mt-4 text-xl font-medium text-gray-800">No Upcoming Bookings</h3>
      <p class="mt-2 text-gray-600">Start planning your next getaway</p>
      <router-link to="/all-spots" class="return-button mt-6 inline-block">
        Explore Available Spots
      </router-link>
    </div>

    <!-- Bookings Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div v-for="booking in upcomingBookings" :key="booking.bookingId" class="group">
        <!-- Booking Card -->
        <div class="warning-card">
          <!-- Image Section -->
          <div class="relative aspect-video overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10"></div>
            <img
              :src="booking.spot.images[0]"
              :alt="booking.spot.spotName"
              class="w-full h-full object-cover object-center"
            />
          </div>

          <!-- Content Section -->
          <div class="p-6">
            <!-- Spot Name -->
            <h3 class="text-xl font-semibold text-gray-800 mb-4">{{ booking.spot.spotName }}</h3>

            <!-- Booking Details -->
            <div class="space-y-3 mb-6">
              <div class="flex items-center gap-3 text-gray-600">
                <i class="bi bi-calendar3 w-5 text-indigo-500"></i>
                <span><strong class="font-bold underline">Check-in:</strong> {{ formatDate(booking.checkInDate) }}</span>
              </div>
              <div class="flex items-center gap-3 text-gray-600">
                <i class="bi bi-calendar3-fill w-5 text-indigo-500"></i>
                <span><strong class="font-bold underline">Check-out:</strong> {{ formatDate(booking.checkOutDate) }}</span>
              </div>
              <div class="flex items-center gap-3 text-gray-600">
                <i class="bi bi-people-fill w-5 text-indigo-500"></i>
                <span><strong class="font-bold underline">Guests:</strong> {{ booking.spot.spotMaxGuests }}</span>
              </div>
              <div class="flex items-center gap-3 text-gray-600">
                <i class="bi bi-clock w-5 text-indigo-500"></i>
                <span><strong class="font-bold underline">Booking Status:</strong> {{ booking.bookingStatus }}</span>
              </div>
              <div class="flex items-center gap-3 text-gray-600">
                <i class="bi bi-credit-card w-5 text-indigo-500"></i>
                <span><strong class="font-bold underline">Payment Status:</strong> {{ booking.paymentStatus }}</span>
              </div>
            </div>

            <!-- Price Section -->
            <div class="flex items-end justify-between pb-4">
              <div>
                <p class="text-2xl font-bold text-gray-900"><strong>Total Cost:</strong> ${{ booking.bookingTotal }}</p>
                <p class="text-sm text-gray-500">{{ booking.promotion?.name }}</p>
              </div>
            </div>

            <!-- Actions -->
            <div class="button-group">
              <!-- View Details Button -->
              <router-link :to="`/spot/${booking.spot.spotId}`" class="view-details-button">
                View Spot Details
              </router-link>

              <!-- Cancel Booking Button -->
              <button v-if="booking.bookingStatus !== 'cancelled'"
                      @click="cancelBooking(booking.bookingId)"
                      class="cancel-button">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'UpcomingBookings',
  setup() {
    const upcomingBookings = ref([])
    const loading = ref(true)
    const error = ref(null)
    const router = useRouter()

    const fetchBookings = async () => {
      try {
        loading.value = true
        error.value = null

        const token = localStorage.getItem('authToken')
        if (!token) {
          error.value = 'Authentication required. Please login.'
          router.push('/login')
          return
        }

        const response = await fetch('http://localhost:3000/api/bookings', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({})
        })

        const data = await response.json()

        if (data.upcomingBookings) {
          upcomingBookings.value = data.upcomingBookings
        } else {
          upcomingBookings.value = []
        }
      } catch (err) {
        if (err.response?.status === 401) {
          error.value = 'Session expired. Please login again.'
          router.push('/login')
        } else if (err.response?.status === 404) {
          upcomingBookings.value = []
        } else {
          error.value = err.response?.data?.message || 'Failed to load bookings. Please try again later.'
        }
        console.error('Error fetching bookings:', err)
      } finally {
        loading.value = false
      }
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    }

    const cancelBooking = async (bookingId) => {
      if (confirm('Are you sure you want to cancel this booking?')) {
        try {
          // Navigate to the Cancel Booking page, passing the bookingIdµ
          router.push({ name: 'cancelBooking', params: { bookingId: bookingId } }); // Use bookingId, not id
        } catch (err) {
          console.error('Error navigating to cancel booking page:', err);
          alert('Failed to navigate to cancel booking page. Please try again later.');
        }
      }
    };

    onMounted(fetchBookings)

    return {
      upcomingBookings,
      loading,
      error,
      formatDate,
      cancelBooking
    }
  }
}
</script>



<style scoped>
img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  border-radius: 8px; /*To add rounded corners */
}

.container {
  background-color: #f8f9fa;
  min-height: 100vh;
  color: black;
  border-radius: 12px; /* Smooth edges */
  text-align: center;
}

.warning-card {
  background: white;
  border-radius: 12px;
  border: 2px solid rgb(75, 73, 73); /* Add a border */
  padding: 30px;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.9);
  color: black;
  margin: 20px; /* Add space between cards */
}


h1 {
  color: #333;
  border-bottom: 2px solid rgb(75,73,73);
}

.button-group {
  display: flex;
  gap: 15px;
  margin-top: 20px;

}

.view-details-button,
.cancel-button {
  padding: 10px 25px;
  border-radius: 6px;
  font-size: 1em;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.view-details-button {
  background-color: #007bff;
  color: white;
}

.view-details-button:hover {
  background-color: #0056b3;
}

.cancel-button {
  background-color: #dc3545;
  color: white;
}

.cancel-button:hover {
  background-color: #c82333;
}

.error {
  color: #dc3545;
  text-align: center;
  margin-top: 10px;
}
</style>
