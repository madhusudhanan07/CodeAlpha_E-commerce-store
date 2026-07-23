/**
 * testReviewsAPI.js — Backend Verification Script for Reviews & Ratings API
 */

import pool from '../config/db.js';
import * as ProductReviewModel from '../models/ProductReview.js';

const testAPI = async () => {
  try {
    console.log('🧪 Testing Product Reviews Model & DB Integration...');

    // 1. Get rating summary for product ID 1
    const summary = await ProductReviewModel.getRatingSummary(1);
    console.log('📊 Product 1 Rating Summary:', summary);

    if (typeof summary.average_rating !== 'number' || typeof summary.review_count !== 'number') {
      throw new Error('Rating summary returned invalid types');
    }
    if (!summary.rating_distribution || typeof summary.rating_distribution[5] !== 'number') {
      throw new Error('Rating distribution missing or invalid');
    }

    // 2. Fetch reviews list for product ID 1
    const reviews = await ProductReviewModel.findByProductId(1);
    console.log(`💬 Product 1 Reviews Count: ${reviews.length}`);
    if (reviews.length > 0) {
      console.log('Sample Review:', {
        id: reviews[0].id,
        user_name: reviews[0].user_name,
        rating: reviews[0].rating,
        title: reviews[0].title,
        verified_purchase: reviews[0].verified_purchase,
      });
    }

    // 3. Check Purchase Verification for non-buyer
    const dummyUserHasPurchased = await ProductReviewModel.hasUserPurchased(999999, 1);
    console.log(`🛍️ Non-buyer purchase check (User 999999, Product 1): ${dummyUserHasPurchased}`);
    if (dummyUserHasPurchased !== false) {
      throw new Error('Purchase check failed for non-buyer');
    }

    console.log('✅ ALL BACKEND REVIEWS & RATINGS TESTS PASSED SUCCESSFULLY!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Verification failed:', err.message);
    process.exit(1);
  }
};

testAPI();
