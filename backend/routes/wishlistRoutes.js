/**
 * wishlistRoutes.js — API Routes for Wishlist (Favorites)
 *
 * All routes are protected by verifyFirebaseToken mapping to the current authenticated user.
 */

import express from 'express';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from '../controllers/wishlistController.js';
import verifyFirebaseToken from '../middleware/verifyFirebaseToken.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = express.Router();

// All wishlist routes require authentication
router.use(verifyFirebaseToken);

// ── Endpoints ──────────────────────────────────────────

// GET /api/wishlist
router.get('/', asyncHandler(getWishlist));

// POST /api/wishlist
router.post('/', asyncHandler(addToWishlist));

// DELETE /api/wishlist/:productId
router.delete('/:productId', asyncHandler(removeFromWishlist));

export default router;
