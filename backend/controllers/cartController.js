/**
 * cartController.js — Shopping Cart Business Logic
 *
 * Handles persistent cart operations using MySQL internal user IDs resolved from Firebase UIDs.
 * Enforces stock validation, quantity boundaries, and user isolation.
 */

import * as CartItemModel from '../models/CartItem.js';
import * as UserModel from '../models/User.js';
import * as ProductModel from '../models/Product.js';

// Helper to resolve or auto-provision MySQL user ID from Firebase token payload
const resolveUserId = async (decodedUser) => {
  if (!decodedUser || !decodedUser.uid) return null;
  let user = await UserModel.findByFirebaseUid(decodedUser.uid);
  if (!user) {
    const email = decodedUser.email || `${decodedUser.uid}@firebase.user`;
    const fullName = decodedUser.name || decodedUser.email?.split('@')[0] || 'Customer';
    const result = await UserModel.create({
      firebase_uid: decodedUser.uid,
      full_name: fullName,
      email: email,
    });
    user = { id: result.insertId };
  }
  return user.id;
};

// ── GET /api/cart ────────────────────────────────────────────────────────────
export const getCart = async (req, res, next) => {
  try {
    const userId = await resolveUserId(req.decodedUser);
    if (!userId) {
      return res.status(404).json({ success: false, message: 'User account not found.' });
    }

    const items = await CartItemModel.findByUserId(userId);
    const count = await CartItemModel.countByUserId(userId);

    const cart = items.map((item) => ({
      ...item,
      subtotal: Number(item.product_price) * item.quantity,
    }));
    const total_price = cart.reduce((acc, item) => acc + item.subtotal, 0);

    return res.status(200).json({
      success: true,
      message: 'Cart retrieved successfully.',
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
    const numProductId = Number(product_id);
    const numQty = Number(quantity);

    if (!numProductId || !Number.isInteger(numProductId)) {
      return res.status(400).json({ success: false, message: 'Valid product_id is required.' });
    }

    if (isNaN(numQty) || numQty < 1) {
      return res.status(400).json({ success: false, message: 'Quantity must be at least 1.' });
    }

    const userId = await resolveUserId(req.decodedUser);
    if (!userId) {
      return res.status(404).json({ success: false, message: 'User account not found.' });
    }

    // Validate product existence and stock
    const product = await ProductModel.findById(numProductId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    if (product.stock <= 0) {
      return res.status(400).json({ success: false, message: 'Product is currently out of stock.' });
    }

    // Check existing item quantity in user's cart
    const existingItem = await CartItemModel.findByUserAndProduct(userId, numProductId);
    const currentQty = existingItem ? existingItem.quantity : 0;
    const newTotalQty = currentQty + numQty;

    if (newTotalQty > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Cannot add ${numQty} item(s). Available stock is ${product.stock} (you already have ${currentQty} in cart).`,
      });
    }

    await CartItemModel.upsert(userId, numProductId, numQty);

    // Fetch updated cart payload
    const items = await CartItemModel.findByUserId(userId);
    const count = await CartItemModel.countByUserId(userId);
    const cart = items.map((item) => ({
      ...item,
      subtotal: Number(item.product_price) * item.quantity,
    }));
    const total_price = cart.reduce((acc, item) => acc + item.subtotal, 0);

    return res.status(201).json({
      success: true,
      message: 'Item added to cart successfully.',
      data: { cart, count, total_price },
    });
  } catch (error) {
    next(error);
  }
};

// ── PUT /api/cart/:id ────────────────────────────────────────────────────────
export const updateCartItem = async (req, res, next) => {
  try {
    const productId = Number(req.params.id);
    const numQty = Number(req.body.quantity);

    if (!productId || !Number.isInteger(productId)) {
      return res.status(400).json({ success: false, message: 'Valid product ID is required.' });
    }

    if (isNaN(numQty) || numQty < 1) {
      return res.status(400).json({ success: false, message: 'Quantity must be at least 1.' });
    }

    const userId = await resolveUserId(req.decodedUser);
    if (!userId) {
      return res.status(404).json({ success: false, message: 'User account not found.' });
    }

    // Validate product existence and stock limits
    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    if (numQty > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Requested quantity (${numQty}) exceeds available stock (${product.stock}).`,
      });
    }

    await CartItemModel.updateQuantity(userId, productId, numQty);

    const items = await CartItemModel.findByUserId(userId);
    const count = await CartItemModel.countByUserId(userId);
    const cart = items.map((item) => ({
      ...item,
      subtotal: Number(item.product_price) * item.quantity,
    }));
    const total_price = cart.reduce((acc, item) => acc + item.subtotal, 0);

    return res.status(200).json({
      success: true,
      message: 'Cart item updated successfully.',
      data: { cart, count, total_price },
    });
  } catch (error) {
    next(error);
  }
};

// ── DELETE /api/cart/clear ───────────────────────────────────────────────────
export const clearCart = async (req, res, next) => {
  try {
    const userId = await resolveUserId(req.decodedUser);
    if (!userId) {
      return res.status(404).json({ success: false, message: 'User account not found.' });
    }

    await CartItemModel.clearByUserId(userId);

    return res.status(200).json({
      success: true,
      message: 'Cart cleared successfully.',
      data: { cart: [], count: 0, total_price: 0 },
    });
  } catch (error) {
    next(error);
  }
};

// ── DELETE /api/cart/:id ─────────────────────────────────────────────────────
export const removeCartItem = async (req, res, next) => {
  try {
    const productId = Number(req.params.id);
    const userId = await resolveUserId(req.decodedUser);
    if (!userId) {
      return res.status(404).json({ success: false, message: 'User account not found.' });
    }

    await CartItemModel.removeItem(userId, productId);

    const items = await CartItemModel.findByUserId(userId);
    const count = await CartItemModel.countByUserId(userId);
    const cart = items.map((item) => ({
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
