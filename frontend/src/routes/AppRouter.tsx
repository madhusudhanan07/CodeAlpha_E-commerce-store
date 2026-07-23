/**
 * AppRouter.tsx — Centralized Route Configuration
 *
 * All application routes are declared here.
 * The router is created with createBrowserRouter (React Router v6.4+)
 */

import { lazy } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout         from '../layouts/MainLayout';
import AdminLayout        from '../layouts/AdminLayout';
import ProtectedRoute     from '../components/ProtectedRoute';
import AdminRoute         from '../components/admin/AdminRoute';
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
const WishlistPage       = lazy(() => import('../pages/WishlistPage'));
const NotFoundPage       = lazy(() => import('../pages/NotFoundPage'));

// Admin pages
const AdminDashboard      = lazy(() => import('../pages/admin/AdminDashboard'));
const AdminProductsPage   = lazy(() => import('../pages/admin/AdminProductsPage'));
const AdminCategoriesPage = lazy(() => import('../pages/admin/AdminCategoriesPage'));
const AdminOrdersPage     = lazy(() => import('../pages/admin/AdminOrdersPage'));
const AdminCustomersPage  = lazy(() => import('../pages/admin/AdminCustomersPage'));
const AdminReviewsPage    = lazy(() => import('../pages/admin/AdminReviewsPage'));
const AdminAnalyticsPage  = lazy(() => import('../pages/admin/AdminAnalyticsPage'));
const AdminSettingsPage   = lazy(() => import('../pages/admin/AdminSettingsPage'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true,             element: <HomePage /> },
      { path: 'products',        element: <ProductsPage /> },
      { path: 'products/:id',    element: <ProductDetailsPage /> },
      { path: 'products/slug/:slug', element: <ProductDetailsPage /> },
      { path: 'wishlist',        element: <WishlistPage /> },
      { path: 'login',           element: <LoginPage /> },
      { path: 'register',        element: <RegisterPage /> },

      // ── Protected Customer Routes ──────────────────────────────────────────
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

  // ── Secure Admin Panel Routes ─────────────────────────────────────────────
  {
    path: '/admin',
    element: <AdminRoute />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true,             element: <AdminDashboard /> },
          { path: 'products',        element: <AdminProductsPage /> },
          { path: 'categories',      element: <AdminCategoriesPage /> },
          { path: 'orders',          element: <AdminOrdersPage /> },
          { path: 'customers',       element: <AdminCustomersPage /> },
          { path: 'reviews',         element: <AdminReviewsPage /> },
          { path: 'analytics',       element: <AdminAnalyticsPage /> },
          { path: 'settings',        element: <AdminSettingsPage /> },
        ],
      },
    ],
  },

  { path: '*', element: <NotFoundPage /> },
]);

const AppRouter: React.FC = () => <RouterProvider router={router} />;

export default AppRouter;
