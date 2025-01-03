<template>
  <div class="map-container">
    <!-- Introduction section always shown above the map -->
    <div class="intro">
      <h2>Explore Our Beautiful Camping Spots</h2>
      <p>
        Discover stunning camping locations, with the Poppy Stays new interactive map, perfect for adventure and relaxation.
        Explore various places where you can connect with nature and experience unforgettable moments.
        Find your perfect getaway today!
      </p>
    </div>

    <!-- Loading indicator shown while the map is loading -->
    <div v-if="loading" class="loading">Loading map...</div>

    <!-- Error message shown if there is an issue loading the map -->
    <div v-if="error" class="error">{{ error }}</div>

    <!-- Map container, visible once the map is loaded and there are no errors -->
    <div id="map" v-show="!loading && !error"></div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import mapboxgl from 'mapbox-gl';

const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiZTE3bml4IiwiYSI6ImNtNWdxdG9uaTA4aHYyanNmYmJsdXE3OG8ifQ.6FX0qEqwijxVHlNMnAXowA';  // Insert your Mapbox Access Token here

export default {
  setup() {
    const loading = ref(true);
    const error = ref(null);

    // Initialize map
    const initMap = async () => {
      try {
        // Fetch all spot data from the backend
        const response = await fetch("http://localhost:3000/api/all-spots");
        if (!response.ok) throw new Error("Failed to fetch spots");

        const data = await response.json();

        // Log the entire spots data to check it
        console.log("Spots data:", data);

        // Initialize Mapbox map with the globe projection for a 3D effect
        mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
        const map = new mapboxgl.Map({
          container: 'map', // The ID of the container where the map will be placed
          style: 'mapbox://styles/mapbox/streets-v11', // Map style from Mapbox
          center: [0, 0], // Start at the center of the world
          zoom: 2, // Initial zoom level
          pitch: 60, // Tilt the map for a 3D effect
          antialias: true, // Enable anti-aliasing for smoother rendering
          projection: 'globe', // This makes the map look like a globe
        });

        // Add navigation controls (zoom and rotate buttons)
        map.addControl(new mapboxgl.NavigationControl());

        const markers = [];
        let bounds = new mapboxgl.LngLatBounds(); // to calculate bounds of markers

        // Add each spot's marker to the map
        data.spots.forEach((spot) => {
          console.log(`Spot: ${spot.name}, Latitude: ${spot.latitude}, Longitude: ${spot.longitude}`);

          if (!spot.latitude || !spot.longitude) {
            console.error(`Invalid coordinates for spot: ${spot.name}`);
            return; // Skip this spot if the coordinates are invalid
          }

          const marker = new mapboxgl.Marker()
            .setLngLat([spot.longitude, spot.latitude])
            .addTo(map);

          // Marker popup content with styled, cleaner HTML (without images)
          const popupContent = `
            <div class="popup-content">
              <div class="popup-header">
                <h4 class="popup-title">${spot.name}</h4>
                <p class="popup-category"<strong>Category: </strong>${spot.category}</p>
              </div>
              <div class="popup-details">
                <p><strong>Price per Night:</strong> $${spot.pricePerNight}</p>
                <p><strong>Location:</strong> ${spot.location.city}, ${spot.location.country}</p>
                <p><strong></strong> Book now </p>
              </div>
              <div class="popup-actions">
                <a href="/spot/${spot.id}" class="booking-link" target="_self">View Booking Page</a>
              </div>
            </div>
          `;

          // Create and attach popup to marker
          const popup = new mapboxgl.Popup({ offset: 25 })
            .setHTML(popupContent);
          marker.setPopup(popup);

          // Extend bounds to include each marker's position
          bounds.extend([spot.longitude, spot.latitude]);
        });

        // Adjust the map to fit the bounds of all markers
        map.fitBounds(bounds, { padding: 20 });

        // Resize the map to fit the container properly when it's fully loaded
        map.on('load', () => {
          map.resize();
          loading.value = false; // Set loading to false when map is ready
        });

      } catch (err) {
        console.error("Error initializing map:", err);
        error.value = "Failed to load map. Please try again later.";
      } finally {
        loading.value = false;
      }
    };

    // Call initMap when the component is mounted
    onMounted(() => {
      initMap();
    });

    return { loading, error };
  },
};
</script>

<style scoped>
/* Ensure the body takes up the full viewport */
body, html {
  margin: 0;
  padding: 0;
  height: 100%;
}

/* Map container style */
.map-container {
  width: 100%;
  height: 100vh; /* Full viewport height */
  padding: 20px;
  text-align: center;
  position: relative;
  color: black;
}

/* Introduction section style */
.intro {
  background-color: #567596;  /* Blue background for emphasis */
  color: white;               /* White text */
  padding: 30px 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  margin-bottom: 20px;
}

.intro h2 {
  font-size: 2em;
  margin-bottom: 10px;
}

.intro p {
  font-size: 1.2em;
  line-height: 1.6;
  margin-bottom: 0;
}

/* Style the loading and error messages */
.loading,
.error {
  font-size: 1.2em;
  color: #555;
}

.error {
  height: 600px;
  text-align: center;
  padding: 30px;
  background-color: #f8d7da;
  border: 1px solid #f5c2c7;
  color: #842029;
  border-radius: 10px;
}

/* Map specific styles */
#map {
  width: 100%;
  height: 80%;  /* Map takes up the remaining height after intro text */
  border: 2px solid #ddd;
  border-radius: 10px;
}

/* Styling for the popup content */
.popup-content {
  font-family: Arial, sans-serif;
  color: #000; /* Make text black */
  padding: 15px;
  text-align: left;
  max-width: 300px; /* Ensure the popup doesn't get too wide */
}

.popup-header {
  border-bottom: 2px solid #007bff;
  padding-bottom: 10px;
  margin-bottom: 10px;
}

.popup-title {
  font-size: 1.5em;
  font-weight: bold;
  color: #007bff;
  margin: 0;
}

.popup-category {
  font-size: 1.1em;
  color: #555;
  margin-top: 5px;
}

.popup-details p {
  font-size: 1em;
  margin: 8px 0;
}

.popup-details strong {
  font-weight: bold;
}

/* Style for the booking link */
.popup-actions {
  margin-top: 10px;
  text-align: center;
}

.booking-link {
  display: inline-block;
  padding: 10px 20px;
  background: #28a745;
  color: #fff;
  text-decoration: none;
  border-radius: 5px;
  font-weight: bold;
  margin-top: 10px;
}

.booking-link:hover {
  background: #218838;
  color: white;
}
</style>
