<template>
  <div class="auth-container">
    <div class="button-container">
      <button @click="toggleForm('register')" :class="{ active: currentForm === 'register' }">
        Become a Poppyseed
      </button>
      <button @click="toggleForm('login')" :class="{ active: currentForm === 'login' }">
        Already a Poppyseed?
      </button>
    </div>

    <div class="form-container">
      <transition name="fade">
        <form v-if="currentForm === 'register'" @submit.prevent="submitRegister">
          <h2>Join Poppy Stays!</h2>
          <input type="text" v-model="registerForm.firstName" placeholder="First Name" required />
          <input type="text" v-model="registerForm.lastName" placeholder="Last Name" required />
          <input type="email" v-model="registerForm.email" placeholder="Email" required />
          <input type="password" v-model="registerForm.password" placeholder="Password" required />
          <input type="tel" v-model="registerForm.mobile" placeholder="Mobile Number" required />
          <input type="date" v-model="registerForm.dob" placeholder="Date of Birth" required />
          <input type="text" v-model="registerForm.address" placeholder="Address" required />
          <label>
            <input type="checkbox" v-model="registerForm.termsAccepted" required />
            I accept the Terms and Conditions and Privacy Policy
          </label>
          <button type="submit">Register</button>
        </form>
      </transition>

      <transition name="fade">
        <form v-if="currentForm === 'login'" @submit.prevent="submitLogin">
          <h2>Welcome Back!</h2>
          <input type="email" v-model="loginForm.email" placeholder="Email" required />
          <input type="password" v-model="loginForm.password" placeholder="Password" required />
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
    const currentForm = ref(null);
    const registerForm = ref({
      firstName: '', lastName: '', email: '', password: '', mobile: '', dob: '', address: '', termsAccepted: false,
    });
    const loginForm = ref({ email: '', password: '' });

    const toggleForm = (formType) => {
      currentForm.value = currentForm.value === formType ? null : formType;
    };

    const submitRegister = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            User_FN: registerForm.value.firstName,
            User_LN: registerForm.value.lastName,
            User_Email: registerForm.value.email,
            User_Password: registerForm.value.password,
            User_Number: registerForm.value.mobile,
            User_Date_Of_Birth: registerForm.value.dob,
            User_Address: registerForm.value.address,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          alert(data.message);
          toggleForm('login');
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error('Error during registration:', error);
        alert('An error occurred during registration. Please try again.');
      }
    };

    const submitLogin = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            User_Email: loginForm.value.email,
            User_Password: loginForm.value.password,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          alert(data.message);
          console.log('Token:', data.token);
          localStorage.setItem('authToken', data.token); // save token
          localStorage.setItem('userDetails', JSON.stringify(data.user)); // save userdata
          localStorage.setItem('Owner_ID', data.user.ownerId); // Use `ownerId` from backend

        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred during login. Please try again.');
      }
    };


    return {
      currentForm, registerForm, loginForm, toggleForm, submitRegister, submitLogin,
    };
  },
};
</script>

<style scoped>
.auth-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px 20px;
  background-color: #f5f5f5;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  margin: 50px auto;
  height: 80vh;
}

.button-container {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
  justify-content: center;
}

button {
  padding: 12px 24px;
  border: 2px solid #ddd;
  background: #fff;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: background 0.3s, color 0.3s;
  min-width: 150px;
}

button:hover {
  background: #e0e0e0;
}

button.active {
  background: #f0f0f0;
  color: #333;
  border-color: #bbb;
}

.form-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  max-width: 400px;
  animation: fade-in 0.5s ease;
}

input,
button[type='submit'] {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  width: 100%;
}

input:focus {
  border-color: #5f6368;
  outline: none;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
}

button[type='submit'] {
  background-color: #4caf50;
  color: white;
  font-weight: bold;
  border: none;
  cursor: pointer;
}

button[type='submit']:hover {
  background-color: #45a049;
}

h2 {
  text-align: center;
  color: #333;
  font-size: 1.5rem;
  margin-bottom: 20px;
}

.checkbox-container {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  gap: 8px;
  color: #333;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
