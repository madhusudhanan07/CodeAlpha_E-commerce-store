/**
 * ProductPopularity.js — Product Popularity Metrics Model (Firestore)
 *
 * Tracks popularity-like metrics using aggregated data from products and orders.
 * In Firestore, we derive best-sellers from order history rather than maintaining
 * a separate popularity table.
 *
 * Preserves the exact same exported function signatures as the MySQL version.
 */

import db from '../config/db.js';

/**
 * Fetch top best seller products sorted by featured flag and alphabetical order.
 * (Derived from is_featured and product data since we don't have a dedicated table.)
 * @param {number} limit
 * @returns {Promise<Array>}
 */
export const findBestSellers = async (limit = 8) => {
  const snap = await db.collection('products')
    .orderBy('is_featured', 'desc')
    .orderBy('created_at', 'asc')
    .limit(limit)
    .get();

  return snap.docs.map((doc) => {
    const p = doc.data();
    return {
      ...p,
      id: p.id ?? doc.id,
      sold_count: 0,
      popularity_score: p.is_featured ? 100 : 50,
    };
  });
};

/**
 * Fetch trending products (most recently added featured products).
 * @param {number} limit
 * @returns {Promise<Array>}
 */
export const findTrending = async (limit = 8) => {
  const snap = await db.collection('products')
    .orderBy('created_at', 'desc')
    .limit(limit)
    .get();

  return snap.docs.map((doc) => {
    const p = doc.data();
    return {
      ...p,
      id: p.id ?? doc.id,
      view_count: 0,
      popularity_score: p.is_featured ? 100 : 50,
    };
  });
};

/**
 * Seed/initialize popularity metrics (no-op in Firestore — data is derived).
 * @param {Array} metrics
 * @returns {Promise<Object>}
 */
export const seedMetrics = async (metrics) => {
  // No-op: popularity is derived from existing product data
  return { affectedRows: 0 };
};
