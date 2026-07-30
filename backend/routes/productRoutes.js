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

const router = express.Router();

router.get('/', getAllProducts || getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/compare', getProductsToCompare);
router.get('/category/:category', getProductsByCategory);
router.get('/slug/:slug', getProductBySlug);
router.get('/:id', getProductById);
router.get('/:id/gallery', getProductGallery);
router.get('/:id/images', getProductGallery);
router.get('/:id/specifications', getProductSpecifications);
router.get('/:id/reviews', getProductReviews);
router.post('/:id/reviews', addProductReview);

export default router;