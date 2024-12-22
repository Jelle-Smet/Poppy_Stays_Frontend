<template>
  <header>
    <!-- Navbar: Logo and Categories -->
    <nav class="navbar navbar-light bg-dark fixed-top">
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
              <!-- Updated to use router-link for navigating to the sign-up/log-in page -->
              <li>
                <router-link to="/" class="dropdown-item"> Home Page </router-link> <!-- link to the home page-->
              </li>
              <li>
                <router-link to="/sign-up-login" class="dropdown-item">Sign Up / Login</router-link>
              </li>
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
              <li>
                <router-link to="/profile"  class="dropdown-item">Profile</router-link> <!-- Link to the Profile page -->
              </li>
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
              <li>
                <router-link to="/all-spots" class="dropdown-item">All Spots</router-link>
              </li>
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
/* Navbar background color */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: auto;
  z-index: 999;
  background-color: #1c1c1c; /* Dark background */
  padding: 0;
  border-bottom: 2px solid #fff; /* Border for the navbar */
}

/* Logo styling */
.navbar .logo-container {
  margin-right: 0px;
}

.navbar .logo {
  width: 150px;
  height: auto;
}

/* Categories listed vertically */
.navbar-nav {
  display: flex;
  flex-direction: column;
  margin-top: 10px;
}

/* Styling for each category */
.navbar-nav .category {
  border: 2px solid white;
  padding: 10px 20px;
  margin-bottom: 10px;
  border-radius: 5px;
  width: auto;
}

/* Dropdown menu styling */
.nav-item .dropdown-menu {
  border: 1px solid #ddd;
  border-radius: 5px;
}

/* Hover effect for dropdown items - same color as main categories */
.nav-item .dropdown-menu .dropdown-item:hover {
  background-color: #343a40; /* Dark background for hover */
  color: white !important; /* White text color */
  border-color: #bbb; /* Border color on hover */
}

/* Dark background and white text for the selected menu */
.nav-item.bg-dark .nav-link {
  background-color: #343a40 !important;
  color: white !important;
}

/* Text color for navbar items */
.nav-item .nav-link {
  color: #e0e0e0 !important; /* Light text color */
}

/* Active state text color */
.nav-item.bg-dark .nav-link {
  color: white !important;
}

/* Dropdown items text color */
.nav-item .dropdown-menu .dropdown-item {
  color: #333 !important;
}

/* Apply hover effect for main categories */
.nav-item .nav-link:hover {
  background-color: #343a40; /* Same dark background for hover */
  color: white !important; /* White text on hover */
}
</style>
