/**
 * orderRoutes.js — API Routes for Orders
 *
 * All routes are protected by verifyFirebaseToken.
 *
 * Endpoints:
 *  POST   /api/orders             — Place a new order (checkout)
 *  GET    /api/orders             — List all orders for the logged-in user
 *  GET    /api/orders/:id         — Get full order details by ID
 *  PUT    /api/orders/:id/cancel  — Cancel an order and restore stock
 */

import express from 'express';
import {
  placeOrder,
  getOrders,
  getOrderById,
  cancelOrder,
} from '../controllers/orderController.js';
import verifyFirebaseToken from '../middleware/verifyFirebaseToken.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = express.Router();

// All order routes require authentication
router.use(verifyFirebaseToken);

// ── Endpoints ──────────────────────────────────────────

// POST /api/orders (place new order)
router.post('/', asyncHandler(placeOrder));

// GET /api/orders (user's order history)
router.get('/', asyncHandler(getOrders));

// GET /api/orders/:id (single order details)
router.get('/:id', asyncHandler(getOrderById));

// PUT /api/orders/:id/cancel (cancel pending/processing order)
router.put('/:id/cancel', asyncHandler(cancelOrder));

export default router;
