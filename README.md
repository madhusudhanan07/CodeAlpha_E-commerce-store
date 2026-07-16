# CodeAlpha E-Commerce Store

![CodeAlpha E-Commerce Store](https://placehold.co/1200x630/1a1a24/6c63ff?text=CodeAlpha+E-commerce+Platform)

A full-stack, production-ready e-commerce platform built as a portfolio project for an internship submission. Designed with a micro-architecture approach utilizing Express.js for the backend, React (Vite+TS) for the frontend, MySQL for relational data, and Firebase for secure authentication.

## ✨ Key Features

- **Storefront & Product Catalog:** View carefully curated products with a responsive grid. Fast search and category-based filtering.
- **Product Details:** Single-page detailed views with dynamic stock indicators, related items, and live quantity updates.
- **User Authentication:** Firebase-powered secure email/password registration and login.
- **Shopping Cart:** Highly responsive global cart state leveraging React Context for instant UI updates.
- **Transactional Checkout:** Atomic order processing validating stock, moving items to orders, and clearing carts within a single MySQL transaction.
- **Order History:** Full order tracking for users and detailed receipt modals.
- **Secure Architecture:** JWT-based protection using Firebase ID tokens and Express middleware verification.
- **Modern UI/UX:** Fully responsive layout with glassmorphism touches, skeleton loaders, toast notifications, animated empty states, and accessibility enhancements (ARIA compliance).

## 🛠 Tech Stack

Frontend:
React + TypeScript + Vite

Backend:
Express.js (Node.js)

Database:
MySQL

Authentication:
Firebase Authentication

Optional Development Tools:
Python scripts (only for one-time seed generation, not required to run the application)

## 📂 Folder Structure

```
├── backend/
│   ├── config/          # DB connection & Firebase Admin setup
│   ├── controllers/     # Request handlers (business logic)
│   ├── middleware/      # Firebase Token Verification, Error catching
│   ├── models/          # Thin MySQL query wrappers
│   ├── routes/          # Express route definitions
│   └── server.js        # Entry point
├── frontend/
│   ├── public/          # Static assets
│   ├── src/
│   │   ├── components/  # Reusable UI parts (Navbar, Footer, ProductGrid)
│   │   ├── context/     # AuthContext, CartContext
│   │   ├── hooks/       # Custom React Hooks
│   │   ├── layouts/     # MainLayout wrapping navigation
│   │   ├── pages/       # Lazy-loaded route views
│   │   ├── services/    # Axios interceptors and API calls
│   │   ├── styles/      # Global Design Tokens & Scoped CSS
│   │   └── types/       # Global TypeScript interfaces
│   └── vite.config.ts   # Vite bundler options
└── database/
    └── ecommerce.sql    # Full DB bootstrap script (Schema + Seed Data)
```

## 🚀 Installation & Setup

### 1. Prerequisites
- Node.js (v18+)
- MySQL (v8.0+)
- A Firebase Project (with Email/Password auth enabled)

### 2. Database Setup
1. Create a database in MySQL called `codealpha_ecommerce`.
2. Import the database schema and seed data located in `database/ecommerce.sql`.
   ```bash
   mysql -u root -p codealpha_ecommerce < database/ecommerce.sql
   ```

### 3. Backend Configuration
1. Navigate to the `backend/` directory.
2. Run `npm install`
3. Generate a Firebase Admin SDK Service Account Key (JSON) from your Firebase Console. Save it to `backend/config/serviceAccountKey.json`.
4. Copy `.env.example` to `.env` and fill in your DB credentials:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=yourpassword
   DB_NAME=codealpha_ecommerce
   FIREBASE_SERVICE_ACCOUNT_PATH=./config/serviceAccountKey.json
   ```
5. Start the backend: `npm run dev`

### 4. Frontend Configuration
1. Navigate to the `frontend/` directory.
2. Run `npm install`
3. Copy `.env.example` to `.env` and fill in your Firebase Client Configuration:
   ```env
   VITE_API_BASE_URL=http://localhost:5000
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   ```
4. Start the frontend: `npm run dev`

## 🔌 API Endpoints Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/products` | None | Fetch all available products |
| `GET` | `/api/products/:id` | None | Fetch single product by ID |
| `POST`| `/api/auth/register`| ✅ | Sync new Firebase user into MySQL |
| `GET` | `/api/cart` | ✅ | Fetch user's cart |
| `POST`| `/api/cart` | ✅ | Add item to cart |
| `POST`| `/api/orders` | ✅ | Create order (checks stock, processes transaction) |
| `GET` | `/api/orders` | ✅ | Fetch user's order history |

## 🌟 Future Improvements
- **Stripe Integration** for actual, secure payment processing.
- **Admin Dashboard** allowing authorized users to edit products and view network sales.
- **User Reviews & Ratings** appended directly to product detail pages.

## 📄 License
This project is built for educational & portfolio purposes as part of the CodeAlpha internship. All rights reserved.
