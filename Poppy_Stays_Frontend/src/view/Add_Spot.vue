<template>
  <div class="container mt-4">
    <div class="form-wrapper">
      <h2 class="text-2xl font-bold text-center mb-6 text-primary">Add New Spot</h2>

      <div v-if="loading" class="loading-spinner">
        <div class="spinner"></div>
        <p>Loading form...</p>
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
              placeholder="Give your spot a catchy name"
              required
            />
          </div>

          <div class="form-group">
            <label for="description">Description*</label>
            <textarea
              id="description"
              v-model="formData.Spot_Description"
              class="form-input min-h-[120px]"
              placeholder="Tell users what makes your spot special and what they can expect during their stay"
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
                  placeholder="0.00"
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
                  placeholder="1"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Location Card -->
        <div class="form-card">
          <div class="card-header">
            <i class="fas fa-map-marker-alt card-icon"></i>
            <h3>Location Details</h3>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label for="country">Country*</label>
              <select
                id="country"
                v-model="formData.country"
                class="form-input"
                required
              >
                <option value="" disabled selected>Select your country</option>
                <option v-for="country in countries" :key="country.Country_ID" :value="country.Country_ID">
                  {{ country.Country_Name }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for="city">City*</label>
              <select
                id="city"
                v-model="formData.city"
                class="form-input"
                required
              >
                <option value="" disabled selected>Select your city</option>
                <option v-for="city in cities" :key="city.City_ID" :value="city.City_ID">
                  {{ city.City_Name }}
                </option>
              </select>
            </div>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label for="street">Street*</label>
              <select
                id="street"
                v-model="formData.street"
                class="form-input"
                requireds
              >
                <option value="" disabled selected>Select your street</option>
                <option v-for="street in streets" :key="street.Street_ID" :value="street.Street_ID">
                  {{ street.Street_Name }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for="houseNumber">House Number*</label>
              <input
                id="houseNumber"
                v-model="formData.houseNumber"
                type="text"
                class="form-input"
                placeholder="Enter your house number"
                required
              />
            </div>


          </div>

          <div class="form-grid">
            <div class="form-group">
              <label for="latitude">Latitude*</label>
              <input
                id="latitude"
                v-model="formData.latitude"
                type="number"
                step="any"
                class="form-input"
                placeholder="e.g. 41.8781"
                required
              />
            </div>

            <div class="form-group">
              <label for="longitude">Longitude*</label>
              <input
                id="longitude"
                v-model="formData.longitude"
                type="number"
                step="any"
                class="form-input"
                placeholder="e.g. -87.6298"
                required
              />
            </div>
          </div>
        </div>

        <!-- availability card -->
        <div class="form-card">
          <div class="card-header">
            <i class="fas fa-calendar-alt card-icon"></i>
            <h3>Availability</h3>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label for="startDate">Available From*</label>
              <input
                id="startDate"
                v-model="formData.startDate"
                type="date"
                class="form-input"
                :min="today"
                required
              />
            </div>

            <div class="form-group">
              <label for="endDate">Available Until*</label>
              <input
                id="endDate"
                v-model="formData.endDate"
                type="date"
                class="form-input"
                :min="formData.startDate"
                required
              />
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
            <i class="fas fa-plus-circle"></i> Create Spot
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

export default {
  setup() {
    const router = useRouter();
    const token = localStorage.getItem("authToken");
    const ownerId = localStorage.getItem('Owner_ID');
    const loading = ref(true);
    const error = ref(null);
    const categories = ref([]);
    const amenities = ref([]);
    const newImageUrl = ref("");
    const countries = ref([]);
    const cities = ref([]);
    const streets = ref([]);
    const today = new Date().toISOString().split('T')[0];

    const formData = ref({
      Spot_Name: "",
      Spot_Description: "",
      Spot_Price_Per_Night: "",
      Spot_Max_Guests: 1,
      country: "",
      city: "",
      street: "",
      houseNumber: "",
      latitude: "",
      longitude: "",
      categoryId: null,
      amenities: [],
      images: [],
      startDate: "",
      endDate: "",
    });

    const isFormValid = computed(() => {
      const isValid = formData.value.Spot_Name &&
        formData.value.Spot_Description &&
        formData.value.Spot_Price_Per_Night > 0 &&
        formData.value.Spot_Max_Guests > 0 &&
        formData.value.country &&
        formData.value.city &&
        formData.value.street &&
        formData.value.latitude &&
        formData.value.longitude &&
        formData.value.categoryId &&
        formData.value.amenities.length > 0 &&
        formData.value.amenities.length <= 6 &&
        formData.value.startDate &&
        formData.value.endDate &&
        formData.value.startDate <= formData.value.endDate;

      console.log('Form validation state:', {
        name: !!formData.value.Spot_Name,
        description: !!formData.value.Spot_Description,
        price: formData.value.Spot_Price_Per_Night > 0,
        guests: formData.value.Spot_Max_Guests > 0,
        country: !!formData.value.country,
        city: !!formData.value.city,
        street: !!formData.value.street,
        coords: !!formData.value.latitude && !!formData.value.longitude,
        category: !!formData.value.categoryId,
        amenities: formData.value.amenities.length > 0 && formData.value.amenities.length <= 6,
        dates: !!formData.value.startDate && !!formData.value.endDate && formData.value.startDate <= formData.value.endDate
      });

      return isValid;
    });

    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/categories", {
          headers: { Authorization: `Bearer ${token}` },
        });
        categories.value = response.data.categories;
        loading.value = false;
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

    const fetchCountries = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/countries');
        countries.value = response.data.countries;
      } catch (err) {
        console.error('Error fetching countries:', err);
        error.value = "Failed to load countries";
      }
    };

    const fetchCities = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/cities`);
        cities.value = response.data.cities;
      } catch (err) {
        console.error('Error fetching cities:', err);
        error.value = "Failed to load cities";
      }
    };

    const fetchStreets = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/streets`);
        streets.value = response.data.streets;
      } catch (err) {
        console.error('Error fetching streets:', err);
        error.value = "Failed to load streets";
      }
    };

    // Fetch countries, cities, streets, categories, and amenities when component is mounted
    onMounted(() => {
      fetchCountries();
      fetchCategories();
      fetchAmenities();
      fetchCities();
      fetchStreets();
    });


    const selectCategory = (categoryId) => {
      formData.value.categoryId = categoryId;
    };

    const toggleAmenity = (amenityId) => {
      const index = formData.value.amenities.indexOf(amenityId);
      if (index === -1) {
        if (formData.value.amenities.length < 6) {
          formData.value.amenities.push(amenityId);
        }
      } else {
        formData.value.amenities.splice(index, 1);
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

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    };

    const handleSubmit = async () => {
      try {
        console.log('Token:', token); // Add this at the start of handleSubmit
        console.log('Owner ID:', ownerId); // Add this at the start of handleSubmit
        // Add loading state
        loading.value = true;
        error.value = null;

        console.log('Form data before submission:', formData.value);

        const updatedData = {
          name: formData.value.Spot_Name,
          description: formData.value.Spot_Description,
          pricePerNight: formData.value.Spot_Price_Per_Night,
          maxGuests: formData.value.Spot_Max_Guests,
          categoryId: formData.value.categoryId,
          amenities: formData.value.amenities,
          imageUrls: formData.value.images,
          cityId: formData.value.city,
          streetId: formData.value.street,
          countryId: formData.value.country,
          ownerId,
          startDate: formatDate(formData.value.startDate),
          endDate: formatDate(formData.value.endDate),
          // Add these fields that might be required by your backend
          houseNumber: formData.value.houseNumber,
          latitude: formData.value.latitude,
          longitude: formData.value.longitude
        };

        console.log("Submitting spot data:", updatedData);

        // Add explicit error handling for the request
        try {
          const response = await axios.post(
            "http://localhost:3000/api/add-spot",
            updatedData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );

          console.log('Full API Response:', response);

          if (response.status === 201) {
            console.log('Spot created successfully');
            router.push("/spot-overview");
          } else {
            throw new Error(`Unexpected response status: ${response.status}`);
          }
        } catch (axiosError) {
          console.error('Axios error details:', {
            status: axiosError.response?.status,
            statusText: axiosError.response?.statusText,
            data: axiosError.response?.data,
            headers: axiosError.response?.headers
          });
          throw axiosError;
        }
      } catch (err) {
        console.error("Error in handleSubmit:", err);
        error.value = err.response?.data?.error || err.message || "Failed to create spot";
      } finally {
        loading.value = false;
      }
    };


    const goBack = () => {
      router.push("/spot-overview");  // Go back to Spot Overview page
    };

    return {
      loading,
      error,
      formData,
      categories,
      countries,
      cities,
      streets,
      amenities,
      newImageUrl,
      isFormValid,
      selectCategory,
      toggleAmenity,
      addImageUrl,
      removeImage,
      handleSubmit,
      goBack,
      today,

    };
  },
};
</script>

<style scoped>

/* All styles from the update component remain exactly the same */
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
.form-wrapper {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px;
  background: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

input[type="date"] {
  appearance: none;
  padding: 14px;
  border: 2px solid #d1d1d1;
  border-radius: 10px;
  font-size: 1rem;
  background-color: #f8f8f8;
  transition: all 0.3s ease;
}

input[type="date"]:focus {
  border-color: #4a90e2;
  background-color: #ffffff;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.2);
  outline: none;
}
</style>
