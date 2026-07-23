/**
 * productRoutes.js — Product API Routes with Recommendation Engine
 *
 * Mount point: /api/products  (registered in app.js)
 */

import { Router } from 'express';
import {
  getAllProducts,
  getFeaturedProducts,
  getProductsByCategory,
  getProductById,
  getProductBySlug,
  getProductGallery,
  getProductSpecifications,
} from '../controllers/productController.js';
import {
  getProductReviews,
  addProductReview,
} from '../controllers/reviewController.js';
import {
  getRelatedProducts,
  getFrequentlyBought,
  getRecentlyViewed,
  recordRecentlyViewed,
  getRecommended,
  getBestSellers,
  getTrending,
} from '../controllers/recommendationController.js';
import verifyFirebaseToken from '../middleware/verifyFirebaseToken.js';

const router = Router();

// ── Specific static routes (must come BEFORE /:id) ───────────────────────────
router.get('/featured',           getFeaturedProducts);
router.get('/category/:category', getProductsByCategory);
router.get('/slug/:slug',         getProductBySlug);

// Recommendation Collection Routes
router.get('/recently-viewed',    getRecentlyViewed);
router.post('/recently-viewed',   recordRecentlyViewed);
router.get('/recommended',        getRecommended);
router.get('/best-sellers',       getBestSellers);
router.get('/trending',           getTrending);

// ── Sub-resource routes ───────────────────────────────────────────────────────
router.get('/:id/gallery',           getProductGallery);
router.get('/:id/images',            getProductGallery);
router.get('/:id/specifications',    getProductSpecifications);
router.get('/:id/reviews',           getProductReviews);
router.get('/:id/related',           getRelatedProducts);
router.get('/:id/frequently-bought', getFrequentlyBought);

// Write review (requires Firebase authentication)
router.post('/:id/reviews', verifyFirebaseToken, addProductReview);

// ── Collection & single-by-ID ─────────────────────────────────────────────────
router.get('/',    getAllProducts);
router.get('/:id', getProductById);

export default router;
