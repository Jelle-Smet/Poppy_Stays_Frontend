<template>
  <!-- Dropdown menu for each menu item -->
  <li class="nav-item dropdown" :class="{ active: isActive }">
    <!-- Button that triggers the dropdown -->
    <a
      class="nav-link dropdown-toggle"
      href="#"
      role="button"
      data-bs-toggle="dropdown"
      aria-expanded="false"
    >
      {{ item.label }}
    </a>
    <!-- Dropdown menu items -->
    <ul class="dropdown-menu" v-if="isActive">
      <li v-for="(subItem, index) in item.subItems" :key="index">
        <a class="dropdown-item" href="#">{{ subItem }}</a>
        <!-- Display each sub-item -->
      </li>
    </ul>
  </li>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true, // The item prop contains the menu label and its sub-items
    },
    active: {
      type: Boolean,
      required: true, // Determines if this menu item is active
    },
  },
  computed: {
    // Computed property to check if the current menu item is active
    isActive() {
      return this.active
    },
  },
  methods: {
    // Method to handle sub-menu interactions (optional)
  },
}
</script>

<style scoped>
/* Style for the active menu item, which changes the background color */
.active .nav-link {
  background-color: #007bff; /* Highlight the active item */
  color: white;
}
</style>
