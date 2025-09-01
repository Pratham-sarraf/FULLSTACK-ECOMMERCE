# E-Commerce Web Application


A full-featured e-commerce platform with **role-based access**, allowing users to browse, search, and filter products, manage their cart, and complete purchases.  
The project emphasizes **user-friendly interfaces** and **smooth frontend-backend interaction**.




---

## Features
1. **Admin Dashboard** – Full-featured dashboard to manage products, categories, orders, and users with role-based access control.  
2. **Stripe Payment Gateway** – Secure and seamless online payment integration for smooth checkout experience.
3.  **User Authentication** – Secure signup, login, and session handling for registered users.
4. **Filtering & Sorting** – Filter products by category, price, popularity, and apply dynamic sorting options.  
5. **Advanced Pagination & Product Listing** – Efficient pagination for large product catalogs to enhance user experience.  
6. **Product Browsing & Search** – Easy product discovery with keyword search and category navigation.  
7. **Cart & Checkout** – Dynamic cart management with automatic total calculations.  
  



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
