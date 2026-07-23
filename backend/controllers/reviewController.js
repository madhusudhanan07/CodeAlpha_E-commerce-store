/**
 * reviewController.js — Product Reviews Business Logic
 *
 * Handles HTTP operations for product reviews & ratings:
 *  - GET /api/products/:id/reviews (Public list + summary breakdown)
 *  - POST /api/products/:id/reviews (Protected — purchase verified + 1 review per user)
 *  - PUT /api/reviews/:reviewId (Protected — owner only)
 *  - DELETE /api/reviews/:reviewId (Protected — owner only)
 */

import * as ProductReviewModel from '../models/ProductReview.js';
import * as UserModel from '../models/User.js';
import * as ProductModel from '../models/Product.js';

// Helper to resolve or sync Firebase UID → MySQL user ID
const resolveUserId = async (decodedUser) => {
  if (!decodedUser || !decodedUser.uid) return null;
  let user = await UserModel.findByFirebaseUid(decodedUser.uid);
  if (!user && decodedUser.email) {
    user = await UserModel.findByEmail(decodedUser.email);
  }
  if (!user) {
    const fullName = decodedUser.name || decodedUser.email?.split('@')[0] || 'Customer';
    const result = await UserModel.create({
      firebase_uid: decodedUser.uid,
      full_name: fullName,
      email: decodedUser.email || `${decodedUser.uid}@firebase.user`,
    });
    user = await UserModel.findById(result.insertId);
  }
  return user ? user.id : null;
};

// ── GET /api/products/:id/reviews ─────────────────────────────────────────────
export const getProductReviews = async (req, res, next) => {
  try {
    const productId = Number(req.params.id);
    if (!productId || isNaN(productId)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID.' });
    }

    const [reviews, summary] = await Promise.all([
      ProductReviewModel.findByProductId(productId),
      ProductReviewModel.getRatingSummary(productId),
    ]);

    return res.status(200).json({
      success: true,
      message: 'Product reviews retrieved successfully.',
      data: {
        average_rating: summary.average_rating,
        total_reviews: summary.review_count,
        review_count: summary.review_count,
        rating_distribution: summary.rating_distribution,
        reviews,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ── POST /api/products/:id/reviews ────────────────────────────────────────────
export const addProductReview = async (req, res, next) => {
  try {
    const productId = Number(req.params.id);
    if (!productId || isNaN(productId)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID.' });
    }

    // Verify product exists
    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: `Product with ID ${productId} not found.` });
    }

    const userId = await resolveUserId(req.decodedUser);
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User authentication failed.' });
    }

    const { rating, title, review } = req.body;

    const numRating = Number(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be a number between 1 and 5.' });
    }

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Review title is required.' });
    }

    if (!review || !review.trim()) {
      return res.status(400).json({ success: false, message: 'Review content is required.' });
    }

    // Rule 1: Only users who purchased the product can review
    const hasPurchased = await ProductReviewModel.hasUserPurchased(userId, productId);
    if (!hasPurchased) {
      return res.status(403).json({
        success: false,
        message: 'Only customers who have purchased this product can leave a review.',
      });
    }

    // Rule 2: One review per user per product
    const existingReview = await ProductReviewModel.findByUserAndProduct(userId, productId);
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a review for this product.',
      });
    }

    // Create review
    await ProductReviewModel.create({
      product_id: productId,
      user_id: userId,
      rating: numRating,
      title: title.trim(),
      review: review.trim(),
      verified_purchase: true,
    });

    const [reviews, summary] = await Promise.all([
      ProductReviewModel.findByProductId(productId),
      ProductReviewModel.getRatingSummary(productId),
    ]);

    return res.status(201).json({
      success: true,
      message: 'Review posted successfully!',
      data: {
        average_rating: summary.average_rating,
        total_reviews: summary.review_count,
        review_count: summary.review_count,
        rating_distribution: summary.rating_distribution,
        reviews,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ── PUT /api/reviews/:reviewId ────────────────────────────────────────────────
export const updateReview = async (req, res, next) => {
  try {
    const reviewId = Number(req.params.reviewId);
    if (!reviewId || isNaN(reviewId)) {
      return res.status(400).json({ success: false, message: 'Invalid review ID.' });
    }

    const userId = await resolveUserId(req.decodedUser);
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User authentication failed.' });
    }

    const existingReview = await ProductReviewModel.findById(reviewId);
    if (!existingReview) {
      return res.status(404).json({ success: false, message: 'Review not found.' });
    }

    // Rule: User can edit only their own review
    if (existingReview.user_id !== userId) {
      return res.status(403).json({ success: false, message: 'You can only edit your own review.' });
    }

    const { rating, title, review } = req.body;
    const numRating = rating !== undefined ? Number(rating) : existingReview.rating;
    const newTitle = title !== undefined ? title.trim() : existingReview.title;
    const newReview = review !== undefined ? review.trim() : existingReview.review;

    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be a number between 1 and 5.' });
    }

    if (!newTitle) {
      return res.status(400).json({ success: false, message: 'Review title cannot be empty.' });
    }

    if (!newReview) {
      return res.status(400).json({ success: false, message: 'Review description cannot be empty.' });
    }

    await ProductReviewModel.updateById(reviewId, userId, {
      rating: numRating,
      title: newTitle,
      review: newReview,
    });

    const updated = await ProductReviewModel.findById(reviewId);

    return res.status(200).json({
      success: true,
      message: 'Review updated successfully!',
      data: { review: updated },
    });
  } catch (error) {
    next(error);
  }
};

// ── DELETE /api/reviews/:reviewId ─────────────────────────────────────────────
export const deleteReview = async (req, res, next) => {
  try {
    const reviewId = Number(req.params.reviewId);
    if (!reviewId || isNaN(reviewId)) {
      return res.status(400).json({ success: false, message: 'Invalid review ID.' });
    }

    const userId = await resolveUserId(req.decodedUser);
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User authentication failed.' });
    }

    const existingReview = await ProductReviewModel.findById(reviewId);
    if (!existingReview) {
      return res.status(404).json({ success: false, message: 'Review not found.' });
    }

    // Rule: User can delete only their own review
    if (existingReview.user_id !== userId) {
      return res.status(403).json({ success: false, message: 'You can only delete your own review.' });
    }

    await ProductReviewModel.deleteById(reviewId, userId);

    return res.status(200).json({
      success: true,
      message: 'Review deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};
