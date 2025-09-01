# E-Commerce Web Application

A **full-featured E-commerce platform** built with **MongoDB** for data storage, an **Admin Dashboard**, and **Stripe Payment Gateway** for secure online payments. The platform includes all standard e-commerce functionalities like browsing products, managing orders, cart & checkout, and secure user authentication.

---

## Features
1.  Product browsing & search
2.  Cart & checkout with dynamic totals
3.  User authentication (signup, login, session handling)
4.  Admin dashboard for products, categories & orders

---

## Tech Stack
-   **Backend:** Node.js, Express.js
-   **Database:** MongoDB
-   **Frontend:** EJS, HTML, CSS, JavaScript
-   **Payment Gateway:** Stripe

---

## Installation

### Prerequisites
Before you begin, ensure you have the following installed:
* **Node.js** and **npm**
* A **MongoDB** instance (local or cloud-hosted)
* **Stripe API keys** (for both secret and publishable keys)

### Steps

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd <repo-folder>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root directory of your project and add your environment variables:
    ```
    MONGO_URI=<Your MongoDB connection string>
    STRIPE_SECRET_KEY=<Your Stripe secret key>
    STRIPE_PUBLISHABLE_KEY=<Your Stripe publishable key>
    ```

4.  **Run the application:**
    ```bash
    npm start
    ```

The application will now be running on `http://localhost:3000`.
