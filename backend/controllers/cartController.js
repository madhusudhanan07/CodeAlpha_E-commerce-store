/**
 * cartController.js — Shopping Cart Business Logic
 *
 * Handles cart operations using MySQL internal user IDs resolved from Firebase UIDs.
 */

import * as CartItemModel from '../models/CartItem.js';
import * as UserModel from '../models/User.js';

// Helper to get MySQL user ID from Firebase UID
const resolveUserId = async (firebaseUid) => {
  const user = await UserModel.findByFirebaseUid(firebaseUid);
  return user?.id || null;
};

// ── GET /api/cart ────────────────────────────────────────────────────────────
export const getCart = async (req, res, next) => {
  try {
    const userId = await resolveUserId(req.decodedUser.uid);
    if (!userId) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const items = await CartItemModel.findByUserId(userId);
    const count = await CartItemModel.countByUserId(userId);
    
    // Subtotals and totals calculation
    const cart = items.map(item => ({
      ...item,
      subtotal: Number(item.product_price) * item.quantity,
    }));
    const total_price = cart.reduce((acc, item) => acc + item.subtotal, 0);

    return res.status(200).json({
      success: true,
      message: 'Cart retrieved.',
      data: { cart, count, total_price },
    });
  } catch (error) {
    next(error);
  }
};

// ── POST /api/cart ───────────────────────────────────────────────────────────
export const addCartItem = async (req, res, next) => {
  try {
    const { product_id, quantity = 1 } = req.body;
    if (!product_id || !Number.isInteger(Number(product_id))) {
      return res.status(400).json({ success: false, message: 'Valid product_id is required.' });
    }

    const userId = await resolveUserId(req.decodedUser.uid);
    if (!userId) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    await CartItemModel.upsert(userId, product_id, quantity);
    
    // Fetch updated cart to return to client
    const items = await CartItemModel.findByUserId(userId);
    const count = await CartItemModel.countByUserId(userId);
    const cart = items.map(item => ({
      ...item,
      subtotal: Number(item.product_price) * item.quantity,
    }));
    const total_price = cart.reduce((acc, item) => acc + item.subtotal, 0);

    return res.status(201).json({
      success: true,
      message: 'Item added to cart.',
      data: { cart, count, total_price },
    });
  } catch (error) {
    next(error);
  }
};

// ── PUT /api/cart/:id ────────────────────────────────────────────────────────
// :id here refers to the product_id for simplicity (as cart has UNIQUE(user_id, product_id))
export const updateCartItem = async (req, res, next) => {
  try {
    const productId = Number(req.params.id);
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ success: false, message: 'Quantity must be at least 1.' });
    }

    const userId = await resolveUserId(req.decodedUser.uid);
    if (!userId) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    await CartItemModel.updateQuantity(userId, productId, quantity);

    const items = await CartItemModel.findByUserId(userId);
    const count = await CartItemModel.countByUserId(userId);
    const cart = items.map(item => ({
      ...item,
      subtotal: Number(item.product_price) * item.quantity,
    }));
    const total_price = cart.reduce((acc, item) => acc + item.subtotal, 0);

    return res.status(200).json({
      success: true,
      message: 'Cart item updated.',
      data: { cart, count, total_price },
    });
  } catch (error) {
    next(error);
  }
};

// ── DELETE /api/cart/clear ───────────────────────────────────────────────────
export const clearCart = async (req, res, next) => {
  try {
    const userId = await resolveUserId(req.decodedUser.uid);
    if (!userId) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    await CartItemModel.clearByUserId(userId);

    return res.status(200).json({
      success: true,
      message: 'Cart cleared.',
      data: { cart: [], count: 0, total_price: 0 },
    });
  } catch (error) {
    next(error);
  }
};

// ── DELETE /api/cart/:id ─────────────────────────────────────────────────────
// :id is the product_id
export const removeCartItem = async (req, res, next) => {
  try {
    const productId = Number(req.params.id);
    const userId = await resolveUserId(req.decodedUser.uid);
    if (!userId) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    await CartItemModel.removeItem(userId, productId);

    const items = await CartItemModel.findByUserId(userId);
    const count = await CartItemModel.countByUserId(userId);
    const cart = items.map(item => ({
      ...item,
      subtotal: Number(item.product_price) * item.quantity,
    }));
    const total_price = cart.reduce((acc, item) => acc + item.subtotal, 0);

    return res.status(200).json({
      success: true,
      message: 'Item removed from cart.',
      data: { cart, count, total_price },
    });
  } catch (error) {
    next(error);
  }
};
