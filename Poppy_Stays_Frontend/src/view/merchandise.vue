<template>
  <section id="merchandise" class="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <!-- Header Section -->
    <header class="introduction">
      <h1 class="text-3xl font-semibold text-gray-800">Poppy's Collection</h1>
      <p class="mt-2 text-gray-600">Explore our exclusive collection of camping-inspired gear and accessories, designed to bring the spirit of adventure into your everyday life. From stylish apparel to essential outdoor gear, our products are crafted to enhance your outdoor experiences while keeping you comfortable and looking great. Whether you're gearing up for your next camping trip or simply looking for the perfect gift for a fellow adventurer, you're sure to find something special here. Start shopping now and bring a little piece of Poppy Stays with you wherever you go!</p>
    </header>

    <div v-for="(brand, brandIndex) in products" :key="brandIndex" class="mb-16">
      <h3 class="text-2xl font-semibold text-gray-800 mb-6 px-4">
        {{ brand.name }}
      </h3>

      <div class="warning-card">
        <div v-for="(item, itemIndex) in brand.items"
             :key="itemIndex"
             class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group">
          <div class="relative aspect-[4/3] overflow-hidden">
            <div class="image-carousel h-full w-full">
              <div class="carousel-images h-full w-full">
                <img :src="item.images[getCurrentImageIndex(brand.name, item.name)]"
                     :alt="item.name"
                     class="h-full w-full object-cover transform hover:scale-105 transition-transform duration-500"
                     style="max-height: 300px; max-width: 400px;">
              </div>

              <!-- Navigation arrows - now overlaid on image -->
              <div v-if="item.images.length > 1"
                   class="absolute inset-0 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button @click.prevent="prevImage(brand.name, item.name)"
                        class="carousel-btn ml-4">
                  <span class="sr-only">Previous</span>
                  &#10094;
                </button>
                <button @click.prevent="nextImage(brand.name, item.name)"
                        class="carousel-btn mr-4">
                  <span class="sr-only">Next</span>
                  &#10095;
                </button>
              </div>

              <!-- Dots indicator -->
              <div class="absolute bottom-4 left-0 right-0 flex justify-center space-x-2"
                   v-if="item.images.length > 1">
                <button v-for="(_, dotIndex) in item.images"
                        :key="dotIndex"
                        @click="setImage(brand.name, item.name, dotIndex)"
                        :class="[
                          'w-2 h-2 rounded-full transition-all duration-300 shadow-md',
                          getCurrentImageIndex(brand.name, item.name) === dotIndex
                            ? 'bg-white scale-125'
                            : 'bg-white/50 hover:bg-white/75'
                        ]"
                        :aria-label="`Go to image ${dotIndex + 1}`">
                </button>
              </div>
            </div>
          </div>

          <div class="p-6">
            <h4 class="text-xl font-semibold text-gray-900 mb-2">{{ item.name }}</h4>
            <p class="text-gray-600 mb-6 line-clamp-2">{{ item.description }}</p>
            <div class="flex justify-end">
              <a :href="item.purchaseLink"
                 target="_blank"
                 rel="noopener"
                 class="purchase-link">
                Shop Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'MerchandiseSection',
  data() {
    return {
      currentIndexes: {},  // Will store indexes as 'BrandName-ProductName': index
      products: [
        {
          name: "Dr. Martens",
          items: [
            {
              name: "Audrick Boots",
              description: "Classic, durable boots perfect for outdoor adventures. With their signature Dr. Martens craftsmanship, they provide comfort, support, and style for your camping excursions.",
              images: [
                "https://i.pinimg.com/236x/1e/f4/da/1ef4da6ebcee7814e7e2bca5f2d1edc0.jpg",
                "https://i.pinimg.com/236x/62/f4/d3/62f4d3ba5d178de9657fb2fbe6ab1260.jpg",
                "https://i.pinimg.com/236x/d9/61/9b/d9619ba629927b302e2b200d71743e1c.jpg",
                "https://i.pinimg.com/236x/00/fb/bd/00fbbdb2bb4749e71f8e876ca27fcf01.jpg",
                "https://i.pinimg.com/236x/4d/19/df/4d19df8491d7988670896ebd32ac71d8.jpg"
              ],
              purchaseLink: "https://www.drmartens.com/eu/en_eu/audrick-nappa-lux-platform-ankle-boots-black/p/27149001"
            },
            {
              name: "1460 Boots",
              description: "Iconic 8-eye boots, known for their rugged appearance and reliable construction. Ideal for tackling tough terrains and adding a bit of edge to your camping wardrobe.",
              images: [
                "https://i.pinimg.com/236x/0b/93/47/0b934759d7e2a38a25942b4f094bb315.jpg",
                "https://i.pinimg.com/236x/0d/a6/01/0da60175584379681d6ddcb6a94bc1b5.jpg",
                "https://i.pinimg.com/236x/41/7f/9f/417f9f2ea4ef4201904aed3ddca00bd0.jpg",
                "https://i.pinimg.com/236x/58/4d/1d/584d1d45b4c32314b97cc2ff9329186e.jpg",
                "https://i.pinimg.com/236x/4d/19/df/4d19df8491d7988670896ebd32ac71d8.jpg"
              ],
              purchaseLink: "https://www.drmartens.com/eu/en_eu/1460-ambassador-soft-leather-lace-up-boots-black/p/31981001"
            }
          ]
        },
        {
          name: "The North Face",
          items: [
            {
              name: "Sangro Jacket",
              description: "A durable, water-resistant jacket designed to withstand the elements during your outdoor adventures.",
              images: [
                "https://assets.thenorthface.eu/images/t_img/f_auto,h_462,w_462/e_sharpen:60/dpr_2.0/v1730108157/NF00A3X54H0-ALT17/Mens-Sangro-Jacket.jpg",
                "https://assets.thenorthface.eu/images/t_img/f_auto,h_462,w_462/e_sharpen:60/dpr_2.0/v1730107622/NF00A3X54H0-ALT6/Mens-Sangro-Jacket.jpg",
                "https://assets.thenorthface.eu/images/t_img/f_auto,h_462,w_462/e_sharpen:60/dpr_2.0/v1730108159/NF00A3X54H0-ALT21/Mens-Sangro-Jacket.jpg",
                "https://assets.thenorthface.eu/images/t_img/f_auto,h_462,w_462/e_sharpen:60/dpr_2.0/v1730107610/NF00A3X54H0-ALT1/Mens-Sangro-Jacket.jpg"
              ],
              purchaseLink: "https://www.thenorthface.eu/nl-be/p/heren-211701/sangro-jas-voor-heren-NF00A3X5?color=4H0"
            },
            {
              name: "Base Camp Duffel Bag XXL",
              description: "A spacious, rugged duffel bag for all your gear, perfect for long trips or extended camping adventures.",
              images: [
                "https://assets.thenorthface.eu/images/t_img/f_auto,h_462,w_462/e_sharpen:60/dpr_2.0/v1720806741/NF0A52SC53R-HERO/Base-Camp-Duffel-Extra-Large.png",
                "https://assets.thenorthface.eu/images/t_img/f_auto,h_462,w_462/e_sharpen:60/dpr_2.0/v1720806740/NF0A52SC53R-ALT3/Base-Camp-Duffel-Extra-Large.png",
                "https://assets.thenorthface.eu/images/t_img/f_auto,h_462,w_462/e_sharpen:60/dpr_2.0/v1720806740/NF0A52SC53R-ALT2/Base-Camp-Duffel-Extra-Large.png",
                "https://assets.thenorthface.eu/images/t_img/f_auto,h_462,w_462/e_sharpen:60/dpr_2.0/v1720806740/NF0A52SC53R-ALT3/Base-Camp-Duffel-Extra-Large.png"
              ],
              purchaseLink: "https://www.thenorthface.eu/nl-be/p/tassen-and-uitrusting-211747/base-camp-reistas-xxl-NF0A52SD?color=53R"
            }
          ]
        },
        {
          name: "Patagonia",
          items: [
            {
              name: "Torrentshell 3-Layer Rain Jacket",
              description: "A weatherproof jacket designed to keep you dry on rainy days, ideal for camping and hiking.",
              images: [
                "https://eu.patagonia.com/dw/image/v2/BDJB_PRD/on/demandware.static/-/Sites-patagonia-master/default/dwf34f5e67/images/hi-res/85241_BLK.jpg?sw=1920&sh=1920&sfrm=png&q=90&bgcolor=f5f5f5",
                "https://eu.patagonia.com/dw/image/v2/BDJB_PRD/on/demandware.static/-/Sites-patagonia-master/default/dw7c8b678a/images/hi-res/85241_BLK_TM4.jpg?sw=1920&sh=1920&sfrm=png&q=90&bgcolor=f5f5f5",
                "https://eu.patagonia.com/dw/image/v2/BDJB_PRD/on/demandware.static/-/Sites-patagonia-master/default/dw949f7319/images/hi-res/85241_BLK_TM5.jpg?sw=1920&sh=1920&sfrm=png&q=90&bgcolor=f5f5f5",
                "https://eu.patagonia.com/dw/image/v2/BDJB_PRD/on/demandware.static/-/Sites-patagonia-master/default/dw8f4cad20/images/hi-res/85241_BLK_TL1.jpg?sw=1920&sh=1920&sfrm=png&q=90&bgcolor=f5f5f5"
              ],
              purchaseLink: "https://eu.patagonia.com/be/en/product/mens-torrentshell-3-layer-rain-jacket/85241.html?dwvar_85241_color=BLK"
            },
            {
              name: "Capilene Midweight Crew Neck Shirt",
              description: "A moisture-wicking, breathable shirt perfect for layering during outdoor activities.",
              images: [
                "https://eu.patagonia.com/dw/image/v2/BDJB_PRD/on/demandware.static/-/Sites-patagonia-master/default/dwd86a3346/images/hi-res/44427_SMDB.jpg?sw=1920&sh=1920&sfrm=png&q=90&bgcolor=f5f5f5",
                "https://eu.patagonia.com/dw/image/v2/BDJB_PRD/on/demandware.static/-/Sites-patagonia-master/default/dw6afb4ff8/images/hi-res/44427_SMDB_MO1.jpg?sw=1920&sh=1920&sfrm=png&q=90&bgcolor=f5f5f5",
                "https://eu.patagonia.com/dw/image/v2/BDJB_PRD/on/demandware.static/-/Sites-patagonia-master/default/dwae686679/images/hi-res/44427_SMDB_SQ1.jpg?sw=1920&sh=1920&sfrm=png&q=90&bgcolor=f5f5f5",
                "https://eu.patagonia.com/dw/image/v2/BDJB_PRD/on/demandware.static/-/Sites-patagonia-master/default/dwe649f099/images/hi-res/44427_SMDB_SQ2.jpg?sw=1920&sh=1920&sfrm=png&q=90&bgcolor=f5f5f5"
              ],
              purchaseLink: "https://eu.patagonia.com/be/en/product/mens-capilene-midweight-crew-neck-shirt/44427.html?srsltid=AfmBOorBJsC9fcaDtqhQ8q6Mw-JVFiz2nFiHPzKrJ0n5LnqZF9czqOB_"
            }
          ]
        }
      ]
    };
  },
  methods: {
    getKey(brandName, productName) {
      return `${brandName}-${productName}`;
    },
    getCurrentImageIndex(brandName, productName) {
      const key = this.getKey(brandName, productName);
      return this.currentIndexes[key] || 0;
    },
    setImage(brandName, productName, imageIndex) {
      const key = this.getKey(brandName, productName);
      this.currentIndexes[key] = imageIndex;
    },
    findProduct(brandName, productName) {
      const brand = this.products.find(b => b.name === brandName);
      return brand.items.find(item => item.name === productName);
    },
    nextImage(brandName, productName) {
      const key = this.getKey(brandName, productName);
      const product = this.findProduct(brandName, productName);
      const currentIndex = this.getCurrentImageIndex(brandName, productName);
      const maxIndex = product.images.length - 1;
      this.currentIndexes[key] = currentIndex >= maxIndex ? 0 : currentIndex + 1;
    },
    prevImage(brandName, productName) {
      const key = this.getKey(brandName, productName);
      const product = this.findProduct(brandName, productName);
      const currentIndex = this.getCurrentImageIndex(brandName, productName);
      const maxIndex = product.images.length - 1;
      this.currentIndexes[key] = currentIndex <= 0 ? maxIndex : currentIndex - 1;
    }
  }
};
</script>

<style scoped>
.introduction {
  background-color: #b8c7d6;
  min-height: auto;
  border: 2px solid rgb(75,73,73);
  color: black;
  border-radius: 12px; /* Smooth edges */
  text-align: center;
  margin-bottom: 20px
}

h1{
  font-size:x-large;
}

h3 {
  color: #333;
  border: 2px solid rgb(75,73,73);
  border-radius: 50px;
}

.container {
  background-color: #f8f9fa;
  min-height: 100vh;
  color: black;
  border-radius: 12px; /* Smooth edges */
  text-align: center;
}

.warning-card {
  background: white;
  border-radius: 12px;
  border: 2px solid rgb(75, 73, 73); /* Add a border */
  padding: 30px;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.9);
  color: black;
  margin: 20px; /* Add space between cards */
}

.carousel-btn {
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 0.5rem;
  font-size: 1.5rem;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.3s ease;
}
.carousel-btn:hover {
  transform: scale(1.2);
}
.purchase-link {
  text-decoration: underline;
  background-color: white;
  border: 2px solid rgb(75,73,73);
  border-radius: 25px;
  color: #4A90E2;
}
.purchase-link:hover {
  color: #357ABD;
}
</style>
