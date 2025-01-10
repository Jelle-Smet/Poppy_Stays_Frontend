<template>
  <div class="container mt-4">
    <h2 class="text-center mb-4">My Favorite Spots</h2>

    <!-- Section to display a loading message while fetching data -->
    <div v-if="loading" class="loading">Loading your favorite spots...</div>

    <!-- Section to display an error message if data fetching fails -->
    <div v-if="error" class="error">{{ error }}</div>

    <!-- Main container for displaying the spots -->
    <div v-else class="all-spots-container">
      <!-- Grid layout for displaying multiple spots -->
      <div class="spots-grid">
        <!-- Loop through each spot to create a card -->
        <div v-for="spot in spots" :key="spot.id" class="spot-card">
          <!-- Spot Image Carousel -->
          <div class="spot-image">
            <div class="carousel">
              <!-- Button to navigate to the previous image -->
              <button
                class="carousel-control prev"
                @click="prevImage(spot.id)"
              >
                &#9664;
              </button>
              <!-- Display the current image of the spot -->
              <img
                :src="spot.images[spot.currentImageIndex] || defaultImage"
                :alt="spot.name"
              />
              <!-- Button to navigate to the next image -->
              <button
                class="carousel-control next"
                @click="nextImage(spot.id)"
              >
                &#9654;
              </button>
            </div>
          </div>
          <!-- Spot Details Section -->
          <div class="spot-details">
            <!-- Spot name -->
            <h3>{{ spot.name }}</h3>
            <!-- Spot location (city and country) -->
            <p class="spot-location">
              {{ spot.location.city }}, {{ spot.location.country }}
            </p>
            <!-- Spot price per night -->
            <p class="spot-price">${{ spot.pricePerNight }} / night</p>
            <!-- Button to navigate to the spot's detailed view -->
            <div class="button-group">
              <router-link :to="{ name: 'spotDetails', params: { id: spot.id }}" class="details-button">
                View Details
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'; // Importing Vue features
import axios from 'axios'; // Importing axios for API calls

export default {
  setup() {
    const spots = ref([]); // Reactive variable to store the list of spots
    const loading = ref(false); // Reactive variable for the loading state
    const error = ref(null); // Reactive variable for error messages
    const defaultImage = "https://via.placeholder.com/300?text=No+Image+Available"; // Placeholder image URL

    // Function to fetch favorite spots
    const fetchFavoriteSpots = async () => {
      loading.value = true; // Start loading
      try {
        // Make an API call to fetch favorite spots based on the user's ID
        const token = localStorage.getItem("authToken"); // Replace with the actual User_ID
        const response = await axios.post('http://localhost:3000/api/spots-favorites', {}, {
            headers: {
                'Authorization': `Bearer ${token}` // Send the token as Bearer token
            }
        });
        // Map through the response data and add an index for image carousel
        spots.value = (response.data.spots || []).map((spot) => ({
          ...spot,
          currentImageIndex: 0, // Default to the first image
        }));
      } catch (err) {
        console.error('Error fetching favorite spots:', err); // Log error
        error.value = "Failed to load your favorite spots. Please try again later."; // Show error message
      } finally {
        loading.value = false; // Stop loading
      }
    };

    // Function to navigate to the previous image in the carousel
    const prevImage = (spotId) => {
      const spot = spots.value.find((s) => s.id === spotId); // Find the spot by ID
      if (spot) {
        // Calculate the previous image index
        spot.currentImageIndex =
          (spot.currentImageIndex - 1 + spot.images.length) % spot.images.length;
      }
    };

    // Function to navigate to the next image in the carousel
    const nextImage = (spotId) => {
      const spot = spots.value.find((s) => s.id === spotId); // Find the spot by ID
      if (spot) {
        // Calculate the next image index
        spot.currentImageIndex =
          (spot.currentImageIndex + 1) % spot.images.length;
      }
    };

    // Fetch favorite spots when the component is mounted
    onMounted(fetchFavoriteSpots);

    return {
      spots, // List of spots to display
      loading, // Loading indicator
      error, // Error messages
      defaultImage, // Default image for spots without images
      prevImage, // Function to navigate to the previous image
      nextImage, // Function to navigate to the next image
    };
  },
};
</script>

<style scoped>
/* Container for all spots */
.all-spots-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* Loading and error messages */
.loading,
.error {
  text-align: center;
  font-size: 1.2em;
  color: #555;
  padding: 20px;
}

/* Grid layout for spots */
.spots-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

/* Individual spot card styling */
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

/* Carousel styling */
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

/* Spot details */
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

/* Button styling */
.button-group {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 15px;
}

.details-button {
  padding: 8px 20px;
  border-radius: 5px;
  font-size: 1em;
  cursor: pointer;
  transition: background-color 0.3s ease;
  text-decoration: none;
  background: #007bff;
  color: #fff;
}

.details-button:hover {
  background: #0056b3;
}
</style>
