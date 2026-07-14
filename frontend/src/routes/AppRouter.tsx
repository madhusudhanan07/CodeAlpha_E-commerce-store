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

import { lazy } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout         from '../layouts/MainLayout';
import ProtectedRoute     from '../components/ProtectedRoute';
import ErrorPage          from '../pages/ErrorPage';

// Lazy loaded views
const HomePage           = lazy(() => import('../pages/HomePage'));
const ProductDetailsPage = lazy(() => import('../pages/ProductDetailsPage'));
const ProductsPage       = lazy(() => import('../pages/ProductsPage'));
const CartPage           = lazy(() => import('../pages/CartPage'));
const CheckoutPage       = lazy(() => import('../pages/CheckoutPage'));
const OrderSuccessPage   = lazy(() => import('../pages/OrderSuccessPage'));
const OrdersPage         = lazy(() => import('../pages/OrdersPage'));
const LoginPage          = lazy(() => import('../pages/LoginPage'));
const RegisterPage       = lazy(() => import('../pages/RegisterPage'));
const ProfilePage        = lazy(() => import('../pages/ProfilePage'));
const NotFoundPage       = lazy(() => import('../pages/NotFoundPage'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorPage />,
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
          { path: 'cart',          element: <CartPage /> },
          { path: 'checkout',      element: <CheckoutPage /> },
          { path: 'order-success', element: <OrderSuccessPage /> },
          { path: 'orders',        element: <OrdersPage /> },
          { path: 'profile',       element: <ProfilePage /> },
        ],
      },
    ],
  },
]);

const AppRouter: React.FC = () => <RouterProvider router={router} />;

export default AppRouter;
