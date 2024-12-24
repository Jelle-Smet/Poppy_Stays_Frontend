<template>
    <!-- Header Section: Contains the navigation bar -->
    <header>
      <!-- Bootstrap Navbar -->
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid">
          <!-- Branding or Logo -->
          <a class="navbar-brand" href="#">Poppy Stays</a>
          
          <!-- Hamburger menu for mobile view -->
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          
          <!-- Menu Items: Will collapse in mobile view -->
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
              
              <!-- Home Menu Item -->
              <li class="nav-item dropdown" :class="{ 'bg-dark': selectedMenu === 'home' }">
                <!-- Home Link: Toggles sub-menu visibility -->
                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownHome" role="button" data-bs-toggle="dropdown" aria-expanded="false" @click="toggleSubMenu('home')">
                  Home
                </a>
                <!-- Home Sub-menu: Shows only when 'home' is selected -->
                <ul v-if="selectedMenu === 'home'" class="dropdown-menu" aria-labelledby="navbarDropdownHome">
                  <!-- Sub-menu items for Home -->
                  <li><a class="dropdown-item" href="#">Sign Up / Login</a></li>
                  <li><a class="dropdown-item" href="#">Special Offers</a></li>
                  <li><a class="dropdown-item" href="#">Latest News</a></li>
                  <li><a class="dropdown-item" href="#">Gift Cards</a></li>
                  <li><a class="dropdown-item" href="#">More</a></li>
                </ul>
              </li>
  
              <!-- Account Menu Item -->
              <li class="nav-item dropdown" :class="{ 'bg-dark': selectedMenu === 'account' }">
                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownAccount" role="button" data-bs-toggle="dropdown" aria-expanded="false" @click="toggleSubMenu('account')">
                  Account
                </a>
                <!-- Account Sub-menu -->
                <ul v-if="selectedMenu === 'account'" class="dropdown-menu" aria-labelledby="navbarDropdownAccount">
                  <!-- Sub-menu items for Account -->
                  <li><a class="dropdown-item" href="#">Profile</a></li>
                  <li><a class="dropdown-item" href="#">My Bookings</a></li>
                  <li><a class="dropdown-item" href="#">My Favorites</a></li>
                  <li><a class="dropdown-item" href="#">My History</a></li>
                  <li><a class="dropdown-item" href="#">Notifications & Alerts</a></li>
                  <li><a class="dropdown-item" href="#">Messages</a></li>
                  <li><a class="dropdown-item" href="#">Settings</a></li>
                  <li><a class="dropdown-item" href="#">Booking Management</a></li>
                </ul>
              </li>
  
              <!-- Spots Menu Item -->
              <li class="nav-item dropdown" :class="{ 'bg-dark': selectedMenu === 'spots' }">
                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownSpots" role="button" data-bs-toggle="dropdown" aria-expanded="false" @click="toggleSubMenu('spots')">
                  Spots
                </a>
                <!-- Spots Sub-menu -->
                <ul v-if="selectedMenu === 'spots'" class="dropdown-menu" aria-labelledby="navbarDropdownSpots">
                  <!-- Sub-menu items for Spots -->
                  <li><a class="dropdown-item" href="#">All Spots</a></li>
                  <li><a class="dropdown-item" href="#">Popular Spots</a></li>
                  <li><a class="dropdown-item" href="#">Categories</a></li>
                  <li><a class="dropdown-item" href="#">Search</a></li>
                  <li><a class="dropdown-item" href="#">Interactive Map</a></li>
                  <li><a class="dropdown-item" href="#">Spot Management</a></li>
                  <li><a class="dropdown-item" href="#">Poppy's Guide & Tips</a></li>
                  <li><a class="dropdown-item" href="#">Poppy's Pick</a></li>
                </ul>
              </li>
  
              <!-- About Us Menu Item -->
              <li class="nav-item dropdown" :class="{ 'bg-dark': selectedMenu === 'aboutUs' }">
                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownAboutUs" role="button" data-bs-toggle="dropdown" aria-expanded="false" @click="toggleSubMenu('aboutUs')">
                  About Us
                </a>
                <!-- About Us Sub-menu -->
                <ul v-if="selectedMenu === 'aboutUs'" class="dropdown-menu" aria-labelledby="navbarDropdownAboutUs">
                  <!-- Sub-menu items for About Us -->
                  <li><a class="dropdown-item" href="#">Our Story</a></li>
                  <li><a class="dropdown-item" href="#">Official Partners</a></li>
                  <li><a class="dropdown-item" href="#">Privacy Policy</a></li>
                  <li><a class="dropdown-item" href="#">Terms & Conditions</a></li>
                  <li><a class="dropdown-item" href="#">Merchandise</a></li>
                </ul>
              </li>
  
              <!-- Contact Menu Item: No sub-menu -->
              <li class="nav-item">
                <a class="nav-link" href="#">Contact</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  </template>
  
  <script>
  // Vue Component Logic
  export default {
    // Data section: Initializes selectedMenu to null
    data() {
      return {
        selectedMenu: null, // Tracks the currently open menu (Home, Account, etc.)
      };
    },
    methods: {
      // Method to toggle sub-menu visibility
      toggleSubMenu(menu) {
        // If the clicked menu is already open, close it by setting selectedMenu to null
        if (this.selectedMenu === menu) {
          this.selectedMenu = null; // Close the menu
        } else {
          // Otherwise, open the clicked menu
          this.selectedMenu = menu; // Open the clicked menu
        }
      },
    },
  };
  </script>
  
  <style scoped>
  /* Scoped styles for the Header */
  
  /* Header Border */
  header {
    border-bottom: 2px solid #ccc; /* Light grey border under the header */
  }
  
  /* Navbar Items Border */
  .navbar-nav .nav-item {
    border-right: 1px solid #ddd; /* Border for each item */
  }
  
  /* Remove border from the last nav item */
  .navbar-nav .nav-item:last-child {
    border-right: none;
  }
  
  /* Darker background for selected menu item */
  .nav-item.bg-dark .nav-link {
    background-color: #343a40 !important; /* Dark background color for selected item */
    color: white; /* White text for selected item */
  }
  
  /* Style for dropdown menus */
  .nav-item .dropdown-menu {
    border-radius: 0; /* Remove rounded corners for a boxy look */
    box-shadow: none; /* Remove the default shadow */
  }
  </style>
  