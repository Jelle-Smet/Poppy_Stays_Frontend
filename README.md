# Poppy Stays Frontend

# Welcome to the frontend of the Poppy Stays project!
This frontend is built using **Vue.js 3** along with **JavaScript**, **HTML**, and **CSS** to create a responsive and dynamic user interface for the application. We also leverage **Bootstrap** for styling and **Vue Router** for navigation.

# Overview
Poppy Stays is a platform designed to connect travelers with unique camping spots and BnBs. The frontend provides the following functionalities:

- **User Interface:** Intuitive pages for browsing, booking, and managing camping spots.
- **Dynamic Components:** Interactive components for menus, forms, and bookings.
- **Promotions Page:** Display active promotions for users.
- **Authentication Pages:** Login and signup pages with user-friendly forms.

All the components are designed to deliver a seamless experience for users.

# Requirements
Before you begin, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** (Node Package Manager)
- **Vue CLI** (Optional but recommended for development)

# Setup
To get started with the frontend:

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run serve
   ```

   The development server will start on the default port (e.g., `http://localhost:8080`).

4. Build for production:
   ```bash
   npm run build
   ```

   This will generate the production-ready files in the `dist` folder.

# Project Structure
The project follows a standard Vue.js structure:

- **src/components:** Contains reusable Vue components like the navigation bar, header, and footer.
- **src/view:** Contains actual page-level components such as Home, Login, and Profile.
- **src/router:** Manages the application’s routing.
- **src/store:** Handles state management for the application (if used).

# Features
- **Dynamic Menus:** Implemented with a top menu including Home, Account, Spots, About Us, and Contact sections.
- **Shared Layouts:** Consistent layout across pages using a shared MainLayout component.
- **Reusable Components:** Common UI elements like the navigation bar can be found in the `src/components` folder.
- **Responsive Design:** Optimized for various screen sizes and devices.
- **Promotions Display:** A dedicated page showcasing current promotions.

# Notes
- The project uses **Bootstrap** for styling and **Vue Router** for handling page navigation.
- Pages are located in the `src/view` folder and are linked via the router.
- The application is built with **Vue.js 3**, which introduces the Composition API for better state and logic management.

# Contributing
If you’d like to contribute:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Submit a pull request once your changes are complete.

# License
This project is licensed under the MIT License. See the `LICENSE` file for more details.

---

Thank you for contributing to Poppy Stays! If you have any questions, feel free to reach out.

