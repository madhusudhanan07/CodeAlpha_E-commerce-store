import express from 'express';
import {
  getAllProducts,
  getProducts,
  getFeaturedProducts,
  getProductsToCompare,
  getProductsByCategory,
  getProductById,
  getProductBySlug,
  getProductGallery,
  getProductSpecifications,
  getProductReviews,
  addProductReview,
} from '../controllers/productController.js';
import {
  getBestSellers,
  getTrending,
  getRecentlyViewed,
  recordRecentlyViewed,
  getRecommended,
  getRelatedProducts,
  getFrequentlyBought,
} from '../controllers/recommendationController.js';

const router = express.Router();

// ── Named/static routes FIRST (before /:id wildcard) ─────────────────────────
router.get('/', getAllProducts || getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/compare', getProductsToCompare);
router.get('/best-sellers', getBestSellers);
router.get('/trending', getTrending);
router.get('/recommended', getRecommended);
router.get('/recently-viewed', getRecentlyViewed);
router.post('/recently-viewed', recordRecentlyViewed);
router.get('/category/:category', getProductsByCategory);
router.get('/slug/:slug', getProductBySlug);

// ── Dynamic /:id routes AFTER all named routes ────────────────────────────────
router.get('/:id', getProductById);
router.get('/:id/gallery', getProductGallery);
router.get('/:id/images', getProductGallery);
router.get('/:id/specifications', getProductSpecifications);
router.get('/:id/reviews', getProductReviews);
router.get('/:id/related', getRelatedProducts);
router.get('/:id/frequently-bought', getFrequentlyBought);
router.post('/:id/reviews', addProductReview);

export default router;