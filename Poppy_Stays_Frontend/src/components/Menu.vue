<template>
  <!-- Main navigation bar -->
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <!-- Brand logo for the website -->
      <a class="navbar-brand" href="#">Poppy Stays</a>

      <!-- Toggler for mobile view -->
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Collapsible menu -->
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <!-- Render DropdownMenu for each menu item -->
          <DropdownMenu
            v-for="(item, index) in menuItems"  <!-- Loop through all menu items -->
            :key="index"
            :item="item"   <!-- Pass menu item and its sub-items as prop -->
            :active="activeMenu === item.label"   <!-- Check if the menu item is active -->
            @setActive="setActiveMenu(item.label)" <!-- Emit an event to set active menu on click -->
          />
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import DropdownMenu from './DropdownMenu.vue';   // Import DropdownMenu component

export default {
  components: {
    DropdownMenu   // Register DropdownMenu to use in this component
  },
  data() {
    return {
      activeMenu: '',  // Holds the currently active menu
      // Define the main menu items with sub-items
      menuItems: [
        { label: 'Home', subItems: ['Sign up / Login', 'Special offers', 'Latest news', 'Gift cards', 'More'] },
        { label: 'Account', subItems: ['Profile', 'My bookings', 'My favorites', 'My history', 'Notifications & alerts', 'Messages', 'Settings', 'Booking management'] },
        { label: 'Spots', subItems: ['All spots', 'Popular spots', 'Categories', 'Search', 'Interactive map', 'Spot management', 'Poppy\'s guide & tips', 'Poppy\'s pick'] },
        { label: 'About us', subItems: ['Our story', 'Official partners', 'Privacy policy', 'Terms & conditions', 'Merchandise'] },
        { label: 'Contact', subItems: [] }  // No sub-items for Contact
      ]
    };
  },
  methods: {
    // Method to update the active menu
    setActiveMenu(label) {
      this.activeMenu = label;   // Set the clicked menu as active
    }
  }
};
</script>

<style scoped>
/* Style for the navbar */
.navbar {
  background-color: #f8f9fa;
}

/* Style for the active menu item */
.navbar-nav .active .nav-link {
  background-color: #007bff;  /* Change background color when active */
  color: white;
}
</style>
