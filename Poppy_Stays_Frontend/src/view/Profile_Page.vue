<template>
  <div class="profile-container">
    <h2>Your Profile</h2>
    
    <!-- Profile Picture -->
    <div class="profile-info">
      <!-- Display profile picture, fallback to default if not set -->
      <img :src="profilePic || defaultProfilePic" alt="Profile Picture" class="profile-pic" />
      <div class="profile-details">
        <h3>{{ user.name }}</h3>
        <p>{{ user.email }}</p>
        <p>{{ user.bio || 'No bio yet' }}</p>
        <p>Role: {{ user.role }}</p>
      </div>
    </div>

    <!-- Profile Picture Change -->
    <div class="change-profile-pic">
      <h4>Change Profile Picture</h4>
      <input type="file" @change="updateProfilePic" accept="image/*" />
      <input type="url" v-model="newProfilePicUrl" placeholder="Or paste image URL" />
      <button @click="saveProfilePic">Save Profile Picture</button>
    </div>

    <!-- Bio Update -->
    <div class="update-bio">
      <h4>Update Bio</h4>
      <textarea v-model="bio" placeholder="Write a short bio..."></textarea>
      <button @click="saveBio">Save Bio</button>
    </div>

    <!-- Become an Owner Section -->
    <div v-if="user.role === 'user'" class="become-owner">
      <h4>Become an Owner</h4>
      <div v-if="ownerText">
        <p>{{ ownerText }}</p>
        <input type="text" v-model="ownerName" placeholder="Owner Name" />
        <button @click="becomeOwner">Submit</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  setup() {
    const user = ref({
      name: 'John Doe', // Example, replace with data from the backend
      email: 'john.doe@example.com', // Example
      bio: '', // Example
      role: 'user', // Example, could be 'user' or 'owner' based on the database
    });

    const profilePic = ref('');
    const newProfilePicUrl = ref('');
    const bio = ref(user.value.bio);
    const ownerName = ref('');
    const ownerText = ref('');
    const defaultProfilePic = "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTlPXfF0WJ50lrlaMBndJ-uar2i2q4YcPmStp9d7oeKOpigJ6g7"; // Default profile pic URL

    // Fetch the owner text from the file (you'll need to implement this via API)
    onMounted(async () => {
      const response = await fetch('public/text_files/owner.txt');
      if (response.ok) {
        ownerText.value = await response.text();
      }
    });

    // Update profile picture logic
    const updateProfilePic = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          profilePic.value = e.target.result; // Set the new profile pic
        };
        reader.readAsDataURL(file);
      }
    };

    const saveProfilePic = () => {
      // Save the profile picture URL (you would save this to the backend in real use)
      if (newProfilePicUrl.value) {
        profilePic.value = newProfilePicUrl.value;
      }
      alert('Profile picture updated!');
    };

    // Update bio logic
    const saveBio = () => {
      user.value.bio = bio.value;
      alert('Bio updated!');
      // You would also send the new bio to the backend here
    };

    // Become an owner logic
    const becomeOwner = () => {
      if (!ownerName.value) {
        alert('Please enter an owner name.');
        return;
      }

      // Here you would send the owner name to the backend to update the user's role
      user.value.role = 'owner';
      alert(`Congratulations, ${ownerName.value}! You are now an owner.`);
    };

    return {
      user,
      profilePic,
      newProfilePicUrl,
      bio,
      ownerName,
      ownerText,
      defaultProfilePic, // Make sure to return the default profile picture URL
      updateProfilePic,
      saveProfilePic,
      saveBio,
      becomeOwner,
    };
  },
};
</script>

<style scoped>
/* Global font settings for better readability */
body, .profile-container {
  font-family: 'Roboto', Arial, sans-serif; /* Use a modern, clean font */
  color: #333; /* Dark color for readability */
}

/* Profile page styles */
.profile-container {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.profile-info {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.profile-pic {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}

.profile-details h3 {
  margin: 0;
  font-size: 1.5rem;
}

.profile-details p {
  margin: 5px 0;
  font-size: 1rem;
}

.change-profile-pic,
.update-bio,
.become-owner {
  margin-top: 20px;
}

textarea {
  width: 100%;
  height: 100px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
}

button {
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
}

button:hover {
  background-color: #45a049;
}

/* Preventing the active navbar link turning green unexpectedly */
.navbar a.router-link-exact-active {
  background-color: #333; /* Match your theme */
  color: white;
}

.navbar a.router-link-active {
  background-color: #444; /* Subtle active state background */
  color: white;
}

.navbar a {
  text-decoration: none;
  color: #333;
}

.navbar a:hover {
  background-color: #444;
  color: white;
}
</style>
