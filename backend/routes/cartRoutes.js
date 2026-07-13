/**
 * cartRoutes.js — API Routes for Shopping Cart
 *
 * All routes are protected by verifyFirebaseToken mapping to the current user.
 */

import express from 'express';
import {
  getCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
  clearCart,
} from '../controllers/cartController.js';
import verifyFirebaseToken from '../middleware/verifyFirebaseToken.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = express.Router();

// All cart routes require authentication
router.use(verifyFirebaseToken);

// ── Endpoints ──────────────────────────────────────────

// GET /api/cart
router.get('/', asyncHandler(getCart));

// POST /api/cart (add product)
router.post('/', asyncHandler(addCartItem));

// DELETE /api/cart/clear (empty the cart completely)
// NOTE: Must be defined BEFORE /:id to avoid 'clear' being parsed as an :id
router.delete('/clear', asyncHandler(clearCart));

// PUT /api/cart/:id (update quantity where :id = product_id)
router.put('/:id', asyncHandler(updateCartItem));

// DELETE /api/cart/:id (remove distinct product from cart)
router.delete('/:id', asyncHandler(removeCartItem));

export default router;
