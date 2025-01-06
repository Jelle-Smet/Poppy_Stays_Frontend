<template>
  <div v-if="giftCard" class="gift-card-purchase-container">
    <h1 class="page-title">Purchase Gift Card</h1>

    <div class="content-grid">
      <!-- Gift Card Info -->
      <div class="gift-card-info">
        <h2>{{ giftCard.Gift_Card_Name }}</h2>
        <p class="gift-card-description">{{ giftCard.Gift_Card_Description }}</p>
        <div class="price">
          <strong>Amount:</strong> ${{ giftCard.Gift_Card_Amount }}
        </div>
      </div>

      <!-- Purchase Card -->
      <div class="purchase-card">
        <div class="price">
          <strong>Total:</strong> ${{ giftCard.Gift_Card_Amount }}
        </div>

        <!-- Payment Method Section -->
        <div class="payment-method">
          <h3><strong>Payment Method:</strong></h3>
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
            I accept the
            <router-link to="/terms-and-conditions">Terms and Conditions</router-link>
            and
            <router-link to="/privacy-policy">Privacy Policy</router-link>.
          </label>

        </div>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <button
          class="purchase-btn"
          :disabled="!canPurchase || !termsAccepted || isLoading"
          @click="handlePurchase"
        >
          <span v-if="isLoading">Processing...</span>
          <strong v-else>Complete Purchase</strong>
        </button>
      </div>
    </div>
  </div>
  <div v-else-if="loading" class="loading">Loading...</div>
  <div v-else-if="error" class="error-state">{{ error }}</div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'GiftCardPurchasePage',
  data() {
    return {
      giftCard: null,
      loading: true,
      error: null,
      paymentMethod: 'Card',
      termsAccepted: false,
      isLoading: false,
      errorMessage: '',
    };
  },

  computed: {
    canPurchase() {
      return this.giftCard && !this.isLoading && this.termsAccepted;
    }
  },

  created() {
    const giftCardId = this.$route.params.id;
    if (giftCardId) {
      this.fetchGiftCardDetails(giftCardId);
    } else {
      this.error = 'No gift card ID provided';
      this.loading = false;
    }
  },

  methods: {
    async fetchGiftCardDetails(id) {
      try {
        const axiosWithAuth = axios.create({
          baseURL: 'http://localhost:3000',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });

        const response = await axiosWithAuth.get(`/api/gift-card-details/${id}`);
        this.giftCard = response.data.giftCard;
      } catch (err) {
        console.error('Error fetching gift card details:', err);
        this.error = 'Error fetching gift card details';
      } finally {
        this.loading = false;
      }
    },

    async handlePurchase() {
      if (!this.termsAccepted) {
        this.errorMessage = 'Please accept the terms and conditions.';
        return;
      }

      this.isLoading = true;
      this.errorMessage = '';

      try {
        const axiosWithAuth = axios.create({
          baseURL: 'http://localhost:3000',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });

        const paymentDetails = {
          paymentAmount: this.giftCard.Gift_Card_Amount,
          paymentMethod: this.paymentMethod,
        };

        const paymentResponse = await axiosWithAuth.post('/api/create-payment', paymentDetails);
        const paymentId = paymentResponse.data.paymentId;

        const purchaseDetails = {
          giftCardId: this.$route.params.id,
          paymentId: paymentId,
        };
        console.log(purchaseDetails);

        await axiosWithAuth.post('/api/create-gift-card-purchase', purchaseDetails);
        alert('Gift card purchase successful!');
      } catch (error) {
        console.error('Purchase failed:', error);
        this.errorMessage = 'Purchase failed. Please try again later.';
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>

<style scoped>
.gift-card-purchase-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  color: rgb(66, 66, 156);
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;
}

.gift-card-info {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.page-title {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #ffffff;
}

.purchase-card {
  background-color: #fff;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.price {
  color: #000;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

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

.terms-conditions {
  margin-top: 1rem;
  color: #000;
}

.terms-conditions input {
  margin-right: 0.5rem;
}

.purchase-btn {
  background-color: #4caf50;
  color: white;
  padding: 1rem;
  font-size: 1.2rem;
  width: 100%;
  margin-top: 1rem;
  cursor: pointer;
  border: none;
  border-radius: 5px;
  transition: all 0.3s ease;
}

.purchase-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.error-message {
  color: #ff0000;
  margin: 1rem 0;
  padding: 0.5rem;
  background-color: #f8d7da;
  border-radius: 4px;
  text-align: center;
}

.loading, .error-state {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
}

.gift-card-description {
  font-size: 1.2rem;
  margin: 1rem 0;
  color: #666;
}
</style>
