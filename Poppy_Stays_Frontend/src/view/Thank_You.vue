<template>
    <div class="container my-5">
      <div class="row justify-content-center">
        <div class="col-12 col-md-8 text-center">
          <div class="card shadow-lg p-5"> <!-- Increased padding -->
            <h1 class="display-4 text-success mb-5"> <!-- Increased margin bottom -->
              Thank You for Your Review!
            </h1>
            <p class="lead mb-4"> <!-- Increased margin bottom -->
              Your feedback means the world to us! We appreciate you taking the time to share your experience at one of our beautiful spots. Whether you’re here for a peaceful escape or an adventurous stay, your thoughts help us make **Poppy Stays** even better.
            </p>
            <p class="mb-5"> <!-- Increased margin bottom -->
              We’ll be reviewing your feedback shortly. If you’d like to explore more spots or have any questions, feel free to visit our homepage or contact us.
            </p>
            <div class="mt-5"> <!-- Increased margin top for the buttons -->
              <router-link to="/" class="btn btn-primary btn-lg">Back to Home</router-link>
              <router-link to="/all-spots" class="btn btn-secondary btn-lg ms-4"> <!-- Increased space between buttons -->
                Explore More Spots
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>

<script>
  export default {
    name: "ThankYouPage",
  };
</script>

<style scoped>

  .mt-5{
    padding-top: 15px;
  }
  .card {
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    color: black;
    padding: 2rem; /* Increased padding inside the card */
  }

  h1 {
    color: #28a745;
  }

  .lead {
    font-size: 1.25rem;
    color: #495057;
  }

  .btn-lg {
    padding: 15px 30px; /* Increased padding inside the button */
    border-radius: 8px; /* Rounded buttons for more space */
    font-size: 1.1rem; /* Larger text for buttons */
    cursor: pointer;
    transition: all 0.3s ease;
    border: none;
  }

  .btn-primary {
    background-color: #007bff;
    color: white;
  }

  .btn-primary:hover {
    background-color: #0056b3;
  }

  .btn-secondary {
    background-color: #6c757d;
    color: white;
  }

  .btn-secondary:hover {
    background-color: #5a6268;
  }
</style>
