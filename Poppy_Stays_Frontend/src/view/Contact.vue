<template>
  <div class="contact-page">
    <div class="contact-container">
      <h1>Contact Us</h1>
      <p>
        We’re here to help! If you have any questions or need assistance, please choose the type of issue you're experiencing
        and describe your problem in detail. Our team will get back to you as soon as possible to provide the support you need.
        We value your feedback and are committed to ensuring a smooth experience with Poppy Stays.
      </p>

      <!-- Contact Form -->
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label for="contactType">Type of Issue</label>
          <select
            id="contactType"
            v-model="form.contactTypeId"
            required
          >
            <option value="" disabled selected>Select an issue</option>
            <option
              v-for="type in contactTypes"
              :key="type.Contact_Type_ID"
              :value="type.Contact_Type_ID"
            >
              {{ type.Contact_Type_Name }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label for="message">Message</label>
          <textarea
            id="message"
            v-model="form.message"
            placeholder="Describe your issue here..."
            required
          ></textarea>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      contactTypes: [], // Holds the contact types from the API
      form: {
        contactTypeId: '', // Holds the selected contact type ID
        message: '', // Message text
      },
    };
  },

  created() {
    this.fetchContactTypes(); // Fetch contact types when the component is created
  },
  methods: {
    async fetchContactTypes() {
      try {
        const response = await fetch('http://localhost:3000/api/contact-types', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          this.contactTypes = data.contactTypes; // Set the fetched contact types
        } else {
          const error = await response.json();
          alert(`Error fetching contact types: ${error.message}`);
        }
      } catch (error) {
        console.error('Error fetching contact types:', error);
        alert('An unexpected error occurred while fetching contact types.');
      }
    },
    async submitForm() {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch('http://localhost:3000/api/contact-message', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(this.form), // Send form data with contactTypeId
        });

        if (response.ok) {
          alert('Your message has been submitted successfully!');
          this.form.contactTypeId = '';
          this.form.message = '';
        } else {
          const error = await response.json();
          alert(`Error submitting your message: ${error.message}`);
        }
      } catch (error) {
        console.error('Submission error:', error);
        alert('An unexpected error occurred while submitting your message.');
      }
    },
  },
};
</script>

<style scoped>
.contact-page {
  font-family: Arial, sans-serif;
  background-color: #f9f9f9;
  padding: 20px;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.contact-container {
  max-width: 800px;
  background: #fff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

p {
  font-size: 16px;
  color: #555;
  line-height: 1.6;
  margin-bottom: 30px;
  text-align: center;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
}

select,
textarea,
button {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

textarea {
  resize: vertical;
  height: 100px;
}

button {
  background-color: #28a745;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #218838;
}
</style>
