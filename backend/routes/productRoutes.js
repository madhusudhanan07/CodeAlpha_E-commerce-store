/**
 * productRoutes.js — Product API Routes
 *
 * Mount point: /api/products  (registered in app.js)
 *
 * Routes (all public — no auth required for reading the catalogue):
 *   GET /api/products                    → List all (supports ?search= & ?featured=1)
 *   GET /api/products/featured           → Featured products only
 *   GET /api/products/category/:category → Products by category slug
 *   GET /api/products/slug/:slug         → Single product by slug
 *   GET /api/products/:id                → Single product by numeric ID
 *
 * Order matters: specific paths before parameterisedones.
 */

import { Router } from 'express';
import {
  getAllProducts,
  getFeaturedProducts,
  getProductsByCategory,
  getProductById,
  getProductBySlug,
} from '../controllers/productController.js';

const router = Router();

// ── Specific routes first (before /:id catches everything) ────────────────────
router.get('/featured',           getFeaturedProducts);
router.get('/category/:category', getProductsByCategory);
router.get('/slug/:slug',         getProductBySlug);

// ── Collection & single-by-ID ─────────────────────────────────────────────────
router.get('/',    getAllProducts);
router.get('/:id', getProductById);

export default router;
