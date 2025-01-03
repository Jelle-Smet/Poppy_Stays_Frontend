<template>
  <div class="all-spots-container">
    <!-- Search Bar -->
    <div class="row justify-content-center mb-4">
      <div class="col-md-6">
        <div class="search-wrapper">
          <div class="input-group">
            <input
              type="text"
              class="form-control search-input"
              placeholder="Search spots by name..."
              v-model="searchQuery"
            />
            <button class="btn btn-primary" @click="fetchSpots">Search</button>
          </div>
        </div>
      </div>
    </div>

    <h2>Available Spots</h2>
    <div v-if="loading" class="loading">Loading spots...</div>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-else class="spots-grid">
      <div v-for="spot in spots" :key="spot.id" class="spot-card">
        <div class="spot-image">
          <div class="carousel">
            <button class="carousel-control prev" @click="prevImage(spot.id)">&#9664;</button>
            <img :src="spot.images[spot.currentImageIndex] || defaultImage" :alt="spot.name" />
            <button class="carousel-control next" @click="nextImage(spot.id)">&#9654;</button>
          </div>
        </div>
        <div class="spot-details">
          <h3>{{ spot.name }}</h3>
          <p class="spot-category">{{ spot.category }}</p>
          <p class="spot-location">{{ spot.location.city }}, {{ spot.location.country }}</p>
          <p class="spot-price">${{ spot.pricePerNight }} / night</p>
          <router-link :to="`/spot/${spot.id}`" class="view-details">View Details</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  setup() {
    const spots = ref([]);
    const loading = ref(false); // Changed to false initially to prevent loading state during mount
    const error = ref(null);
    const defaultImage = "https://via.placeholder.com/300?text=No+Image+Available";
    const searchQuery = ref('');

    const fetchSpots = async () => {
      if (!searchQuery.value.trim()) {
        error.value = "Please enter a search term.";
        return;
      }

      loading.value = true;
      error.value = null;

      try {
        const response = await fetch(`http://localhost:3000/api/search-spots?q=${encodeURIComponent(searchQuery.value)}`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Server error: ${errorText}`);
        }

        const data = await response.json();
        if (data.spots && data.spots.length > 0) {
          spots.value = data.spots.map(spot => ({
            ...spot,
            currentImageIndex: 0,
          }));
        } else {
          error.value = "No spots found for the given search term.";
        }
      } catch (err) {
        console.error("Error fetching spots:", err);
        error.value = "Failed to load spots. Please try again later.";
      } finally {
        loading.value = false;
      }
    };

    const prevImage = (spotId) => {
      const spot = spots.value.find((s) => s.id === spotId);
      if (spot) {
        spot.currentImageIndex = (spot.currentImageIndex - 1 + spot.images.length) % spot.images.length;
      }
    };

    const nextImage = (spotId) => {
      const spot = spots.value.find((s) => s.id === spotId);
      if (spot) {
        spot.currentImageIndex = (spot.currentImageIndex + 1) % spot.images.length;
      }
    };

    return {
      spots,
      loading,
      error,
      defaultImage,
      searchQuery,
      fetchSpots,
      prevImage,
      nextImage
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

/* Search styles */
.search-input {
  border-radius: 25px;
  padding-left: 15px;
  font-size: 1.1rem;
  height: 45px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
  color: black;
}

.search-input:focus {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  outline: none;
}

.btn-primary {
  border-radius: 25px;
  padding: 10px 20px;
  margin-left: 10px;
  background-color: #007bff;
  border: none;
  color: white;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

.btn-primary:hover {
  background-color: #0056b3;
}

@media (max-width: 768px) {
  .spots-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
}
</style>
