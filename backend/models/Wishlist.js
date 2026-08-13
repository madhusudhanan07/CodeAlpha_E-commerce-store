/**
 * Wishlist.js — Wishlist (Favorites) Model (Firestore)
 *
 * Provides reusable query functions for the `wishlist` Firestore collection.
 * Document ID = "{userId}_{productId}" to enforce uniqueness.
 * Preserves the exact same exported function signatures as the MySQL version.
 */

import db from '../config/db.js';

const COL = 'wishlist';

// ── Helpers ───────────────────────────────────────────────────────────────────

const wishDocId = (userId, productId) => `${userId}_${productId}`;

// ── READ ──────────────────────────────────────────────────────────────────────

/**
 * Fetch all wishlist items for a given user, joining full product details.
 * @param {string} userId  — Firebase UID
 * @returns {Promise<Array>}
 */
export const findByUserId = async (userId) => {
  const snap = await db.collection(COL)
    .where('user_id', '==', String(userId))
    .get();

  const results = await Promise.all(
    snap.docs.map(async (doc) => {
      const { product_id, created_at } = doc.data();
      const productDoc = await db.collection('products').doc(String(product_id)).get();
      if (!productDoc.exists) return null;

      const p = productDoc.data();
      return {
        id: p.id ?? product_id,
        category_id: p.category_id ?? null,
        category_name: p.category_name ?? null,
        category_slug: p.category_slug ?? null,
        name: p.name,
        slug: p.slug,
        description: p.description ?? null,
        image_url: p.image_url ?? null,
        price: Number(p.price ?? 0),
        stock: Number(p.stock ?? 0),
        is_featured: p.is_featured ? 1 : 0,
        saved_at: created_at,
      };
    }),
  );

  return results.filter(Boolean);
};

/**
 * Check whether a product exists in user's wishlist.
 * @param {string} userId
 * @param {string|number} productId
 * @returns {Promise<boolean>}
 */
export const existsInWishlist = async (userId, productId) => {
  const doc = await db.collection(COL).doc(wishDocId(userId, productId)).get();
  return doc.exists;
};

/**
 * Return count of saved wishlist items for a user.
 * @param {string} userId
 * @returns {Promise<number>}
 */
export const countByUserId = async (userId) => {
  const snap = await db.collection(COL).where('user_id', '==', String(userId)).get();
  return snap.size;
};

// ── CREATE ────────────────────────────────────────────────────────────────────

/**
 * Add a product to a user's wishlist (idempotent via set).
 * @param {string} userId
 * @param {string|number} productId
 * @returns {Promise<Object>} { affectedRows: 1 }
 */
export const add = async (userId, productId) => {
  await db.collection(COL).doc(wishDocId(userId, productId)).set(
    {
      user_id: String(userId),
      product_id: String(productId),
      created_at: new Date().toISOString(),
    },
    { merge: true },
  );
  return { affectedRows: 1 };
};

// ── DELETE ────────────────────────────────────────────────────────────────────

/**
 * Remove a product from a user's wishlist.
 * @param {string} userId
 * @param {string|number} productId
 * @returns {Promise<Object>} { affectedRows: 1 }
 */
export const remove = async (userId, productId) => {
  await db.collection(COL).doc(wishDocId(userId, productId)).delete();
  return { affectedRows: 1 };
};
