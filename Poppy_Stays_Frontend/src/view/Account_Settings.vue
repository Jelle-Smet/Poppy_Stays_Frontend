<template>
  <div class="settings-container">
    <h2>Account Settings</h2>
    <p>Manage your account settings, including email, password, and personal information.</p>
    <!-- Display User's Current Info -->
    <div class="user-info">
      <h4>Personal Information</h4>
      <p><strong>First Name:</strong> {{ userInfo.firstName }}</p>
      <p><strong>Last Name:</strong> {{ userInfo.lastName }}</p>
      <p><strong>Phone Number:</strong> {{ phoneNumber }}</p>
      <p><strong>Email:</strong> {{ email }}</p>
      <p><strong>Address:</strong> {{ address }}</p>
    </div>

    <!-- Update Email -->
    <div class="update-email">
      <h4>Change Email Address</h4>
      <p>Update the email address associated with your account. A verification link will be sent to your new email address to confirm the change.</p>
      <input type="email" v-model="email" placeholder="New Email" />
      <button @click="saveEmail">Save Email</button>
    </div>

    <!-- Update Password -->
    <div class="update-password">
      <h4>Change Password</h4>
      <p>Keep your account secure by updating your password. Enter your current password, then create a new one to keep your account protected.</p>
      <input type="password" v-model="currentPassword" placeholder="Current Password" />
      <input type="password" v-model="password" placeholder="New Password" />
      <input type="password" v-model="confirmPassword" placeholder="Confirm New Password" />
      <button @click="savePassword">Save Password</button>
    </div>

    <!-- Update Address -->
    <div class="update-address">
      <h4>Update Address</h4>
      <p>Update the address associated with your account. Ensure it's up to date for communication and billing purposes.</p>
      <textarea v-model="address" placeholder="New Address"></textarea>
      <button @click="saveAddress">Save Address</button>
    </div>

    <!-- Update Phone Number -->
    <div class="update-phone">
      <h4>Update Phone Number</h4>
      <p>Update your phone number for quicker communication and emergency alerts.</p>
      <input type="text" v-model="phoneNumber" placeholder="New Phone Number" />
      <button @click="savePhoneNumber">Save Phone Number</button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  setup() {
    const email = ref('');
    const currentPassword = ref('');
    const password = ref('');
    const confirmPassword = ref('');
    const address = ref('');
    const phoneNumber = ref('');
    const userInfo = ref({
      firstName: '',
      lastName: '',
      role: '',
      profilePic: '',
      bio: ''
    });

    // Fetch user profile data from backend on page load
    onMounted(async () => {
      try {
        const token = localStorage.getItem('authToken'); // Get token from localStorage
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
        email.value = data.email;
        address.value = data.address || ''; // Ensure the field is populated
        phoneNumber.value = data.phoneNumber || ''; // Same for phone number
        userInfo.value = {
          firstName: data.firstName,
          lastName: data.lastName,
          role: data.role,
          profilePic: data.profilePic,
          bio: data.bio
        };
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    });

    // Save updated email to backend
    const saveEmail = async () => {
      try {
        const token = localStorage.getItem('authToken');
        await fetch('http://localhost:3000/api/profile/email', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: email.value }),
        });

        alert('Email updated successfully!');
      } catch (error) {
        console.error('Error updating email:', error);
        alert('Failed to update email.');
      }
    };

    // Save updated password to backend
    const savePassword = async () => {
      if (password.value !== confirmPassword.value) {
          alert('Passwords do not match.');
          return;
      }

      try {
          const token = localStorage.getItem('authToken');  // Get token from localStorage
          const response = await fetch('http://localhost:3000/api/profile/password', {
              method: 'PUT',
              headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  currentPassword: currentPassword.value,
                  newPassword: password.value
              }),
          });

          if (!response.ok) {
              throw new Error('Failed to update password');
          }

          alert('Password updated successfully!');
      } catch (error) {
          console.error('Error updating password:', error);
          alert('Failed to update password.');
      }
  };

    // Save updated address to backend
    const saveAddress = async () => {
      try {
        const token = localStorage.getItem('authToken');
        await fetch('http://localhost:3000/api/profile/address', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ address: address.value }),
        });

        alert('Address updated successfully!');
      } catch (error) {
        console.error('Error updating address:', error);
        alert('Failed to update address.');
      }
    };

    // Save updated phone number to backend
    const savePhoneNumber = async () => {
      try {
        const token = localStorage.getItem('authToken');
        await fetch('http://localhost:3000/api/profile/phone-number', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ phoneNumber: phoneNumber.value }),
        });

        alert('Phone number updated successfully!');
      } catch (error) {
        console.error('Error updating phone number:', error);
        alert('Failed to update phone number.');
      }
    };

    return {
      email,
      currentPassword,
      password,
      confirmPassword,
      address,
      phoneNumber,
      userInfo,
      saveEmail,
      savePassword,
      saveAddress,
      savePhoneNumber,
    };
  },
};
</script>

<style scoped>
.user-info{
  border: 2px solid black;
  border-radius: 25px;
  padding: 5px;
}

.settings-container {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  color: black;
}

input, textarea {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
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

h4 {
  margin-top: 20px;
  font-size: 1.2rem;
}

p {
  font-size: 0.9rem;
  color: #555;
}

textarea {
  min-height: 100px;
}
</style>
