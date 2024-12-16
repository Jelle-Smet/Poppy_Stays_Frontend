<template>
  <header>
    <!-- Navbar: Logo and Categories -->
    <nav class="navbar navbar-light bg-light fixed-top">
      <div class="container-fluid">
        <!-- Logo: Positioned in the top left corner -->
        <a class="navbar-brand logo-container" href="#">
          <img src="https://media.discordapp.net/attachments/1294686189789515828/1318276575879237662/facebook_profile_image.png?ex=6761bc3c&is=67606abc&hm=c7b4e791d406a0525b41e8c8e9eab8f76da014f447d9aa0b821533a0374d9ca2&=&format=webp&quality=lossless&width=671&height=671" alt="Logo" class="logo" />
        </a>

        <!-- Main categories listed vertically under the logo -->
        <div class="navbar-nav">
          <li class="nav-item category" :class="{ 'bg-dark': selectedMenu === 'home' }">
            <a class="nav-link dropdown-toggle" href="#" @click="toggleSubMenu('home')">
              Home
            </a>
            <ul v-if="selectedMenu === 'home'" class="dropdown-menu">
              <li><a class="dropdown-item" href="#">Sign Up / Login</a></li>
              <li><a class="dropdown-item" href="#">Special Offers</a></li>
              <li><a class="dropdown-item" href="#">Latest News</a></li>
              <li><a class="dropdown-item" href="#">Gift Cards</a></li>
              <li><a class="dropdown-item" href="#">More</a></li>
            </ul>
          </li>
          <li class="nav-item category" :class="{ 'bg-dark': selectedMenu === 'account' }">
            <a class="nav-link dropdown-toggle" href="#" @click="toggleSubMenu('account')">
              Account
            </a>
            <ul v-if="selectedMenu === 'account'" class="dropdown-menu">
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
          <li class="nav-item category" :class="{ 'bg-dark': selectedMenu === 'spots' }">
            <a class="nav-link dropdown-toggle" href="#" @click="toggleSubMenu('spots')">
              Spots
            </a>
            <ul v-if="selectedMenu === 'spots'" class="dropdown-menu">
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
          <li class="nav-item category" :class="{ 'bg-dark': selectedMenu === 'aboutUs' }">
            <a class="nav-link dropdown-toggle" href="#" @click="toggleSubMenu('aboutUs')">
              About Us
            </a>
            <ul v-if="selectedMenu === 'aboutUs'" class="dropdown-menu">
              <li><a class="dropdown-item" href="#">Our Story</a></li>
              <li><a class="dropdown-item" href="#">Official Partners</a></li>
              <li><a class="dropdown-item" href="#">Privacy Policy</a></li>
              <li><a class="dropdown-item" href="#">Terms & Conditions</a></li>
              <li><a class="dropdown-item" href="#">Merchandise</a></li>
            </ul>
          </li>
          <li class="nav-item category">
            <a class="nav-link" href="#">Contact</a>
          </li>
        </div>
      </div>
    </nav>
  </header>

  <!-- Page Content -->
  <div class="content">
    <!-- Your page content goes here -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedMenu: null,
    };
  },
  methods: {
    toggleSubMenu(menu) {
      this.selectedMenu = this.selectedMenu === menu ? null : menu;
    },
  },
};
</script>

<style scoped>
/* Navbar takes full width and stays fixed at the top */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: auto; /* Ensure it doesn't stretch across the full width */
  z-index: 999; /* Keeps navbar on top */
  background-color: #000000; /* Change this to your preferred background color */
  padding: 0;
  border: 1px solid white
}

/* Logo container with margin to create space between logo and navbar items */
.navbar .logo-container {
  margin-right: 0px; /* Space between logo and navbar items */
}

/* Set the width of the logo */
.navbar .logo {
  width: 150px;
  height: auto;
}

/* Main categories listed vertically under the logo */
.navbar-nav {
  display: flex;
  flex-direction: column; /* Stack categories vertically */
  margin-top: 10px; /* Space from the top of the page */
}

/* Add border to categories */
.navbar-nav .category {
  border: 2px solid white; /* Border around the category */
  padding: 10px 20px;
  margin-bottom: 10px; /* Space between each category */
  border-radius: 5px;
  width: auto; /* Don't take full width */
}

/* Dropdown menu style */
.nav-item .dropdown-menu {
  border: 1px solid #ddd; /* Border around dropdown */
  border-radius: 5px; /* Rounded corners for dropdown */
}

/* Hover effect for dropdown items */
.nav-item .dropdown-menu .dropdown-item:hover {
  background-color: #f8f9fa;
  border-color: #bbb;
}

/* Dark background for selected menu */
.nav-item.bg-dark .nav-link {
  background-color: #343a40 !important;
  color: white;
}

/* Content area should stay below the navbar */
body {
  padding-top: 150px; /* Adjust based on navbar height */
}
</style>
