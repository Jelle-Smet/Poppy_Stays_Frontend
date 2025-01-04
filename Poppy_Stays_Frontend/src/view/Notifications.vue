<template>
  <div class="container mt-4">
    <h2 class="text-center mb-4">Notifications</h2>

    <!-- Section to display loading spinner while fetching notifications -->
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Loading notifications...</p>
    </div>

    <!-- Section to display error messages if any -->
    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <!-- Main notifications container -->
    <div v-else class="notifications-container">
      <!-- Navigation buttons for switching between read and unread notifications -->
      <div class="button-group">
        <button
          @click="setActiveTab('unread')"
          :class="['tab-button', { active: currentTab === 'unread' }]"
        >
          New Notifications
          <!-- Badge showing count of unread notifications -->
          <span v-if="unreadNotifications.length" class="badge">
            {{ unreadNotifications.length }}
          </span>
        </button>
        <button
          @click="setActiveTab('read')"
          :class="['tab-button', { active: currentTab === 'read' }]"
        >
          Read Notifications
        </button>
      </div>

      <!-- Container for notification cards -->
      <div class="notifications-grid">
        <!-- Display unread notifications -->
        <div v-if="currentTab === 'unread'" class="notification-list">
          <!-- Show message if no unread notifications -->
          <div v-if="unreadNotifications.length === 0" class="empty-state">
            No new notifications
          </div>
          <!-- Loop through unread notifications -->
          <div
            v-for="notification in unreadNotifications"
            :key="notification.notificationId"
            class="notification-card unread"
          >
            <div class="notification-content">
              <p>{{ notification.content }}</p>
              <span class="notification-time">{{ formatDate(notification.time) }}</span>
            </div>
            <button
              @click="markAsRead(notification.notificationId)"
              class="mark-read-button"
            >
              Mark as Read
            </button>
          </div>
        </div>

        <!-- Display read notifications -->
        <div v-if="currentTab === 'read'" class="notification-list">
          <!-- Show message if no read notifications -->
          <div v-if="readNotifications.length === 0" class="empty-state">
            No read notifications
          </div>
          <!-- Loop through read notifications -->
          <div
            v-for="notification in readNotifications"
            :key="notification.notificationId"
            class="notification-card"
          >
            <div class="notification-content">
              <p>{{ notification.content }}</p>
              <span class="notification-time">{{ formatDate(notification.time) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';

export default {
  setup() {
    // Reactive variables for component state
    const loading = ref(false);
    const error = ref(null);
    const currentTab = ref('unread');
    const readNotifications = ref([]);
    const unreadNotifications = ref([]);
    const token = localStorage.getItem("authToken");

    // Function to format date to readable string
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    // Function to switch between tabs
    const setActiveTab = (tab) => {
      currentTab.value = tab;
    };

    // Function to fetch notifications from API
    const fetchNotifications = async () => {
      loading.value = true;
      try {

        console.log ("Token = " + token);
        const response = await axios.post('http://localhost:3000/api/Notifications', {}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        readNotifications.value = response.data.readNotifications || [];
        unreadNotifications.value = response.data.unreadNotifications || [];
        error.value = null;
      } catch (err) {
        console.error('Error fetching notifications:', err);
        error.value = 'Failed to load notifications. Please try again later.';
      } finally {
        loading.value = false;
      }
    };

    // Function to mark a notification as read
    const markAsRead = async (notificationId) => {
      try {

        if (!token) {
          throw new Error('User not authenticated. Token missing.');
        }

        // Make the API call to mark the notification as read
        await axios.post( 'http://localhost:3000/api/mark-notification-read', { notificationId }, // Pass the notification ID in the request body
          {
            headers: {
              'Authorization': `Bearer ${token}` // Attach the token in the Authorization header
            }
          }
        );

        // Update local state
        const notification = unreadNotifications.value.find(
          n => n.notificationId === notificationId
        );

        // Remove the notification from unread notifications
        unreadNotifications.value = unreadNotifications.value.filter(
          n => n.notificationId !== notificationId
        );

        // Add the notification to read notifications
        if (notification) {
          readNotifications.value.unshift(notification);
        }
      } catch (err) {
        console.error(err);
        error.value = 'Failed to mark notification as read. Please try again.';
      }
    };


    // Fetch notifications when component mounts
    onMounted(fetchNotifications);

    return {
      loading,
      error,
      currentTab,
      readNotifications,
      unreadNotifications,
      formatDate,
      setActiveTab,
      markAsRead
    };
  }
};
</script>

<style scoped>
/* Container styling */
.notifications-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

/* Loading state styling */
.loading {
  text-align: center;
  padding: 40px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  margin: 0 auto 20px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Error message styling */
.error-message {
  background-color: #fee2e2;
  color: #dc2626;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
  margin: 20px 0;
}

/* Button group styling */
.button-group {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 30px;
  position: sticky;
  top: 20px;
  background-color: white;
  padding: 10px 0;
  z-index: 1000;
}

/* Tab button styling */
.tab-button {
  padding: 10px 20px;
  border: 2px solid #3498db;
  border-radius: 8px;
  background-color: white;
  color: #3498db;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.tab-button.active {
  background-color: #3498db;
  color: white;
}

.tab-button:hover {
  background-color: #3498db;
  color: white;
}

/* Badge styling */
.badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: #dc2626;
  color: white;
  border-radius: 50%;
  padding: 4px 8px;
  font-size: 12px;
}

/* Notification card styling */
.notification-card {
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  transition: transform 0.2s ease;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.notification-card:hover {
  transform: translateX(5px);
}

.notification-card.unread {
  border-left: 4px solid #3498db;
  background-color: #f8fafc;
}

/* Notification content styling */
.notification-content {
  flex-grow: 1;
  margin-right: 20px;
}

.notification-content p {
  margin: 0 0 5px 0;
  color: #1f2937;
}

.notification-time {
  font-size: 0.85rem;
  color: #6b7280;
}

/* Mark as read button styling */
.mark-read-button {
  padding: 6px 12px;
  background-color: transparent;
  border: 1px solid #3498db;
  color: #3498db;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.mark-read-button:hover {
  background-color: #3498db;
  color: white;
}

/* Empty state styling */
.empty-state {
  text-align: center;
  color: #6b7280;
  padding: 40px;
  background-color: #f9fafb;
  border-radius: 8px;
  margin-top: 20px;
}
</style>
