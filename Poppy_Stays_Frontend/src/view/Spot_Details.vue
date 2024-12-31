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
          <button
            @click="toggleFavorite"
            class="favorite-btn"
            :class="{ 'favorited': isFavorited }"
          >
            <span class="star">★</span>
            {{ isFavorited ? 'Favorited' : 'Favorite Spot' }}
          </button>
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

      <!-- Booking Section -->
      <div class="booking-card">
        <div class="price">
          <strong><u>Price:</u></strong> ${{ spot.pricePerNight }}
          <span class="per-night"><strong><u>Per Night</u></strong></span>
        </div>

        <!-- Selected Dates -->
        <div class="selected-dates">
          <p><strong><u>Start Date:</u></strong> {{ startDate ? startDate : 'Not selected' }}</p>
          <p><strong><u>End Date:</u></strong> {{ endDate ? endDate : 'Not selected' }}</p>
        </div>

        <div class="total" v-if="startDate && endDate">
          <div class="breakdown">
            <span><strong><u>Price Breakdown:</u></strong> ${{ spot.pricePerNight }} × {{ numberOfNights }} nights</span>
            <span v-if="appliedPromotion">
              <br><strong><u>Discount:</u></strong>
              {{ appliedPromotion.type === 'Percentage' ? `${appliedPromotion.amount}%` : `$${appliedPromotion.amount}` }}
              ({{ appliedPromotion.name }})
            </span>
            <span><strong><u>Total:</u></strong> ${{ total }}</span>
          </div>
        </div>

        <!-- Promo Code Section -->
        <div class="promo-section">
          <input v-model="promoCode" type="text" placeholder="Enter promo code" class="promo-input" :disabled="promoApplied" />
          <button @click="checkPromoCode" class="apply-promo-btn" :disabled="promoApplied || !promoCode">Apply Promo Code</button>
          <p v-if="promoMessage" :class="['promo-message', { 'promo-success': promoApplied, 'promo-error': !promoApplied }]">
            {{ promoMessage }}
          </p>
        </div>

        <!-- Payment Method Section -->
        <div class="payment-method">
          <h3><strong><u>Payment Method:</u></strong></h3>
          <select v-model="paymentMethod" class="payment-dropdown">
            <option value="Card">Card</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Cash">Cash</option>
            <option value="PayPal">PayPal</option>
            <option value="Apple Pay">Apple Pay</option>
          </select>
        </div>

        <!-- Terms and Conditions -->
        <div class="terms-conditions">
          <input v-model="termsAccepted" type="checkbox" id="terms" />
          <label for="terms">
            I accept the <a href="/terms-and-conditions" target="_blank">Terms and Conditions</a> and <a href="/privacy-policy" target="_blank">Privacy Policy</a>.
          </label>
        </div>
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <button
          class="book-btn"
          :disabled="!canBook || !termsAccepted || isLoading"
          @click="handleBooking"
        >
          <span v-if="isLoading">Processing...</span>
          <strong v-else><u>Book Now</u></strong>
        </button>
      </div>
    </div>

    <!-- Calendar Section -->
    <div class="calendar-section">
      <Calendar
        :unavailable-dates="unavailableDates"
        :min-date="minDate"
        :max-date="maxDate"
        :selected-start-date="startDate"
        :selected-end-date="endDate"
        @update:selected-start-date="startDate = $event"
        @update:selected-end-date="endDate = $event"
      />
    </div>
    <!-- Reviews Section -->
    <div class="reviews-section">
      <h2><strong><u>Reviews</u></strong></h2>

      <div class="reviews-summary">
        <div class="average-rating">
          <span class="rating-number">{{ averageRating.toFixed(1) }}</span>
          <div class="stars">
            <div class="stars-filled" :style="{ width: `${(averageRating / 5) * 100}%` }">★★★★★</div>
            <div class="stars-empty">★★★★★</div>
          </div>
          <span class="total-reviews">{{ spot.reviews.length }} reviews</span>
        </div>
      </div>

      <div class="reviews-grid">
        <div v-for="review in spot.reviews" :key="review.date" class="review-card">
          <div class="review-header">
            <div class="stars">
              <div class="stars-filled" :style="{ width: `${(review.rating / 5) * 100}%` }">★★★★★</div>
              <div class="stars-empty">★★★★★</div>
            </div>
            <span class="review-date">{{ formatDate(review.date) }}</span>
          </div>

          <p class="review-comment">{{ review.comment }}</p>

          <img v-if="review.image"
               :src="review.image"
               :alt="'Review image'"
               class="review-image"
               @click="openImageModal(review.image)" />
        </div>
      </div>
    </div>
  </div>
  <div v-else class="loading">Loading...</div>

  <!-- Image Modal -->
  <div v-if="selectedImage" class="image-modal" @click="selectedImage = null">
    <img :src="selectedImage" alt="Review image full size" class="modal-image" />
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import Calendar from '../components/Calendar.vue';

export default {
  name: 'SpotDetail',
  components: { Calendar },
  setup() {
    const spot = ref(null);
    const currentImageIndex = ref(0);
    const startDate = ref(null);
    const endDate = ref(null);
    const unavailableDates = ref([]);
    const promoCode = ref('');
    const promoApplied = ref(false);
    const promoMessage = ref('');
    const appliedPromotion = ref(null);
    const paymentMethod = ref('Card');
    const termsAccepted = ref(false);
    const isLoading = ref(false);
    const errorMessage = ref('');
    const minDate = ref(new Date());
    const maxDate = ref(new Date());
    const isFavorited = ref(false);

    const axiosWithAuth = axios.create({
      baseURL: 'http://localhost:3000',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
    });

    onMounted(async () => {
      try {
        const spotId = parseInt(window.location.pathname.split('/')[2]);
        const response = await axiosWithAuth.get(`/api/spot_details/${spotId}`);
        spot.value = response.data.spot;
        isFavorited.value = response.data.spot.isFavorited || false;

        const availabilityResponse = await axiosWithAuth.get(`/api/spot-availability/${spotId}`);
        minDate.value = new Date(availabilityResponse.data.availabilityStart);
        maxDate.value = new Date(availabilityResponse.data.availabilityStop);

        const unavailableDatesSet = new Set();
        spot.value.bookings.forEach(booking => {
          const start = new Date(booking.start);
          const end = new Date(booking.end);

          let current = new Date(start);
          while (current <= end) {
            unavailableDatesSet.add(current.toISOString().split('T')[0]);
            current.setDate(current.getDate() + 1);
          }
        });

        unavailableDates.value = Array.from(unavailableDatesSet);
      } catch (error) {
        console.error('Error loading spot details:', error);
        errorMessage.value = 'Failed to load spot details';
      }
    });

    const toggleFavorite = async () => {
      try {
        const spotId = parseInt(window.location.pathname.split('/')[2]);

        // Send the spotId in the request body
        await axiosWithAuth.post('/api/toggle-favorite', { spotId });

        // Assuming `isFavorited` is a reactive reference
        isFavorited.value = !isFavorited.value;
      } catch (error) {
        console.error('Error toggling favorite status:', error);
        alert('Failed to update favorite status. Please try again later.');
      }
    };

    const currentImage = computed(() => spot.value?.images[currentImageIndex.value]);

    const numberOfNights = computed(() => {
      if (!startDate.value || !endDate.value) return 0;
      const start = new Date(startDate.value);
      const end = new Date(endDate.value);
      return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    });

    const total = computed(() => {
      let price = numberOfNights.value * spot.value?.pricePerNight;

      if (appliedPromotion.value) {
        if (appliedPromotion.value.type === 'Percentage') {
          price -= price * (appliedPromotion.value.amount / 100);
        } else if (appliedPromotion.value.type === 'Fixed') {
          price -= appliedPromotion.value.amount;
        }
      }

      return Math.max(0, Math.round(price * 100) / 100);
    });

    const checkPromoCode = async () => {
      if (!promoCode.value) return;

      try {
        const response = await axiosWithAuth.post('/api/check-promo', {
          promoCode: promoCode.value
        });

        if (response.data.promotion) {
          appliedPromotion.value = response.data.promotion;
          promoApplied.value = true;
          promoMessage.value = `${response.data.promotion.description}`;
        }
      } catch (error) {
        console.error('Error checking promo code:', error);
        promoMessage.value = error.response?.data?.message || 'Invalid promo code';
        promoApplied.value = false;
        appliedPromotion.value = null;
      }
    };

    const handleBooking = async () => {
      if (!termsAccepted.value || !startDate.value || !endDate.value) {
        errorMessage.value = 'Please complete the form correctly.';
        return;
      }

      isLoading.value = true;

      try {
        const paymentDetails = {
          paymentAmount: total.value,
          paymentMethod: paymentMethod.value,
        };

        const paymentResponse = await axiosWithAuth.post('/api/create-payment', paymentDetails);
        const paymentId = paymentResponse.data.paymentId;

        const bookingDetails = {
          spotId: spot.value.id,
          startDate: startDate.value,
          endDate: endDate.value,
          totalAmount: total.value,
          paymentId: paymentId,
          promotionId: appliedPromotion.value?.id || null,
        };

        await axiosWithAuth.post('/api/create-booking', bookingDetails);
        isLoading.value = false;
        alert('Booking successful!');
      } catch (error) {
        console.error('Booking failed:', error);
        errorMessage.value = 'Booking failed. Please try again later.';
        isLoading.value = false;
      }
    };

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

    const canBook = computed(() => {
      return (
        startDate.value &&
        endDate.value &&
        !isLoading.value &&
        termsAccepted.value &&
        !unavailableDates.value.some((date) => {
          const dateToCheck = new Date(date);
          return dateToCheck.toDateString() === new Date(startDate.value).toDateString() ||
                dateToCheck.toDateString() === new Date(endDate.value).toDateString();
        })
      );
    });

    const selectedImage = ref(null);

    const averageRating = computed(() => {
      if (!spot.value?.reviews?.length) return 0;
      const total = spot.value.reviews.reduce((sum, review) => sum + review.rating, 0);
      return total / spot.value.reviews.length;
    });

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    const openImageModal = (image) => {
      selectedImage.value = image;
    };

    return {
      spot,
      currentImage,
      currentImageIndex,
      prevImage,
      nextImage,
      startDate,
      endDate,
      unavailableDates,
      promoCode,
      promoApplied,
      promoMessage,
      appliedPromotion,
      paymentMethod,
      termsAccepted,
      errorMessage,
      isLoading,
      total,
      numberOfNights,
      checkPromoCode,
      handleBooking,
      canBook,
      minDate,
      maxDate,
      isFavorited,
      toggleFavorite,
      averageRating,
      formatDate,
      selectedImage,
      openImageModal
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
  color: #000
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 350px; /* Main content and booking card split */
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

/* Information Container Styles */
.info-container {
  display: flex;
  flex-direction: column;
  gap: 2rem; /* Increased spacing between info items */
  margin-top: 2rem;
}

/* Individual Info Item Styles */
.info-item {
  padding: 1.5rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  transition: all 0.3s ease;
  border: 1px solid #e0e0e0;
  color: #000;
}

.info-item:hover {
  transform: translateX(5px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* Info Item Title and Content Styles */
.info-title {
  font-size: 1.2rem;
  color: #000;
  font-weight: 600;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 0.5rem;
}

.info-content {
  font-size: 1.1rem;
  color: #000;
  line-height: 1.8;
  margin: 0;
  padding: 0.5rem 0;
}

/* Amenities Section Styles */
.amenities {
  margin-top: 2rem;
  padding: 2rem;
  background-color: #f8f9fa;
  border-radius: 10px;
}

.amenities h2 {
  font-size: 1.8rem;
  color: #000;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e0e0e0;
}

.amenities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.amenity {
  background: #ffffff;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 1px solid #e0e0e0;
  color: #000;
}

.amenity:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Booking Card Styles */
.booking-card {
  background-color: #fff;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* Price Display Styles */
.price {
  color: #000;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

/* Selected Dates Display */
.selected-dates {
  margin: 1rem 0;
  font-size: 1rem;
  color: #000;
}

/* Booking Button Styles */
.book-btn {
  background-color: #4caf50;
  color: white;
  padding: 1rem;
  font-size: 1.2rem;
  width: 100%;
  cursor: pointer;
  border: none;
  border-radius: 5px;
  transition: all 0.3s ease;
}

.book-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* Price Breakdown Styles */
.breakdown {
  color: #000;
  font-size: 1rem;
  margin-top: 1rem;
}

.breakdown span {
  display: block;
  margin-bottom: 0.5rem;
}

.total {
  font-size: 1.2rem;
  color: #000;
  margin-top: 1.5rem;
}

/* Promo Code Section Styles */
.promo-section {
  margin-top: 1rem;
}

.promo-input {
  width: 70%;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  color: #000;
}

.apply-promo-btn {
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #4caf50;
  background-color: #4caf50;
  color: white;
  cursor: pointer;
  border-radius: 5px;
  transition: all 0.3s ease;
}

.promo-success {
  color: green;
  font-size: 1rem;
  margin-top: 0.5rem;
}

/* Payment Method Styles */
.payment-method {
  margin-top: 1rem;
  color: #000;
}

.payment-dropdown {
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  color: #000;
}

/* Terms and Conditions Styles */
.terms-conditions {
  margin-top: 1rem;
  color: #000;
}

.terms-conditions input {
  margin-right: 0.5rem;
}

/* Favorite Button Styles */
.favorite-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 20px;
  border: 2px solid #e0e0e0;
  background-color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  z-index: 10;
  color: #000;
}

.favorite-btn:hover {
  background-color: #f5f5f5;
  transform: scale(1.05);
}

.favorite-btn.favorited {
  background-color: #ffeb3b;
  border-color: #ffd700;
}

.favorite-btn.favorited svg {
  fill: #ffd700;
  stroke: #ffa000;
}

.favorite-btn svg {
  transition: all 0.3s ease;
}

/* Error Message Styles */
.error-message {
  color: #000;
  margin: 1rem 0;
  padding: 0.5rem;
  background-color: #f8d7da;
  border-radius: 4px;
  text-align: center;
}

/* Calendar Section Styles */
.calendar-section {
  margin-top: 2rem;
  padding: 1.5rem;
  background: rgb(0, 0, 0);
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.reviews-section {
  margin-top: 3rem;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.reviews-section h2 {
  font-size: 1.8rem;
  margin-bottom: 2rem;
  color: #000;
}

.reviews-summary {
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.average-rating {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.rating-number {
  font-size: 2.5rem;
  font-weight: bold;
  color: #000;
}

.stars {
  position: relative;
  display: inline-block;
  font-size: 1.5rem;
  width: 7.5rem;
  line-height: 1;
}

.stars-empty {
  color: #e0e0e0;
}

.stars-filled {
  position: absolute;
  top: 0;
  left: 0;
  white-space: nowrap;
  overflow: hidden;
  color: #ffd700;
}

.total-reviews {
  color: #666;
  font-size: 1.1rem;
}

.reviews-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.review-card {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  transition: transform 0.2s ease;
}

.review-card:hover {
  transform: translateY(-2px);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.review-date {
  color: #666;
  font-size: 0.9rem;
}

.review-comment {
  color: #000;
  line-height: 1.6;
  margin: 1rem 0;
}

.review-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 4px;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.review-image:hover {
  opacity: 0.9;
}

.image-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  cursor: pointer;
}

.modal-image {
  max-width: 90%;
  max-height: 90vh;
  object-fit: contain;
  border-radius: 4px;
}
</style>
