<template>
  <header>
    <!-- Navbar: Logo and Categories -->
    <nav class="navbar navbar-light bg-dark fixed-top">
      <div class="container-fluid">
        <!-- Logo: Positioned in the top left corner -->
        <a class="navbar-brand logo-container" href="#">
          <!-- Image for the logo -->
          <img src="@/assets/images/Poppy_stays_Long.png" alt="Logo" class="logo" />
        </a>

        <!-- Main categories listed vertically under the logo -->
        <div class="navbar-nav">
          <!-- Home category, which has sub-menu items -->
          <li class="nav-item category" :class="{ 'bg-dark': selectedMenu === 'home' }">
            <a class="nav-link dropdown-toggle" href="#" @click="toggleSubMenu('home')">
              Home
            </a>
            <!-- Sub-menu for Home, which will only show when 'home' is selected -->
            <ul v-if="selectedMenu === 'home'" class="dropdown-menu">
              <li>
                <!-- Link to the Home Page -->
                <router-link to="/" class="dropdown-item"> Home Page </router-link>
              </li>
              <li>
                <!-- Link to the Sign-Up / Login page -->
                <router-link to="/sign-up-login" class="dropdown-item">Sign Up / Login</router-link>
              </li>
              <li>
                <router-link to="/Poppy's_Promotions" class="dropdown-item" href="#">Special Offers</router-link>
              </li>
              <li>
                <router-link to="/Latest_News" class="dropdown-item" href="#">Latest News</router-link>
              </li>
              <li>
                <router-link to="/Gift-Cards" class="dropdown-item" href="#">Gift Cards</router-link>
              </li>
              <li>
                <router-link to="/More" class="dropdown-item" href="#">More</router-link>
              </li>
            </ul>
          </li>

          <!-- Account category, with sub-menu items that show when the account section is selected -->
          <li class="nav-item category" :class="{ 'bg-dark': selectedMenu === 'account' }">
            <a class="nav-link dropdown-toggle" href="#" @click="toggleSubMenu('account')">
              Account
            </a>
            <!-- Sub-menu for Account -->
            <ul v-if="selectedMenu === 'account'" class="dropdown-menu">
              <li>
                <!-- Link to the Profile page -->
                <router-link to="/profile" class="dropdown-item">Profile</router-link>
              </li>
              <li>
                <router-link to="/upcoming_bookings" class="dropdown-item">My Bookings</router-link>
              </li>
              <li>
                <router-link to="/spot/favorite" class="dropdown-item">My Favorites</router-link>
              </li>
              <li>
                <router-link to="/past-cancelled-bookings" class="dropdown-item">My History</router-link>
              </li>
              <li>
                <router-link to="/Notifications" class="dropdown-item" href="#">Notifications & Alerts</router-link>
              </li>
              <li><a class="dropdown-item" href="#">Messages</a></li>
              <li>
                <router-link to="/settings" class="dropdown-item" href="#">Settings</router-link>
              </li>
              <!-- 'Booking Management' moved to the new 'Management' category -->
            </ul>
          </li>

          <!-- New Management category -->
          <li class="nav-item category" :class="{ 'bg-dark': selectedMenu === 'management' }">
            <a class="nav-link dropdown-toggle" href="#" @click="toggleSubMenu('management')">
              Management
            </a>
            <!-- Sub-menu for Management -->
            <ul v-if="selectedMenu === 'management'" class="dropdown-menu">
              <li>
                <!-- Link to Booking Management page -->
                <router-link to="/Booking_Management" class="dropdown-item" > Booking Management</router-link>
              </li>
              <li>
                <!-- Link to Spot Management page -->
                <router-link to="/spot-overview" class="dropdown-item">Spot Management</router-link>
              </li>
              <li>
                <!-- Link to Add Spot page -->
                <router-link to= "/add-spot" class="dropdown-item"> Add a Spot</router-link>
              </li>
              <li>
                <!-- Link to Delete Spot page -->
                <router-link to="/spot/delete-overview" class="dropdown-item"> Delete a Spot</router-link>
              </li>
            </ul>
          </li>

          <!-- Spots category, with sub-menu items for spots-related sections -->
          <li class="nav-item category" :class="{ 'bg-dark': selectedMenu === 'spots' }">
            <a class="nav-link dropdown-toggle" href="#" @click="toggleSubMenu('spots')">
              Spots
            </a>
            <!-- Sub-menu for Spots -->
            <ul v-if="selectedMenu === 'spots'" class="dropdown-menu">
              <li>
                <!-- Link to All Spots page -->
                <router-link to="/all-spots" class="dropdown-item">All Spots</router-link>
              </li>
              <li>
                <router-link to="/top-booked" class="dropdown-item">Popular Spots</router-link>
              </li>
              <li>
                <!-- Link to Categories page -->
                <router-link class="dropdown-item" to="/categories">Categories</router-link>
              </li>
              <li>
                <!-- Link to Owners page -->
                <router-link class="dropdown-item" to="/owner-spots">Owners</router-link>
              </li>
              <li>
                <router-link to="/Search-Spots" class="dropdown-item" href="#">Search Spots</router-link>
              </li>
              <li>
                <router-link to="/Interactive-Map" class="dropdown-item" >Interactive Map</router-link>
              </li>
              <li>
                <router-link to="/Poppy's-Tips-&-Tricks" class="dropdown-item" href="#">Poppy's Guide: Tips & Tricks</router-link>
              </li>
              <li>
                <router-link to="/Poppys-Pick" class="dropdown-item" >Poppy's Pick</router-link>
              </li>
            </ul>
          </li>

          <!-- About Us category, with sub-menu items -->
          <li class="nav-item category" :class="{ 'bg-dark': selectedMenu === 'aboutUs' }">
            <a class="nav-link dropdown-toggle" href="#" @click="toggleSubMenu('aboutUs')">
              About Us
            </a>
            <!-- Sub-menu for About Us -->
            <ul v-if="selectedMenu === 'aboutUs'" class="dropdown-menu">
              <li>
                <router-link to="/Our_Story" class="dropdown-item" href="#">Our Story</router-link>
              </li>
              <li>
                <router-link to="/Official-Partners" class="dropdown-item" href="#">Official Partners</router-link>
              </li>
              <li>
                <router-link to="/privacy-policy" class="dropdown-item" href="#">Privacy Policy</router-link>
              </li>
              <li>
                <router-link to="/terms-and-conditions" class="dropdown-item" href="#">Terms & Conditions</router-link>
              </li>
              <li><a class="dropdown-item" href="#">Merchandise</a></li>
            </ul>
          </li>

          <!-- Contact category -->
          <li class="nav-item category">
            <a class="nav-link" href="#">Contact</a>
          </li>
        </div>
        <!-- Logo: Positioned in the top left corner -->
        <a class="extra space" href="#">
          <!-- Image for the logo -->

        </a>
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
      selectedMenu: null, // To track which category is selected
    };
  },
  methods: {
    // Method to toggle sub-menu visibility based on selected menu
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
  padding: 0px;
  border: 2px solid #fff; /* Border for the navbar */
  border-radius: 5px;
  border-top-right-radius: 50px;
  border-bottom-right-radius: 50px;
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
