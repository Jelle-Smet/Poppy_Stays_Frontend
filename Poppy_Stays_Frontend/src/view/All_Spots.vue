<template>
  <div class="all-spots-container">
    <h2>Available Spots</h2>
    <div v-if="loading" class="loading">Loading spots...</div>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-else class="spots-grid">
      <div v-for="spot in spots" :key="spot.id" class="spot-card">
        <!-- Spot Image Carousel -->
        <div class="spot-image">
          <div class="carousel">
            <button 
              class="carousel-control prev" 
              @click="prevImage(spot.id)"
            >
              &#9664; <!-- Left Arrow -->
            </button>
            <img :src="spot.images[spot.currentImageIndex] || defaultImage" :alt="spot.name" />
            <button 
              class="carousel-control next" 
              @click="nextImage(spot.id)"
            >
              &#9654; <!-- Right Arrow -->
            </button>
          </div>
        </div>
        <!-- Spot Details -->
        <div class="spot-details">
          <h3>{{ spot.name }}</h3>
          <p class="spot-category">{{ spot.category }}</p>
          <p class="spot-location">
            {{ spot.location.city }}, {{ spot.location.country }}
          </p>
          <p class="spot-price">
            ${{ spot.pricePerNight }} / night
          </p>
          <router-link :to="`/spot/${spot.id}`" class="view-details">
            View Details
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  setup() {
    const spots = ref([]); // Stores all spots and their data
    const loading = ref(true); // Indicates if data is still loading
    const error = ref(null); // Stores error messages, if any
    const defaultImage = "https://via.placeholder.com/300?text=No+Image+Available";

    // Function to go to the previous image in the carousel
    const prevImage = (spotId) => {
      const spot = spots.value.find((s) => s.id === spotId);
      if (spot) {
        spot.currentImageIndex =
          (spot.currentImageIndex - 1 + spot.images.length) % spot.images.length;
      }
    };

    // Function to go to the next image in the carousel
    const nextImage = (spotId) => {
      const spot = spots.value.find((s) => s.id === spotId);
      if (spot) {
        spot.currentImageIndex = (spot.currentImageIndex + 1) % spot.images.length;
      }
    };

    // Fetch data from the API when the component mounts
    onMounted(async () => {
      try {
        const response = await fetch("http://localhost:3000/api/spots");
        if (!response.ok) {
          throw new Error("Failed to fetch spots");
        }

        const data = await response.json();

        // Initialize currentImageIndex for each spot
        spots.value = (data.spots || []).map((spot) => ({
          ...spot,
          currentImageIndex: 0, // Start with the first image
        }));
      } catch (err) {
        console.error("Error fetching spots:", err);
        error.value = "Failed to load spots. Please try again later.";
      } finally {
        loading.value = false;
      }
    });

    return { spots, loading, error, defaultImage, prevImage, nextImage };
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

/* Carousel Container */
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

/* Carousel Controls */
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

.spot-category,
.spot-location,
.spot-price {
  margin: 5px 0;
  font-size: 1em;
  color: #555;
}

.view-details {
  display: inline-block;
  margin-top: 10px;
  padding: 10px 20px;
  background: #007bff;
  color: #fff;
  text-decoration: none;
  border-radius: 5px;
}

.view-details:hover {
  background: #0056b3;
}
</style>
