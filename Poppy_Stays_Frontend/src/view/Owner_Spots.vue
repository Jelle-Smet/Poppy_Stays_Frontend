<template>
  <div class="container mt-4">
    <!-- Owner Selection Section -->
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="owner-wrapper">
          <!-- Search input -->
          <div class="input-group">
            <input
              type="text"
              class="form-control search-input"
              placeholder="Search owners..."
              value=""
              @click="toggleDropdown"
              readonly
            />
          </div>

          <!-- Owner Dropdown -->
          <div v-if="showOwners" class="owner-dropdown">
            <div class="row">
              <div
                class="col-6 col-md-4 col-lg-3"
                v-for="owner in owners"
                :key="owner.Owner_ID"
              >
                <div
                  class="owner-item card"
                  :class="{'selected': isSelected(owner)}"
                  @click="selectOwner(owner)"
                >
                  <div class="card-body">
                    <p class="owner-name">{{ owner.Owner_Name }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Display selected owners -->
    <div v-if="selectedOwners.length > 0" class="mt-3 selected-owner-wrapper">
      <div class="selected-owner-title-box">
        <h5>Selected Owners:</h5>
      </div>
      <div class="selected-owner-list card p-3">
        <ul>
          <li v-for="owner in selectedOwners" :key="owner.Owner_ID">
            <span class="selected-owner-name">{{ owner.Owner_Name }}</span>
          </li>
        </ul>
      </div>
      <button
        v-if="selectedOwners.length > 0"
        class="btn browse-btn mt-3"
        @click="browseSpots"
      >
        Browse Spots
      </button>
    </div>

    <!-- Spots Display Section -->
    <div v-if="loading" class="loading">Loading spots...</div>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-else class="all-spots-container">
      <h2>Available Spots</h2>
      <div class="spots-grid">
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
            <p class="spot-owner">{{ spot.owner }}</p>
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
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';

export default {
  setup() {
    const owners = ref([]); // Stores all owners
    const showOwners = ref(false); // Whether to display owners dropdown
    const selectedOwners = ref([]); // Array to store selected owners
    const spots = ref([]); // Stores all spots and their data
    const loading = ref(false); // Indicates if spots data is loading
    const error = ref(null); // Stores error messages, if any
    const defaultImage = "https://via.placeholder.com/300?text=No+Image+Available";

    // Function to fetch owners
    const fetchOwners = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/owners'); // Adjust URL if needed
        owners.value = response.data.owners;
      } catch (err) {
        console.error('Error fetching owners:', err);
      }
    };

    // Function to toggle owner dropdown visibility
    const toggleDropdown = () => {
      showOwners.value = !showOwners.value;
    };

    // Function to check if an owner is selected
    const isSelected = (owner) => {
      return selectedOwners.value.some(o => o.Owner_ID === owner.Owner_ID);
    };

    // Function to select or deselect an owner
    const selectOwner = (owner) => {
      const index = selectedOwners.value.findIndex(o => o.Owner_ID === owner.Owner_ID);
      if (index === -1) {
        selectedOwners.value.push(owner);
      } else {
        selectedOwners.value.splice(index, 1);
      }
      showOwners.value = false; // Close dropdown
    };

    // Function to go to the previous image in the carousel
    const prevImage = (spotId) => {
      const spot = spots.value.find((s) => s.id === spotId);
      if (spot) {
        spot.currentImageIndex = (spot.currentImageIndex - 1 + spot.images.length) % spot.images.length;
      }
    };

    // Function to go to the next image in the carousel
    const nextImage = (spotId) => {
      const spot = spots.value.find((s) => s.id === spotId);
      if (spot) {
        spot.currentImageIndex = (spot.currentImageIndex + 1) % spot.images.length;
      }
    };

    // Function to fetch spots based on selected owners
    const browseSpots = async () => {
      if (selectedOwners.value.length === 0) {
        alert('Please select at least one owner.');
        return;
      }

      loading.value = true;
      const ownerIds = selectedOwners.value.map(o => o.Owner_ID);

      try {
        const response = await axios.post("http://localhost:3000/api/spots-owner", {
          ownerIds: ownerIds
        });

        // Initialize currentImageIndex for each spot
        spots.value = (response.data.spots || []).map(spot => ({
          ...spot,
          currentImageIndex: 0, // Start with the first image
        }));
      } catch (err) {
        console.error('Error fetching spots:', err);
        error.value = "Failed to load spots. Please try again later.";
      } finally {
        loading.value = false;
      }
    };

    // Fetch owners when the component is created
    onMounted(fetchOwners);

    return {
      owners,
      showOwners,
      selectedOwners,
      spots,
      loading,
      error,
      defaultImage,
      fetchOwners,
      toggleDropdown,
      isSelected,
      selectOwner,
      prevImage,
      nextImage,
      browseSpots
    };
  }
};
</script>

<style scoped>
/* Search input styles */
.search-input {
  border-radius: 25px; /* Rounded edges for a sleek look */
  padding-left: 15px;
  font-size: 1.1rem;
  height: 45px; /* Slightly taller input field */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Soft shadow */
  transition: box-shadow 0.3s ease;
  color: black; /* Set font color to black */
}

.search-input:focus {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); /* Enhanced shadow on focus */
  outline: none; /* Remove the default focus outline */
}

/* Category wrapper */
.owner-wrapper {
  position: relative;
}

/* Category dropdown layout */
.owner-dropdown {
  position: absolute;
  width: 100%;
  max-width: 450px;
  margin-top: 8px;
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* Soft drop shadow */
  max-height: 350px;
  overflow-y: auto;
  background-color: white;
  padding: 10px;
  z-index: 1000;
}

/* Category item card styling */
.owner-item {
  cursor: pointer;
  border-radius: 12px; /* Rounded corners for items */
  margin-bottom: 12px;
  background-color: #f8f9fa; /* Light grey background */
  transition: background-color 0.3s ease, transform 0.3s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.owner-item:hover {
  background-color: #e9ecef; /* Light hover effect */
  transform: translateY(-2px); /* Subtle lift effect */
}

/* Style for selected categories */
.owner-item.selected {
  background-color: #d1ecf1; /* Light blue background for selected categories */
  box-shadow: 0 4px 8px rgba(0, 123, 255, 0.3); /* Blue shadow for selected items */
}

/* Category item card body */
.owner-item .card-body {
  padding: 12px;
}

/* Category name style */
.owner-name {
  font-size: 1.1rem;
  font-weight: normal; /* Removed bold */
  color: black; /* Set font color to black */
}

/* Selected category card style */
.selected-owner .card {
  background-color: #f4f7f9;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Wrapper for selected categories section */
.selected-owner-wrapper {
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Soft shadow */
  background-color: white;
  padding: 15px;
}

/* Title box for selected categories */
.selected-owner-title-box {
  background-color: #f4f7f9; /* Light background color */
  padding: 8px 15px;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Light shadow */
}

/* Title style for selected categories */
.selected-owner-title-box h5 {
  font-size: 1.25rem;
  font-weight: 600;
  color: black;
  margin: 0;
  text-decoration: underline; /* Underline the title */
}

/* Selected categories list styling */
.selected-owner-list {
  padding: 10px 0;
  background-color: #f4f7f9;
  border-radius: 12px;
}

/* Style for selected category names in the list */
.selected-owner-name {
  font-size: 1.1rem;
  color: black; /* Set font color to black */
  font-weight: normal; /* Removed bold */
  margin: 5px 0;
}

/* Browse button styles */
.browse-btn {
  background-color: #007bff; /* Blue background */
  color: white; /* White text */
  border: none; /* No border */
  padding: 12px 25px; /* Padding around the text */
  font-size: 1rem; /* Adjust font size */
  border-radius: 25px; /* Rounded button */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Soft shadow */
  transition: background-color 0.3s ease, transform 0.3s ease; /* Smooth transition for background and hover */
}

.browse-btn:hover {
  background-color: #0056b3; /* Darker blue on hover */
  transform: translateY(-2px); /* Subtle lift effect */
}

.browse-btn:focus {
  outline: none; /* Remove default focus outline */
}

.browse-btn:active {
  transform: translateY(2px); /* Slightly press effect when clicked */
}

/* Small screen adjustments */
@media (max-width: 768px) {
  .category-dropdown {
    max-width: 100%; /* Full width on small screens */
  }
  .category-item {
    margin-bottom: 10px;
  }
}

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
