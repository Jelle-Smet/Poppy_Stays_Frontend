<template>
  <div class="review-container">
    <div class="warning-card">
      <h2>Submit a Review</h2>

      <!-- Warning message and guidelines -->
      <div class="warning-section">
        <div class="warning-icon">⭐</div>
        <h3>Important Guidelines</h3>
        <p>Please review the following before submitting your review:</p>

        <!-- List of review guidelines -->
        <div class="consequences">
          <div class="consequence-item">
            <span class="icon">👀</span>
            <p>Your review will be public and visible to all users</p>
          </div>
          <div class="consequence-item">
            <span class="icon">📝</span>
            <p>Be specific and detailed about your experience</p>
          </div>
          <div class="consequence-item">
            <span class="icon">❌</span>
            <p>Reviews cannot be edited or deleted once submitted</p>
          </div>
          <div class="consequence-item">
            <span class="icon">⚖️</span>
            <p>Keep your review honest, respectful and constructive</p>
          </div>
          <div class="consequence-item">
            <span class="icon">🚫</span>
            <p>Fake or malicious reviews will result in account suspension</p>
          </div>
        </div>
      </div>

      <!-- Review form -->
      <div class="review-form">
        <form @submit.prevent="submitReview">
          <!-- Star Rating -->
          <div class="rating-section consequence-item">
            <span class="icon">⭐</span>
            <div class="rating-content">
              <label for="rating" class="rating-label">Your Rating</label>
              <div class="stars">
                <span
                  v-for="n in 5"
                  :key="n"
                  class="star"
                  :class="{ filled: n <= rating }"
                  @click="setRating(n)"
                >★</span>
              </div>
            </div>
          </div>

          <!-- Review Text -->
          <div class="comment-section consequence-item">
            <span class="icon">💭</span>
            <div class="comment-content">
              <label for="comment">Your Review</label>
              <textarea
                v-model="comment"
                class="comment-input"
                id="comment"
                rows="4"
                placeholder="Share details about your experience..."
                required
              ></textarea>
            </div>
          </div>

          <!-- Image URL -->
          <div class="image-section consequence-item">
            <span class="icon">📸</span>
            <div class="image-content">
              <label for="image">Add Photos (Optional)</label>
              <input
                type="url"
                v-model="imageUrl"
                class="image-input"
                id="image"
                placeholder="Enter image URL"
              >
            </div>
          </div>

          <!-- Submit Buttons -->
          <div class="button-group">
            <button type="button" @click="goBack" class="cancel-button">
              Cancel
            </button>
            <button
              type="submit"
              class="submit-button"
              :disabled="!rating || !comment"
            >
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.review-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: #f8f9fa;
}

.warning-card {
  background: white;
  border-radius: 12px;
  padding: 30px;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #2563eb;
  text-align: center;
  font-size: 1.875rem;
  margin-bottom: 1.5rem;
}

.warning-section {
  text-align: center;
  margin-bottom: 2rem;
}

.warning-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.consequences {
  margin-top: 1.5rem;
}

.consequence-item {
  display: flex;
  align-items: flex-start;
  margin: 1rem 0;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.consequence-item:hover {
  background: #f1f5f9;
  transform: translateY(-2px);
}

.icon {
  font-size: 1.5rem;
  margin-right: 1rem;
  min-width: 2rem;
}

.rating-content, .comment-content, .image-content {
  flex: 1;
}

.stars {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.star {
  font-size: 2rem;
  cursor: pointer;
  color: #cbd5e1;
  transition: color 0.2s ease;
}

.star.filled {
  color: #fbbf24;
}

.comment-input, .image-input {
  width: 100%;
  padding: 0.75rem;
  margin-top: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: white;
  transition: all 0.3s ease;
}

.comment-input:focus, .image-input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
}

.button-group {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  justify-content: center;
}

.submit-button, .cancel-button {
  padding: 0.75rem 2rem;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.submit-button {
  background: #2563eb;
  color: white;
}

.submit-button:hover:not(:disabled) {
  background: #1d4ed8;
  transform: translateY(-2px);
}

.submit-button:disabled {
  background: #94a3b8;
  cursor: not-allowed;
}

.cancel-button {
  background: #e2e8f0;
  color: #475569;
}

.cancel-button:hover {
  background: #cbd5e1;
  transform: translateY(-2px);
}

label {
  font-weight: 600;
  color: #1e293b;
  display: block;
  margin-bottom: 0.5rem;
}

h3 {
  color: #1e293b;
  font-size: 1.25rem;
  margin-bottom: 1rem;
}
</style>

<script>
import { ref } from "vue";
import axios from "axios";
import { useRouter, useRoute } from "vue-router";

export default {
  setup() {
    const router = useRouter();
    const route = useRoute();

    const rating = ref(0);
    const comment = ref("");
    const imageUrl = ref("");
    const error = ref(null);

    const token = localStorage.getItem("authToken");

    const setRating = (score) => {
      rating.value = score;
    };

    const submitReview = async () => {
      try {
        // Prepare the data for submission
        const reviewData = {
          spotId: route.params.spotId,
          reviewRating: rating.value,
          reviewComment: comment.value,
          reviewImage: imageUrl.value || null,  // Directly use the URL or null if not provided
        };

        // Make the request to the backend
        await axios.post("http://localhost:3000/api/submit-review", reviewData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",  // Send data as JSON
          },
        });

        // On success, navigate to the thank you page
        router.push("/thank-you");

      } catch (err) {
        error.value = "Failed to submit review. Please try again.";
        console.error("Error:", err);
      }
    };




    const goBack = () => {
      router.back();
    };

    return {
      rating,
      comment,
      imageUrl,
      error,
      setRating,
      submitReview,
      goBack
    };
  }
};
</script>

<style scoped>
/* Container for the review page */
.review-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: #f8f9fa;
}

/* Card containing the warning and review form */
.warning-card {
  background: white;
  border-radius: 12px;
  padding: 30px;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  color: black;
}

/* Header and warning message */
h2 {
  color: #dc3545;
  text-align: center;
  margin-bottom: 30px;
}

.warning-section {
  text-align: center;
  margin-bottom: 30px;
}

.warning-icon {
  font-size: 48px;
  margin-bottom: 20px;
}

/* Consequences list */
.consequences {
  margin-top: 20px;
}

.consequence-item {
  display: flex;
  align-items: center;
  margin: 15px 0;
  padding: 10px;
  background: #fff5f5;
  border-radius: 8px;
}

.consequence-item .icon {
  font-size: 24px;
  margin-right: 15px;
  min-width: 40px;
}

/* Star Rating */
.stars {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.star {
  font-size: 30px;
  cursor: pointer;
  color: #d3d3d3;
}

.star.filled {
  color: #ffc107;
}

/* Review form */
.review-form {
  text-align: center;
}

.form-group {
  margin-bottom: 15px;
}

textarea {
  resize: vertical;
}

/* Buttons */
button {
  padding: 10px 25px;
  border-radius: 6px;
  font-size: 1em;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  background-color: #007bff;
  color: white;
}

button:hover {
  background-color: #0056b3;
}

/* Error styling */
.error {
  color: #dc3545;
  text-align: center;
  margin-top: 10px;
}
</style>
