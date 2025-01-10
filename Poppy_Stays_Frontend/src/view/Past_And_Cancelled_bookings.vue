<template>
  <div class="container mx-auto px-6 py-12 max-w-6xl rounded-lg shadow-lg">
    <!-- Header Section -->
    <header class="mb-10">
      <h1 class="text-3xl font-semibold text-gray-800">Past and Cancelled Bookings</h1>
      <p class="mt-2 text-gray-600">View your completed or cancelled bookings </p>
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
    <div v-else-if="!pastBookings.length && !cancelledBookings.length" class="text-center py-20">
      <i class="bi bi-calendar-x text-5xl text-gray-400"></i>
      <h3 class="mt-4 text-xl font-medium text-gray-800">No Past or Cancelled Bookings</h3>
      <p class="mt-2 text-gray-600">You have no past or canceled bookings</p>
      <router-link to="/all-spots" class="return-button mt-6 inline-block">
        Explore Available Spots
      </router-link>
    </div>

    <!-- Past Bookings -->
    <div v-if="pastBookings.length">
      <h2 class="text-xl font-semibold text-gray-800 mb-6">Past Bookings</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div v-for="booking in pastBookings" :key="booking.bookingId" class="group">
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
              <h3 class="text-xl font-semibold text-gray-800 mb-4">
                {{ booking.spot.spotName }}
              </h3>

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
                  <span><strong class="font-bold underline">Booking Status:</strong>
                    <span class="text-green-500">{{ booking.bookingStatus }}</span>
                  </span>
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

                <!-- View Spot Details Button -->
                <router-link :to="`/spot/${booking.spot.spotId}`" class="view-details-button">
                  View Spot Details
                </router-link>
                <!-- Add Review Button for Non-Cancelled Bookings -->
                <button v-if="booking.bookingStatus !== 'cancelled'"
                        @click="submitReview(booking)"
                        class="add-review-button">
                  Add Review
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Cancelled Bookings -->
    <div v-if="cancelledBookings.length">
      <h2 class="text-xl font-semibold text-gray-800 mb-6">Cancelled Bookings</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div v-for="booking in cancelledBookings" :key="booking.bookingId" class="group">
          <!-- Booking Card -->
          <div class="warning-card bg-red-50">
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
              <h3 class="text-xl font-semibold text-gray-800 mb-4">
                {{ booking.spot.spotName }}
                <span class="cancelled-label">Cancelled</span>
              </h3>

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
                  <span><strong class="font-bold underline">Booking Status:</strong>
                    <span class="text-red-500">{{ booking.bookingStatus }}</span>
                  </span>
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
                <!-- Cancelled Label -->
                <span v-if="booking.bookingStatus === 'cancelled'" class="cancelled-label">Cancelled</span>

                <!-- View Spot Details Button -->
                <router-link :to="`/spot/${booking.spot.spotId}`" class="view-details-button">
                  View Spot Details
                </router-link>
              </div>
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
  name: 'PastAndCancelledBookings',
  setup() {
    const pastBookings = ref([]) // Store past bookings
    const cancelledBookings = ref([]) // Store cancelled bookings
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
          body: JSON.stringify({}) // Make sure the request is properly structured
        })

        const data = await response.json()

        if (data.pastBookings && data.canceledBookings) {
          pastBookings.value = data.pastBookings
          cancelledBookings.value = data.canceledBookings
        } else {
          pastBookings.value = []
          cancelledBookings.value = []
        }
      } catch (err) {
        if (err.response?.status === 401) {
          error.value = 'Session expired. Please login again.'
          router.push('/login')
        } else if (err.response?.status === 404) {
          pastBookings.value = []
          cancelledBookings.value = []
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

    const submitReview = (booking) => {
  // Navigate to the review submission page with both bookingId and spotId
  router.push({
    name: 'SubmitReview',
    params: {
      spotId: booking.spot.spotId
    }
  })
}

    onMounted(fetchBookings)

    return {
      pastBookings,
      cancelledBookings,
      loading,
      error,
      formatDate,
      submitReview
    }
  }
}
</script>

<style scoped>
.cancelled-label {
  padding: 5px 15px;
  background-color: #dc3545;
  color: white;
  font-weight: bold;
  border-radius: 5px;
  margin-left: 10px;
}

img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  border-radius: 8px;
}

.container {
  background-color: #f8f9fa;
  min-height: 100vh;
  color: black;
  border-radius: 12px;
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

h2 {
  color: #333;
  border-bottom: 2px solid rgb(75,73,73);
  border-top: 2px solid rgb(75,73,73);
}

.add-review-button {
  padding: 12px 30px;
  border-radius: 8px;
  font-size: 1.1em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  background: linear-gradient(145deg, #4e73df, #2e59d9); /* Gradient using blue shades */
  color: white;
  border: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Light shadow for depth */
  text-transform: uppercase; /* All caps for a bold appearance */
  letter-spacing: 1px; /* Slight letter spacing for modern appeal */
}

.add-review-button:hover {
  background: linear-gradient(145deg, #2e59d9, #4e73df); /* Reversed gradient on hover */
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.2); /* Slightly more shadow on hover */
  transform: translateY(-2px); /* Slight lift on hover */
}

.add-review-button:active {
  transform: translateY(0); /* Slightly adjust back on click */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Reduced shadow on active */
}


.view-details-button {
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

.button-group {
  display: flex;
  gap: 15px;
  margin-top: 20px;
}

.add-review-button {
  padding: 12px 30px;
  border-radius: 8px;
  font-size: 1.1em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  background: linear-gradient(145deg, #ffbc00, #ffdd5e); /* Gradient for a sleek look */
  color: white;
  border: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Light shadow for depth */
  text-transform: uppercase; /* All caps for a bold appearance */
  letter-spacing: 1px; /* Slight letter spacing for modern appeal */
}

.add-review-button:hover {
  background: linear-gradient(145deg, #ffdd5e, #ffbc00); /* Reversed gradient on hover */
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.2); /* Slightly more shadow on hover */
  transform: translateY(-2px); /* Slight lift on hover */
}

.add-review-button:active {
  transform: translateY(0); /* Slightly adjust back on click */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Reduced shadow on active */
}


.cancelled-label {
  padding: 5px 15px;
  background-color: #dc3545;
  color: white;
  font-weight: bold;
  border-radius: 5px;
}

.error {
  color: #dc3545;
  text-align: center;
  margin-top: 10px;
}
</style>
