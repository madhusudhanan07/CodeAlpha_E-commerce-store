/**
 * adminRoutes.js — Admin Panel API Routes
 */

import { Router } from 'express';
import {
  getDashboardStats,
  getAnalyticsInsights,
  getAdminSettings,
  updateAdminSettings,
  createAdminDatabaseBackup,
  downloadAdminDatabaseBackup,
  getAllAdminProducts,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  duplicateAdminProduct,
  toggleAdminProductFeatured,
  getAllAdminCategories,
  createAdminCategory,
  updateAdminCategory,
  duplicateAdminCategory,
  toggleAdminCategoryStatus,
  toggleAdminCategoryFeatured,
  deleteAdminCategory,
  getAllAdminCustomers,
  getAdminCustomerDetails,
  updateAdminCustomer,
  updateAdminCustomerStatus,
  softDeleteAdminCustomer,
  getAllAdminOrders,
  updateOrderStatus,
  getAllAdminReviews,
  updateAdminReviewStatus,
  deleteAdminReview,
} from '../controllers/adminController.js';

const router = Router();

// Stats & Dashboard Analytics BI
router.get('/stats', getDashboardStats);
router.get('/analytics/insights', getAnalyticsInsights);

// Store Settings & Backup Snapshot
router.get('/settings', getAdminSettings);
router.put('/settings', updateAdminSettings);
router.post('/backup/create', createAdminDatabaseBackup);
router.get('/backup/download', downloadAdminDatabaseBackup);

// Products Management
router.get('/products', getAllAdminProducts);
router.post('/products', createAdminProduct);
router.put('/products/:id', updateAdminProduct);
router.post('/products/:id/duplicate', duplicateAdminProduct);
router.put('/products/:id/featured', toggleAdminProductFeatured);
router.delete('/products/:id', deleteAdminProduct);

// Categories Management
router.get('/categories', getAllAdminCategories);
router.post('/categories', createAdminCategory);
router.put('/categories/:id', updateAdminCategory);
router.post('/categories/:id/duplicate', duplicateAdminCategory);
router.put('/categories/:id/toggle-status', toggleAdminCategoryStatus);
router.put('/categories/:id/toggle-featured', toggleAdminCategoryFeatured);
router.delete('/categories/:id', deleteAdminCategory);

// Customers Management
router.get('/customers', getAllAdminCustomers);
router.get('/customers/:id', getAdminCustomerDetails);
router.put('/customers/:id', updateAdminCustomer);
router.patch('/customers/:id/status', updateAdminCustomerStatus);
router.delete('/customers/:id', softDeleteAdminCustomer);

// Orders Management
router.get('/orders', getAllAdminOrders);
router.put('/orders/:id/status', updateOrderStatus);

// Reviews Moderation & Management
router.get('/reviews', getAllAdminReviews);
router.put('/reviews/:id/status', updateAdminReviewStatus);
router.delete('/reviews/:id', deleteAdminReview);

export default router;
