/**
 * wishlistController.js — Wishlist Business Logic
 *
 * Handles wishlist operations using MySQL internal user IDs resolved from Firebase UIDs.
 */

import * as WishlistModel from '../models/Wishlist.js';
import * as UserModel from '../models/User.js';
import * as ProductModel from '../models/Product.js';

// Helper to resolve or auto-provision user in Firestore from Firebase token payload
// Returns Firebase UID string (not a MySQL integer)
const resolveUserId = async (decodedUser) => {
  if (!decodedUser || !decodedUser.uid) return null;
  let user = await UserModel.findByFirebaseUid(decodedUser.uid);
  if (!user) {
    const email    = decodedUser.email || `${decodedUser.uid}@firebase.user`;
    const fullName = decodedUser.name  || decodedUser.email?.split('@')[0] || 'Customer';
    await UserModel.create({
      firebase_uid: decodedUser.uid,
      full_name: fullName,
      email,
    });
    user = await UserModel.findByFirebaseUid(decodedUser.uid);
  }
  // Return Firebase UID string — this is the user key in Firestore
  return user?.firebase_uid || user?.id || null;
};

// ── GET /api/wishlist ────────────────────────────────────────────────────────
export const getWishlist = async (req, res, next) => {
  try {
    const userId = await resolveUserId(req.decodedUser);
    if (!userId) {
      return res.status(404).json({ success: false, message: 'User account not found.' });
    }

    const wishlist = await WishlistModel.findByUserId(userId);
    const count = await WishlistModel.countByUserId(userId);

    return res.status(200).json({
      success: true,
      message: 'Wishlist retrieved successfully.',
      data: { wishlist, count },
    });
  } catch (error) {
    next(error);
  }
};

// ── POST /api/wishlist ───────────────────────────────────────────────────────
export const addToWishlist = async (req, res, next) => {
  try {
    const { product_id } = req.body;
    const numProductId = Number(product_id);

    if (!numProductId || !Number.isInteger(numProductId)) {
      return res.status(400).json({ success: false, message: 'Valid product_id is required.' });
    }

    const userId = await resolveUserId(req.decodedUser);
    if (!userId) {
      return res.status(404).json({ success: false, message: 'User account not found.' });
    }

    // Validate product existence
    const product = await ProductModel.findById(numProductId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    await WishlistModel.add(userId, numProductId);

    const wishlist = await WishlistModel.findByUserId(userId);
    const count = await WishlistModel.countByUserId(userId);

    return res.status(201).json({
      success: true,
      message: 'Product added to wishlist.',
      data: { wishlist, count },
    });
  } catch (error) {
    next(error);
  }
};

// ── DELETE /api/wishlist/:productId ──────────────────────────────────────────
export const removeFromWishlist = async (req, res, next) => {
  try {
    const productId = Number(req.params.productId);
    if (!productId || !Number.isInteger(productId)) {
      return res.status(400).json({ success: false, message: 'Valid productId parameter is required.' });
    }

    const userId = await resolveUserId(req.decodedUser);
    if (!userId) {
      return res.status(404).json({ success: false, message: 'User account not found.' });
    }

    await WishlistModel.remove(userId, productId);

    const wishlist = await WishlistModel.findByUserId(userId);
    const count = await WishlistModel.countByUserId(userId);

    return res.status(200).json({
      success: true,
      message: 'Product removed from wishlist.',
      data: { wishlist, count },
    });
  } catch (error) {
    next(error);
  }
};
