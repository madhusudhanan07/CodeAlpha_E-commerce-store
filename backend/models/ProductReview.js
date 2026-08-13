/**
 * ProductReview.js — Product Review Model (Firestore)
 *
 * Provides reusable query functions for the `product_reviews` Firestore collection.
 * Document ID = "{productId}_{userId}" to enforce one review per user per product.
 * Preserves the exact same exported function signatures as the MySQL version.
 */

import db from '../config/db.js';

const COL = 'product_reviews';

// ── Helpers ───────────────────────────────────────────────────────────────────

const reviewDocId = (productId, userId) => `${productId}_${userId}`;

const docToRow = (doc) => {
  const data = doc.data();
  const userName = data.user_name ?? 'Customer';
  return {
    id: doc.id,
    product_id: data.product_id,
    user_id: data.user_id,
    rating: Number(data.rating ?? 5),
    title: data.title ?? '',
    review: data.review ?? '',
    verified_purchase: data.verified_purchase !== false ? 1 : 0,
    created_at: data.created_at ?? null,
    updated_at: data.updated_at ?? null,
    user_name: userName,
    user_email: data.user_email ?? null,
    firebase_uid: data.user_id ?? null,
    user_avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=6c63ff&color=fff`,
    status: data.status ?? 'Approved',
    is_hidden: data.is_hidden ?? false,
  };
};

// ── READ ──────────────────────────────────────────────────────────────────────

/**
 * Fetch all reviews for a product. Client-side sort avoids composite index.
 * @param {string|number} productId
 * @returns {Promise<Array>}
 */
export const findByProductId = async (productId) => {
  const snap = await db.collection(COL)
    .where('product_id', '==', String(productId))
    .get();
  return snap.docs.map(docToRow).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
};

/**
 * Get single review by document ID.
 * @param {string} reviewId
 * @returns {Promise<Object|null>}
 */
export const findById = async (reviewId) => {
  const doc = await db.collection(COL).doc(String(reviewId)).get();
  return doc.exists ? docToRow(doc) : null;
};

/**
 * Check if user already reviewed a product.
 * @param {string} userId
 * @param {string|number} productId
 * @returns {Promise<Object|null>}
 */
export const findByUserAndProduct = async (userId, productId) => {
  const doc = await db.collection(COL).doc(reviewDocId(productId, userId)).get();
  return doc.exists ? docToRow(doc) : null;
};

/**
 * Get average rating, total count, and rating distribution for a product.
 * @param {string|number} productId
 * @returns {Promise<{ average_rating, review_count, rating_distribution }>}
 */
export const getRatingSummary = async (productId) => {
  const snap = await db.collection(COL)
    .where('product_id', '==', String(productId))
    .get();

  if (snap.empty) {
    return {
      average_rating: 5.0,
      review_count: 0,
      rating_distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    };
  }

  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let total = 0;

  snap.docs.forEach((doc) => {
    const r = Number(doc.data().rating ?? 5);
    total += r;
    if (distribution[r] !== undefined) distribution[r]++;
  });

  const avg = total / snap.size;

  return {
    average_rating: Number(avg.toFixed(1)),
    review_count: snap.size,
    rating_distribution: distribution,
  };
};

/**
 * Check if a user has purchased a product (by checking orders).
 * @param {string} userId
 * @param {string|number} productId
 * @returns {Promise<boolean>}
 */
export const hasUserPurchased = async (userId, productId) => {
  const snap = await db.collection('orders')
    .where('user_id', '==', String(userId))
    .get();

  for (const doc of snap.docs) {
    const items = doc.data().items ?? [];
    if (items.some((item) => String(item.product_id) === String(productId))) {
      return true;
    }
  }
  return false;
};

// ── CREATE ────────────────────────────────────────────────────────────────────

/**
 * Create a new review.
 * @param {{ product_id, user_id, rating, title, review, verified_purchase }} data
 * @returns {Promise<Object>} { insertId }
 */
export const create = async ({
  product_id,
  user_id,
  rating,
  title,
  review,
  verified_purchase = true,
}) => {
  // Fetch user name and email
  let user_name = 'Verified Customer';
  let user_email = null;
  const userDoc = await db.collection('users').doc(String(user_id)).get();
  if (userDoc.exists) {
    user_name = userDoc.data().full_name ?? user_name;
    user_email = userDoc.data().email ?? null;
  }

  const docId = reviewDocId(product_id, user_id);
  const now = new Date().toISOString();

  await db.collection(COL).doc(docId).set({
    product_id: String(product_id),
    user_id: String(user_id),
    rating: Number(rating),
    title,
    review,
    verified_purchase: Boolean(verified_purchase),
    user_name,
    user_email,
    status: 'Approved',
    is_hidden: false,
    report_count: 0,
    created_at: now,
    updated_at: now,
  });

  return { insertId: docId };
};

/**
 * Bulk create reviews (compatibility with existing seed/controller calls).
 * @param {string|number} productId
 * @param {Array} reviews
 * @returns {Promise<Object>}
 */
export const bulkCreate = async (productId, reviews) => {
  const batch = db.batch();
  const now = new Date().toISOString();

  for (const rev of reviews) {
    // Use a unique doc ID for seeded reviews
    const docId = `${productId}_${rev.user_name?.replace(/\s/g, '_') ?? Date.now()}`;
    const docRef = db.collection(COL).doc(docId);
    batch.set(docRef, {
      product_id: String(productId),
      user_id: rev.user_id ? String(rev.user_id) : 'seed',
      rating: Number(rev.rating ?? 5),
      title: rev.title ?? 'Great Product',
      review: rev.review ?? rev.comment ?? '',
      verified_purchase: rev.verified_purchase !== false,
      user_name: rev.user_name ?? 'Verified Customer',
      user_email: rev.user_email ?? null,
      status: 'Approved',
      is_hidden: false,
      report_count: 0,
      created_at: rev.created_at ?? now,
      updated_at: now,
    }, { merge: true });
  }

  await batch.commit();
  return { affectedRows: reviews.length };
};

// ── UPDATE ────────────────────────────────────────────────────────────────────

/**
 * Update an existing review by ID and user_id.
 * @param {string} reviewId
 * @param {string} userId
 * @param {{ rating, title, review }} fields
 * @returns {Promise<Object>} { affectedRows: 1 }
 */
export const updateById = async (reviewId, userId, { rating, title, review }) => {
  const doc = await db.collection(COL).doc(String(reviewId)).get();
  if (!doc.exists || doc.data().user_id !== String(userId)) {
    return { affectedRows: 0 };
  }
  await db.collection(COL).doc(String(reviewId)).update({
    rating: Number(rating),
    title,
    review,
    updated_at: new Date().toISOString(),
  });
  return { affectedRows: 1 };
};

// ── DELETE ────────────────────────────────────────────────────────────────────

/**
 * Delete a review by ID and user_id.
 * @param {string} reviewId
 * @param {string} userId
 * @returns {Promise<Object>} { affectedRows: 1 }
 */
export const deleteById = async (reviewId, userId) => {
  const doc = await db.collection(COL).doc(String(reviewId)).get();
  if (!doc.exists || doc.data().user_id !== String(userId)) {
    return { affectedRows: 0 };
  }
  await db.collection(COL).doc(String(reviewId)).delete();
  return { affectedRows: 1 };
};
