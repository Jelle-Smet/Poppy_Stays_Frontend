<template>
  <div class="container mt-4">
    <div class="form-wrapper">
      <h2 class="text-2xl font-bold text-center mb-6 text-primary">Update Your Spot</h2>

      <div v-if="loading" class="loading-spinner">
        <div class="spinner"></div>
        <p>Loading spot details...</p>
      </div>

      <div v-if="error" class="error-message">
        <i class="fas fa-exclamation-circle"></i>
        {{ error }}
      </div>

      <form v-else @submit.prevent="handleSubmit" class="update-form">
        <!-- Basic Information Card -->
        <div class="form-card">
          <div class="card-header">
            <i class="fas fa-info-circle card-icon"></i>
            <h3>Basic Information</h3>
          </div>

          <div class="form-group">
            <label for="spotName">Spot Name*</label>
            <input
              id="spotName"
              v-model="formData.Spot_Name"
              type="text"
              class="form-input"
              required
            />
          </div>

          <div class="form-group">
            <label for="description">Description*</label>
            <textarea
              id="description"
              v-model="formData.Spot_Description"
              class="form-input min-h-[120px]"
              required
            ></textarea>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label for="pricePerNight">Price Per Night (USD)*</label>
              <div class="price-input">
                <span class="currency-symbol">$</span>
                <input
                  id="pricePerNight"
                  v-model="formData.Spot_Price_Per_Night"
                  type="number"
                  step="0.01"
                  class="form-input pl-8"
                  required
                />
              </div>
            </div>

            <div class="form-group">
              <label for="maxGuests">Maximum Guests*</label>
              <div class="guests-input">
                <i class="fas fa-users input-icon"></i>
                <input
                  id="maxGuests"
                  v-model="formData.Spot_Max_Guests"
                  type="number"
                  min="1"
                  class="form-input pl-10"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Categories Card -->
        <div class="form-card">
          <div class="card-header">
            <i class="fas fa-tags card-icon"></i>
            <h3>Category</h3>
          </div>

          <div class="category-grid">
            <div
              v-for="category in categories"
              :key="category.Spot_Category_ID"
              class="category-item"
              :class="{ 'selected': formData.categoryId === category.Spot_Category_ID }"
              @click="selectCategory(category.Spot_Category_ID)"
            >
              <i :class="getCategoryIcon(category.Spot_Category_Name)"></i>
              <span>{{ category.Spot_Category_Name }}</span>
            </div>
          </div>
        </div>

        <!-- Amenities Card -->
        <div class="form-card">
          <div class="card-header">
            <i class="fas fa-concierge-bell card-icon"></i>
            <h3>Amenities (Select up to 6)</h3>
          </div>

          <div class="amenities-grid">
            <div
              v-for="amenity in amenities"
              :key="amenity.Amenity_ID"
              class="amenity-item"
              :class="{
                'selected': formData.amenities.includes(amenity.Amenity_ID),
                'disabled': !formData.amenities.includes(amenity.Amenity_ID) && formData.amenities.length >= 6
              }"
              @click="toggleAmenity(amenity.Amenity_ID)"
            >
              <i :class="getAmenityIcon(amenity.Amenity_Name)"></i>
              <span>{{ amenity.Amenity_Name }}</span>
            </div>
          </div>

          <div class="amenities-counter" :class="{ 'warning': formData.amenities.length >= 6 }">
            {{ formData.amenities.length }}/6 amenities selected
          </div>
        </div>

        <!-- Images Card -->
        <div class="form-card">
          <div class="card-header">
            <i class="fas fa-images card-icon"></i>
            <h3>Images</h3>
          </div>

          <div class="current-images">
            <div
              v-for="(image, index) in formData.images"
              :key="index"
              class="image-container"
            >
              <img :src="image" :alt="'Spot image ' + (index + 1)" />
              <button
                type="button"
                class="delete-image"
                @click="removeImage(index)"
              >
                <i class="fas fa-times"></i>
              </button>
              <div class="image-overlay">Click to remove</div>
            </div>
          </div>

          <div class="form-group">
            <label>Add Image URL</label>
            <div class="url-input-group">
              <input
                v-model="newImageUrl"
                type="url"
                class="form-input"
                placeholder="Enter image URL"
              />
              <button
                type="button"
                class="btn-secondary"
                @click="addImageUrl"
              >
                <i class="fas fa-plus"></i> Add
              </button>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="btn-secondary" @click="goBack">
            <i class="fas fa-arrow-left"></i> Cancel
          </button>
          <button
            type="submit"
            class="btn-primary"
            :disabled="!isFormValid"
          >
            <i class="fas fa-save"></i> Update Spot
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

export default {
  setup() {
    const route = useRoute();
    const router = useRouter();
    const spotId = route.params.id;
    const token = localStorage.getItem("authToken");
    console.log("token = " + token);
    const loading = ref(true);
    const error = ref(null);
    const categories = ref([]);
    const amenities = ref([]);
    const newImageUrl = ref("");

    const formData = ref({
      Spot_Name: "",
      Spot_Description: "",
      Spot_Price_Per_Night: 0,
      Spot_Max_Guests: 1,
      categoryId: null,
      amenities: [],
      images: [],
    });

    const isFormValid = computed(() => {
      return formData.value.Spot_Name &&
        formData.value.Spot_Description &&
        formData.value.Spot_Price_Per_Night > 0 &&
        formData.value.Spot_Max_Guests > 0 &&
        formData.value.categoryId &&
        formData.value.amenities.length > 0 &&
        formData.value.amenities.length <= 6;
    });

    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/categories", {
          headers: { Authorization: `Bearer ${token}` },
        });
        categories.value = response.data.categories;
      } catch (err) {
        console.error("Error fetching categories:", err);
        error.value = "Failed to load categories";
      }
    };

    const fetchAmenities = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/amenities", {
          headers: { Authorization: `Bearer ${token}` },
        });
        amenities.value = response.data.amenities;
      } catch (err) {
        console.error("Error fetching amenities:", err);
        error.value = "Failed to load amenities";
      }
    };

    const fetchSpotDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/spots/${spotId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const spot = response.data;
        formData.value = {
          Spot_Name: spot.name,
          Spot_Description: spot.description,
          Spot_Price_Per_Night: spot.pricePerNight,
          Spot_Max_Guests: spot.maxGuests,
          categoryId: spot.categoryId,
          amenities: spot.amenities,
          images: spot.images,
        };
      } catch (err) {
        console.error("Error fetching spot details:", err);
        error.value = "Failed to load spot details";
      } finally {
        loading.value = false;
      }
    };

    const selectCategory = (categoryId) => {
      formData.value.categoryId = categoryId;
    };

    const toggleAmenity = (amenityId) => {
      const index = formData.value.amenities.indexOf(amenityId);
      if (index === -1) {
        if (formData.value.amenities.length < 6) {
          formData.value.amenities.push(amenityId); // Add Amenity_ID
        }
      } else {
        formData.value.amenities.splice(index, 1); // Remove Amenity_ID
      }
    };


    const getCategoryIcon = (categoryName) => {
      switch (categoryName.toLowerCase()) {
        case "beach":
          return "fas fa-umbrella-beach";
        case "mountain":
          return "fas fa-mountain";
        case "forest":
          return "fas fa-tree";
        default:
          return "fas fa-campground";
      }
    };

    const getAmenityIcon = (amenityName) => {
      switch (amenityName.toLowerCase()) {
        case "wifi":
          return "fas fa-wifi";
        case "kitchen":
          return "fas fa-utensils";
        case "parking":
          return "fas fa-parking";
        default:
          return "fas fa-concierge-bell";
      }
    };

    const addImageUrl = () => {
      if (newImageUrl.value && !formData.value.images.includes(newImageUrl.value)) {
        formData.value.images.push(newImageUrl.value);
        newImageUrl.value = "";
      }
    };

    const removeImage = (index) => {
      formData.value.images.splice(index, 1);
    };

    const handleSubmit = async () => {
    try {
      // Log the data being submitted to the API
      console.log('Submitting spot data:', formData.value);

      // Prepare data to match the backend field names
      const updatedData = {
        name: formData.value.Spot_Name,  // Rename Spot_Name to name
        description: formData.value.Spot_Description,  // Rename Spot_Description to description
        pricePerNight: formData.value.Spot_Price_Per_Night,  // Rename Spot_Price_Per_Night to pricePerNight
        maxGuests: formData.value.Spot_Max_Guests,  // Rename Spot_Max_Guests to maxGuests
        categoryId: formData.value.categoryId,  // Keep categoryId the same
        amenities: formData.value.amenities,  // Keep amenities the same
        imageUrls: formData.value.images,  // Rename images to imageUrls
      };

      // Sending a PUT request to the correct endpoint
      await axios.put(
        `http://localhost:3000/api/update-spot/${spotId}`,  // API endpoint to update spot
        updatedData,  // The updated data (correct field names)
        {
          headers: { Authorization: `Bearer ${token}` },  // Pass JWT token for authentication
        }
      );

      // Redirect to spots page after successful update
      router.push("/spot-overview");
    } catch (err) {
      console.error("Error updating spot:", err);
      error.value = "Failed to update spot";  // Error handling if request fails
    }
  };


  const goBack = () => {
    router.push("/spot-overview");  // Go back to Spot Overview page
  };

    onMounted(() => {
      fetchCategories();
      fetchAmenities();
      fetchSpotDetails();
    });

    return {
      loading,
      error,
      formData,
      categories,
      amenities,
      selectCategory,
      toggleAmenity,
      getCategoryIcon,
      getAmenityIcon,
      addImageUrl,
      removeImage,
      handleSubmit,
      isFormValid,
      newImageUrl,
      goBack,
    };
  },
};
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

.form-wrapper {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px;
  background: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

h2 {
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 30px;
}

.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #4a90e2;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
  padding: 10px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.1rem;
}

.error-message i {
  font-size: 1.4rem;
}

.update-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-card {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.form-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 18px;
  padding-bottom: 10px;
  border-bottom: 2px solid #e6e6e6;
}

.card-icon {
  font-size: 1.8rem;
  margin-right: 15px;
  color: #4a90e2;
}

.card-header h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
}

.form-group {
  margin-bottom: 24px;
}

label {
  display: block;
  font-weight: 600;
  margin-bottom: 10px;
  color: #333;
}

.form-input {
  width: 100%;
  padding: 14px;
  border: 2px solid #d1d1d1;
  border-radius: 10px;
  font-size: 1rem;
  background-color: #f8f8f8;
  transition: all 0.3s ease;
}

.form-input:focus {
  border-color: #4a90e2;
  background-color: #ffffff;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.2);
  outline: none;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.price-input, .guests-input {
  position: relative;
}

.currency-symbol, .input-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
}

.price-input input, .guests-input input {
  padding-left: 35px;
}

.category-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.category-item {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  border: 2px solid #d1d1d1;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: black;
}

.category-item.selected {
  background-color: #4a90e2;
  color: white;
  border-color: #4a90e2;
}

.category-item:hover {
  background-color: #f1f1f1;
  border-color: #4a90e2;
}

.amenities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
}

.amenity-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border: 2px solid #d1d1d1;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: black;
}

.amenity-item.selected {
  background-color: #4a90e2;
  color: white;
  border-color: #4a90e2;
}

.amenity-item.disabled {
  background-color: #e6e6e6;
  cursor: not-allowed;
}

.amenities-counter {
  text-align: center;
  font-size: 1rem;
  margin-top: 10px;
}

.amenities-counter.warning {
  color: #e74c3c;
}

.current-images {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.image-container {
  position: relative;
  width: 120px;
  height: 120px;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.image-container:hover img {
  transform: scale(1.1);
}

.delete-image {
  position: absolute;
  top: 4px;
  right: 4px;
  background-color: rgba(255, 255, 255, 0.7);
  border: none;
  border-radius: 50%;
  padding: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.delete-image:hover {
  background-color: rgba(255, 255, 255, 0.9);
}

.image-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #1d1b1b;
  font-size: 0.9rem;
  background: rgba(0, 0, 0, 0.6);
  padding: 4px 8px;
  border-radius: 6px;
  color: whitesmoke;
}

.url-input-group {
  display: flex;
  gap: 12px;
}

.url-input-group input {
  flex-grow: 1;
}

.url-input-group button {
  padding: 10px 20px;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.btn-primary {
  background-color: #4a90e2;
  color: white;
  padding: 12px 24px;
  font-size: 1.1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background-color: #357ab7;
}

.btn-secondary {
  background-color: #e0e0e0;
  color: #333;
  padding: 12px 24px;
  font-size: 1.1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background-color: #b0b0b0;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .category-item, .amenity-item {
    flex: 1 1 48%;
  }

  .form-actions {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
