<template>
  <div class="container mt-4">
    <h2 class="text-center mb-4">My Spots</h2>

    <!-- Spots Display Section -->
    <div v-if="loading" class="loading">Loading your spots...</div>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-else class="all-spots-container">
      <div class="spots-grid">
        <div v-for="spot in spots" :key="spot.id" class="spot-card">
          <!-- Spot Image Carousel -->
          <div class="spot-image">
            <div class="carousel">
              <button
                class="carousel-control prev"
                @click="prevImage(spot.id)"
              >
                &#9664;
              </button>
              <img
                :src="spot.images[spot.currentImageIndex] || defaultImage"
                :alt="spot.name"
              />
              <button
                class="carousel-control next"
                @click="nextImage(spot.id)"
              >
                &#9654;
              </button>
            </div>
          </div>
          <!-- Spot Details -->
          <div class="spot-details">
            <h3>{{ spot.name }}</h3>
            <p class="spot-location">
              {{ spot.location.city }}, {{ spot.location.country }}
            </p>
            <p class="spot-price">${{ spot.pricePerNight }} / night</p>
            <div class="button-group">
              <a class="update-button" @click="navigateToPastBookings(spot.id)">Past Bookings</a>
            </div>
            <div class="button-group">
              <a class="update-button" @click="navigateToUpcomingBookings(spot.id)">Upcoming Bookings</a>
            </div>


          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

export default {
  setup() {
    const router = useRouter();
    const spots = ref([]);
    const loading = ref(false);
    const error = ref(null);
    const defaultImage = "https://via.placeholder.com/300?text=No+Image+Available";
    const ownerId = localStorage.getItem('Owner_ID');

    const fetchOwnerSpots = async () => {
      loading.value = true;
      try {
        const response = await axios.post('http://localhost:3000/api/spots-owner', {
          ownerIds: [ownerId],
        });

        spots.value = (response.data.spots || []).map((spot) => ({
          ...spot,
          currentImageIndex: 0,
        }));
      } catch (err) {
        console.error('Error fetching spots:', err);
        error.value = "Failed to load your spots. Please try again later.";
      } finally {
        loading.value = false;
      }
    };

    const navigateToPastBookings = (spotId) => {
      router.push({
        name: 'PastAndCancelledOwnerBookings',
        params: { spotId: spotId }
      });
    };

    const navigateToUpcomingBookings = (spotId)=>{
      router.push({
        name: 'UpcomingOwnerBookings',
        params: { spotId: spotId }

      });
    };

    const prevImage = (spotId) => {
      const spot = spots.value.find((s) => s.id === spotId);
      if (spot) {
        spot.currentImageIndex =
          (spot.currentImageIndex - 1 + spot.images.length) % spot.images.length;
      }
    };

    const nextImage = (spotId) => {
      const spot = spots.value.find((s) => s.id === spotId);
      if (spot) {
        spot.currentImageIndex =
          (spot.currentImageIndex + 1) % spot.images.length;
      }
    };

    onMounted(fetchOwnerSpots);

    return {
      spots,
      loading,
      error,
      defaultImage,
      prevImage,
      nextImage,
      navigateToPastBookings,
      navigateToUpcomingBookings
    };
  },
};
</script>

<style scoped>
.all-spots-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.loading,
.error {
  text-align: center;
  font-size: 1.2em;
  color: #555;
  padding: 20px;
}

.spots-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.spot-card {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.spot-card:hover {
  transform: translateY(-5px);
}

.carousel {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.carousel img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.carousel-control {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  border: none;
  padding: 10px;
  font-size: 1.5em;
  cursor: pointer;
  z-index: 1;
}

.carousel-control.prev {
  left: 10px;
}

.carousel-control.next {
  right: 10px;
}

.carousel-control:hover {
  background: rgba(0, 0, 0, 0.7);
}

.spot-details {
  padding: 15px;
  text-align: center;
}

.spot-details h3 {
  margin: 0 0 10px;
  font-size: 1.5em;
  color: #333;
}

.spot-location,
.spot-price {
  margin: 5px 0;
  font-size: 1em;
  color: #555;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 15px;
}

.update-button {
  padding: 8px 20px;
  border-radius: 5px;
  font-size: 1em;
  cursor: pointer;
  transition: background-color 0.3s ease;
  text-decoration: none;
  background: #007bff;
  color: #fff;
}

.update-button:hover {
  background: #0056b3;
}
</style>
