<template>
  <div v-if="spot" class="spot-detail">
    <!-- Image Gallery -->
    <div class="image-gallery">
      <button class="arrow left" @click="prevImage">&#10094;</button>
      <img :src="currentImage" :alt="spot.name" class="main-image" />
      <button class="arrow right" @click="nextImage">&#10095;</button>

      <div class="image-nav" v-if="spot.images?.length > 1">
        <button v-for="(_, index) in spot.images" :key="index"
          :class="['nav-dot', { active: index === currentImageIndex }]"
          @click="currentImageIndex = index">
        </button>
      </div>
    </div>

    <div class="content-grid">
      <!-- Main Info -->
      <div class="spot-info">
        <div class="header-row">
          <h1>{{ spot.name }}</h1>
        </div>
        <p><strong><u>Category:</u></strong> {{ spot.categoryName }}</p>
        <p><strong><u>Location:</u></strong>
          {{ spot.streetNumber }} {{ spot.location.street }},
          {{ spot.location.city }}, {{ spot.location.country }}
        </p>
        <p><strong><u>Owner:</u></strong> Hosted by {{ spot.ownerName }}</p>
        <p><strong><u>Description:</u></strong> {{ spot.description }}</p>
        <p><strong><u>Maximum Guests:</u></strong> {{ spot.maxGuests }}</p>

        <!-- Amenities -->
        <div class="amenities">
          <h2><strong><u>Amenities:</u></strong></h2>
          <div class="amenities-grid">
            <div v-for="amenity in spot.amenities" :key="amenity" class="amenity">
              {{ amenity }}
            </div>
          </div>
        </div>

        <!-- Map Location -->
        <div class="map-section">
          <h2><strong><u>Location Coordinates:</u></strong></h2>
          <div class="coordinates">
            <strong><u>Latitude:</u></strong> {{ spot.latitude }}<br>
            <strong><u>Longitude:</u></strong> {{ spot.longitude }}
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="loading">Loading...</div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

export default {
  name: 'SpotDetail',
  setup() {
    const spot = ref(null);
    const currentImageIndex = ref(0);

    onMounted(async () => {
      try {
        const spotId = parseInt(window.location.pathname.split('/')[2]);
        const response = await axios.get(`/api/spot_details/${spotId}`);
        spot.value = response.data.spot;
      } catch (error) {
        console.error('Error loading spot details:', error);
      }
    });

    const currentImage = computed(() => spot.value?.images[currentImageIndex.value]);

    const prevImage = () => {
      if (currentImageIndex.value > 0) {
        currentImageIndex.value--;
      } else {
        currentImageIndex.value = spot.value.images.length - 1;
      }
    };

    const nextImage = () => {
      if (currentImageIndex.value < spot.value.images.length - 1) {
        currentImageIndex.value++;
      } else {
        currentImageIndex.value = 0;
      }
    };

    return {
      spot,
      currentImage,
      currentImageIndex,
      prevImage,
      nextImage
    };
  },
};
</script>

<style scoped>
/* General Layout and Container Styles */
.spot-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;
}

/* Image Gallery Styles */
.image-gallery {
  position: relative;
  border-radius: 1rem;
  overflow: hidden;
  margin-bottom: 2rem;
}

.main-image {
  width: 100%;
  height: 400px;
  object-fit: contain;
  background-color: #f0f0f0;
}

/* Image Navigation Arrow Styles */
.arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 1rem;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 10;
}

.left {
  left: 10px;
}

.right {
  right: 10px;
}

/* Image Navigation Dots */
.image-nav {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
}

.nav-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  border: none;
  cursor: pointer;
}

.nav-dot.active {
  background: white;
}

/* Main Spot Information Container */
.spot-info {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

/* Spot Title Styles */
.spot-info h1 {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #000;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 1rem;
}

/* Amenities Grid */
.amenities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
}

.amenity {
  background-color: #f0f0f0;
  padding: 1rem;
  border-radius: 10px;
  text-align: center;
}

/* Map Section */
.map-section {
  margin-top: 2rem;
}

.coordinates {
  background-color: #f0f0f0;
  padding: 1rem;
  border-radius: 10px;
}
</style>
