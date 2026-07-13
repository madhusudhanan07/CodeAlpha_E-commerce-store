/**
 * AppRouter.tsx — Centralized Route Configuration
 *
 * All application routes are declared here.
 * The router is created with createBrowserRouter (React Router v6.4+)
 * for data-loading support when added in future phases.
 *
 * Route hierarchy:
 *   / (MainLayout)
 *   ├── /                → HomePage
 *   ├── /products/:id    → ProductDetailsPage
 *   ├── /login           → LoginPage
 *   ├── /register        → RegisterPage
 *   ├── (ProtectedRoute)
 *   │   ├── /cart        → CartPage
 *   │   ├── /checkout    → CheckoutPage
 *   │   └── /profile     → ProfilePage
 *   └── *                → NotFoundPage
 */

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout         from '../layouts/MainLayout';
import HomePage           from '../pages/HomePage';
import ProductDetailsPage from '../pages/ProductDetailsPage';
import ProductsPage      from '../pages/ProductsPage';
import CartPage           from '../pages/CartPage';
import CheckoutPage       from '../pages/CheckoutPage';
import LoginPage          from '../pages/LoginPage';
import RegisterPage       from '../pages/RegisterPage';
import ProfilePage        from '../pages/ProfilePage';
import NotFoundPage       from '../pages/NotFoundPage';
import ProtectedRoute     from '../components/ProtectedRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true,             element: <HomePage /> },
      { path: 'products',        element: <ProductsPage /> },
      { path: 'products/:id',    element: <ProductDetailsPage /> },
      { path: 'login',           element: <LoginPage /> },
      { path: 'register',        element: <RegisterPage /> },
      { path: '*',               element: <NotFoundPage /> },

      // ── Protected Routes ─────────────────────────────────────────────────
      // All children require authentication — unauthenticated users are
      // redirected to /login with the original URL preserved in state.
      {
        element: <ProtectedRoute />,
        children: [
          { path: 'cart',     element: <CartPage /> },
          { path: 'checkout', element: <CheckoutPage /> },
          { path: 'profile',  element: <ProfilePage /> },
        ],
      },
    ],
  },
]);

const AppRouter: React.FC = () => <RouterProvider router={router} />;

export default AppRouter;
