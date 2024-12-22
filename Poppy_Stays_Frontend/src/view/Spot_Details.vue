<template>
  <div v-if="spot" class="spot-detail">
    <!-- Image Gallery -->
    <div class="image-gallery">
      <!-- Left Arrow -->
      <button class="arrow left" @click="prevImage">&#10094;</button>
      
      <img :src="currentImage" :alt="spot.name" class="main-image" />
      
      <!-- Right Arrow -->
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
        <h1>{{ spot.name }}</h1>
        
        <!-- Category -->
        <p><strong><u>Category:</u></strong> {{ spot.categoryName }}</p>
        
        <!-- Location -->
        <p>
          <strong><u>Location:</u></strong>
          {{ spot.streetNumber }} {{ spot.location.street }}, 
          {{ spot.location.city }}, {{ spot.location.country }}
        </p>
        
        <!-- Owner -->
        <p><strong><u>Owner:</u></strong> Hosted by {{ spot.ownerName }}</p>
        
        <!-- Description -->
        <p><strong><u>Description:</u></strong> {{ spot.description }}</p>
        
        <!-- Max Guests -->
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

      <!-- Booking Section -->
      <div class="booking-card">
        <div class="price">
          <strong><u>Price:</u></strong> ${{ spot.pricePerNight }}
          <span class="per-night"><strong><u>Per Night</u></strong></span>
        </div>

        <div class="dates">
          <input type="date" v-model="startDate" :min="today" />
          <input type="date" v-model="endDate" :min="startDate || today" />
        </div>

        <div class="total" v-if="startDate && endDate">
          <div class="breakdown">
            <span><strong><u>Price Breakdown:</u></strong> ${{ spot.pricePerNight }} × {{ numberOfNights }} nights</span>
            <span><strong><u>Total:</u></strong> ${{ total }}</span>
          </div>
        </div>

        <button class="book-btn" :disabled="!canBook" @click="handleBooking">
          <strong><u>Book Now</u></strong>
        </button>
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
    const startDate = ref(null);
    const endDate = ref(null);

    // Access spotId from route params
    const spotId = computed(() => {
      return parseInt(window.location.pathname.split('/')[2]);
    });

    // Fetch spot details when the component is mounted
    onMounted(async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/spot_details/${spotId.value}`);
        spot.value = response.data.spot;
      } catch (error) {
        console.error('Error fetching spot details:', error);
      }
    });

    const currentImage = computed(() => 
      spot.value?.images[currentImageIndex.value]
    );

    const today = computed(() => 
      new Date().toISOString().split('T')[0]
    );

    const numberOfNights = computed(() => {
      if (!startDate.value || !endDate.value) return 0;
      const start = new Date(startDate.value);
      const end = new Date(endDate.value);
      return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    });

    const total = computed(() => 
      numberOfNights.value * spot.value?.pricePerNight
    );

    const canBook = computed(() => 
      startDate.value && endDate.value
    );

    const handleBooking = () => {
      console.log('Booking:', {
        spotId: spot.value.id,
        startDate: startDate.value,
        endDate: endDate.value,
        total: total.value
      });
    };

    const prevImage = () => {
      if (currentImageIndex.value > 0) {
        currentImageIndex.value--;
      } else {
        currentImageIndex.value = spot.value.images.length - 1; // loop to last image
      }
    };

    const nextImage = () => {
      if (currentImageIndex.value < spot.value.images.length - 1) {
        currentImageIndex.value++;
      } else {
        currentImageIndex.value = 0; // loop to first image
      }
    };

    return {
      spot,
      currentImage,
      currentImageIndex,
      startDate,
      endDate,
      today,
      numberOfNights,
      total,
      canBook,
      handleBooking,
      prevImage,
      nextImage
    };
  }
};
</script>

<style scoped>
/* The style remains the same as in the original code */
.spot-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.image-gallery {
  position: relative;
  border-radius: 1rem;
  overflow: hidden;
  margin-bottom: 2rem;
}

.main-image {
  width: 100%;
  height: 400px;
  object-fit: contain; /* Ensure images are fully visible */
  background-color: #f0f0f0; /* Optional: sets a background color for empty space if the image aspect ratio differs */
}

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

.content-grid {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;
}

.spot-info h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.category, .location, .owner {
  color: #666;
  margin-bottom: 0.5rem;
}

.description {
  margin: 1.5rem 0;
  line-height: 1.6;
}

.amenities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.booking-card {
  background: white;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  position: sticky;
  top: 2rem;
}

.price {
  font-size: 1.5rem;
  font-weight: bold;
}

.per-night {
  font-size: 1rem;
  color: #666;
}

.dates {
  margin: 1.5rem 0;
  display: grid;
  gap: 1rem;
}

.dates input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
}

.book-btn {
  width: 100%;
  padding: 1rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
}

.book-btn:disabled {
  background: #ccc;
}

@media (max-width: 768px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}
</style>
