<template>
  <div class="gift-cards-container">
    <h1 class="page-title">Poppy Stays Gift Cards</h1>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      Loading gift cards...
    </div>

    <!-- Error State -->
    <div v-if="error" class="error-state">
      {{ error }}
    </div>

    <!-- Gift Cards Grid -->
    <div v-if="!loading && !error" class="cards-grid">
      <div v-for="card in giftCards" :key="card.id" class="card">
        <div class="card-header">
          <div class="card-title">
            <span class="card-name">{{ card.name }}</span>
            <span class="gift-icon">🎁</span>
          </div>
          <div class="card-amount">${{ card.amount }}</div>
        </div>
        <div class="card-body">
          <p class="card-description">{{ card.description }}</p>
        </div>
        <div class="card-footer">
          <button class="buy-button" @click="handleBuy(card)">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GiftCards',
  data() {
    return {
      giftCards: [],
      loading: true,
      error: null
    }
  },
  async created() {
    try {
      const response = await fetch('http://localhost:3000/api/gift-cards');
      const data = await response.json();

      if (data.giftCards) {
        this.giftCards = data.giftCards;
      }
    } catch (err) {
      this.error = 'Failed to load gift cards';
    } finally {
      this.loading = false;
    }
  },
  methods: {
    handleBuy(card) {
      console.log('Navigating with the following card ID:', card.id);
      this.$router.push({
      name: 'gift-card-purchase',
      params: { id: card.id } // Make sure 'id' matches the route definition
    });
    }
  }
}
</script>



<style scoped>
.gift-cards-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  text-align: center;
  color: #2d3748;
  margin-bottom: 2rem;
  font-size: 2.5rem;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  overflow: hidden;
  transition: transform 0.2s;
  display: flex;
  flex-direction: column;
}

.card:hover {
  transform: translateY(-5px);
}

.card-header {
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
}

.card-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.card-name {
  font-size: 1.25rem;
  font-weight: bold;
  color: #2d3748;
}

.gift-icon {
  color: #48bb78;
  font-size: 1.5rem;
}

.card-amount {
  font-size: 1.5rem;
  color: #48bb78;
  font-weight: bold;
}

.card-body {
  padding: 1.5rem;
  flex-grow: 1;
}

.card-description {
  color: #4a5568;
  line-height: 1.5;
}

.card-footer {
  padding: 1.5rem;
  border-top: 1px solid #eee;
}

.buy-button {
  width: 100%;
  padding: 0.75rem;
  background-color: #48bb78;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.buy-button:hover {
  background-color: #38a169;
}

.loading-state,
.error-state {
  text-align: center;
  padding: 2rem;
  font-size: 1.25rem;
}

.error-state {
  color: #e53e3e;
}

@media (max-width: 768px) {
  .gift-cards-container {
    padding: 1rem;
  }

  .page-title {
    font-size: 2rem;
  }

  .cards-grid {
    grid-template-columns: 1fr;
  }
}
</style>
