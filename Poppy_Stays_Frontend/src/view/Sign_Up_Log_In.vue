<template>
  <div class="auth-container">
    <!-- Button Container for toggling between forms -->
    <div class="button-container">
      <!-- Become a Poppyseed Button -->
      <button @click="toggleForm('register')" :class="{ active: currentForm === 'register' }">
        Become a Poppyseed
      </button>
      <!-- Already a Poppyseed Button -->
      <button @click="toggleForm('login')" :class="{ active: currentForm === 'login' }">
        Already a Poppyseed?
      </button>
    </div>

    <!-- Form Container -->
    <div class="form-container">
      <!-- Registration Form, shown when the 'register' form is active -->
      <transition name="fade">
        <form v-if="currentForm === 'register'" @submit.prevent="submitRegister">
          <h2>Join Poppy Stays!</h2>
          <!-- Input fields for Registration -->
          <input type="text" v-model="registerForm.firstName" placeholder="First Name" required />
          <input type="text" v-model="registerForm.lastName" placeholder="Last Name" required />
          <input type="date" v-model="registerForm.dob" placeholder="Date of Birth" required />
          <input type="tel" v-model="registerForm.mobile" placeholder="Mobile Number" required />
          <input type="email" v-model="registerForm.email" placeholder="Email" required />
          <input type="password" v-model="registerForm.password" placeholder="Password" required />
          <input type="text" v-model="registerForm.address" placeholder="Address" required />
          
          <!-- Terms and Conditions Checkbox -->
          <label class="checkbox-container">
            <input type="checkbox" v-model="registerForm.termsAccepted" required />
            <span>I accept the Terms and Conditions and Privacy Policy</span>
          </label>

          <!-- Submit Button for Registration -->
          <button type="submit">Register</button>
        </form>
      </transition>

      <!-- Login Form, shown when the 'login' form is active -->
      <transition name="fade">
        <form v-if="currentForm === 'login'" @submit.prevent="submitLogin">
          <h2>Welcome Back!</h2>
          <!-- Input fields for Login -->
          <input type="text" v-model="loginForm.usernameOrEmail" placeholder="Email or Username" required />
          <input type="password" v-model="loginForm.password" placeholder="Password" required />
          
          <!-- Submit Button for Login -->
          <button type="submit">Log In</button>
        </form>
      </transition>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  setup() {
    // State variable to toggle between the forms (register or login)
    const currentForm = ref(null);

    // Object to hold the values for the registration form
    const registerForm = ref({
      firstName: '',
      lastName: '',
      dob: '',
      mobile: '',
      email: '',
      password: '',
      address: '',
      termsAccepted: false,
    });

    // Object to hold the values for the login form
    const loginForm = ref({
      usernameOrEmail: '',
      password: '',
    });

    // Function to toggle between registration and login forms
    const toggleForm = (formType) => {
      // If the form is already active, close it; otherwise, open the selected form
      currentForm.value = currentForm.value === formType ? null : formType;
    };

    // Function to handle registration form submission (future backend integration)
    const submitRegister = () => {
      console.log('Registering:', registerForm.value);
      // Call backend API to submit registration data here
    };

    // Function to handle login form submission (future backend integration)
    const submitLogin = () => {
      console.log('Logging in:', loginForm.value);
      // Call backend API to submit login data here
    };

    return {
      // Return all reactive data and methods for use in the template
      currentForm,
      registerForm,
      loginForm,
      toggleForm,
      submitRegister,
      submitLogin,
    };
  },
};
</script>

<style scoped>
/* Main container for the authentication section */
.auth-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; /* Centering the content vertically */
  padding: 30px 20px;
  background-color: #f5f5f5; /* Lighter background for the form */
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  margin: 50px auto;
  height: 80vh; /* Allow vertical centering */
}

/* Button container to switch between the register and login forms */
.button-container {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
  justify-content: center; /* Center the buttons horizontally */
}

/* Styling for each button */
button {
  padding: 12px 24px;
  border: 2px solid #ddd; /* Lighter border */
  background: #fff; /* White background for buttons */
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: background 0.3s, color 0.3s;
  min-width: 150px; /* Ensures buttons are not too small */
}

/* Button hover effect */
button:hover {
  background: #e0e0e0; /* Light gray background on hover */
}

/* Active state for buttons when selected */
button.active {
  background: #f0f0f0; /* Slightly darker background for active buttons */
  color: #333; /* Dark text color */
  border-color: #bbb; /* Slightly darker border for active button */
}

/* Form container for the registration and login forms */
.form-container {
  width: 100%;
  display: flex;
  justify-content: center; /* Ensure form content is centered */
  align-items: center; /* Align form vertically */
}

/* Common form styles */
form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  max-width: 400px;
  animation: fade-in 0.5s ease;
  justify-content: center; /* Center the form elements */
}

/* Input fields and submit buttons styling */
input,
button[type='submit'] {
  padding: 10px;
  border: 1px solid #ddd; /* Lighter border color */
  border-radius: 6px;
  font-size: 1rem;
  width: 100%;
  box-sizing: border-box;
  background: #fff; /* White background for inputs */
}

/* Focused state styling for input fields */
input:focus {
  border-color: #5f6368; /* Darker border color when focused */
  outline: none;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
}

/* Submit button style */
button[type='submit'] {
  background-color: #4caf50; /* Green color for the submit button */
  color: white;
  font-weight: bold;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
}

/* Submit button hover effect */
button[type='submit']:hover {
  background-color: #45a049; /* Darker green on hover */
}

/* Heading styling */
h2 {
  text-align: center;
  color: #333; /* Dark text for headings */
  font-size: 1.5rem;
  margin-bottom: 20px;
}

/* Checkbox styling for terms and conditions acceptance */
.checkbox-container {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  gap: 8px;
  color: #333; /* Dark text for the checkbox label */
}

/* Fade transition for form switching */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Keyframe for fade-in animation */
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
