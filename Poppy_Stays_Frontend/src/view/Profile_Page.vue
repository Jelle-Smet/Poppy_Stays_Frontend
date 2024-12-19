<template>
  <div class="profile-container">
    <h2>Your Profile</h2>
    
    <!-- Profile Picture -->
    <div class="profile-info">
      <!-- Display profile picture, fallback to default if not set -->
      <img :src="profilePic || defaultProfilePic" alt="Profile Picture" class="profile-pic" />
      <div class="profile-details">
        <h3>{{ user.firstName }} {{ user.lastName }}</h3>
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
      firstName: '',
      lastName: '',
      email: '',
      bio: '',
      role: '',
    });

    const profilePic = ref('');
    const newProfilePicUrl = ref('');
    const bio = ref('');
    const ownerName = ref('');
    const ownerText = ref('');
    const defaultProfilePic = "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTlPXfF0WJ50lrlaMBndJ-uar2i2q4YcPmStp9d7oeKOpigJ6g7"; // Default profile pic URL

    // Fetch user profile data from backend
    onMounted(async () => {
      try {
        const token = localStorage.getItem('authToken'); // Assuming token is stored in localStorage
        const response = await fetch('http://localhost:3000/api/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch user profile');
        }

        const data = await response.json();
        user.value = {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          bio: data.bio || 'No bio yet',
          role: data.role,
        };
        profilePic.value = data.profilePic || defaultProfilePic;

        // Fetch owner text from the public folder
        const textResponse = await fetch('public/text_files/owner.txt');
        if (textResponse.ok) {
          ownerText.value = await textResponse.text();
        } else {
          console.error('Failed to load owner text');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
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

    const saveProfilePic = async () => {
      // Save the profile picture URL (you would save this to the backend in real use)
      if (newProfilePicUrl.value) {
        profilePic.value = newProfilePicUrl.value;
      }
      // Send updated profile picture to backend
      try {
        const token = localStorage.getItem('authToken');
        await fetch('http://localhost:3000/api/profile/picture', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ pictureUrl: profilePic.value }),
        });
        alert('Profile picture updated!');
      } catch (error) {
        console.error('Error saving profile picture:', error);
        alert('Failed to update profile picture.');
      }
    };

    // Update bio logic (now updates bio instantly)
    const saveBio = async () => {
      try {
        const token = localStorage.getItem('authToken');
        await fetch('http://localhost:3000/api/profile/bio', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ bio: bio.value }),
        });

        // Update the bio immediately in the frontend
        user.value.bio = bio.value; // Instant update on the frontend

        alert('Bio updated!');
      } catch (error) {
        console.error('Error saving bio:', error);
        alert('Failed to update bio.');
      }
    };

    // Become an owner logic
    const becomeOwner = async () => {
      if (!ownerName.value) {
        alert('Please enter an owner name.');
        return;
      }

      // Send the owner name to the backend to update the user's role
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('http://localhost:3000/api/become-owner', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ownerName: ownerName.value }),
        });

        const result = await response.json();

        if (response.ok) {
          user.value.role = 'owner'; // Update role locally
          alert(`Congratulations, ${ownerName.value}! You are now an owner.`);
        } else {
          alert(result.message || 'Failed to become an owner.');
        }
      } catch (error) {
        console.error('Error becoming owner:', error);
        alert('Failed to become an owner.');
      }
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
