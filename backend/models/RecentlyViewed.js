/**
 * RecentlyViewed.js — Recently Viewed Products Model (Firestore)
 *
 * Provides reusable query functions for the `recently_viewed` Firestore collection.
 * Document ID = "{userId}_{productId}" or "{sessionId}_{productId}".
 * Preserves the exact same exported function signatures as the MySQL version.
 */

import db from '../config/db.js';

const COL = 'recently_viewed';

/**
 * Record a product view for a logged-in user or guest session.
 * @param {{ userId?, sessionId?, productId }} params
 */
export const recordView = async ({ userId = null, sessionId = null, productId }) => {
  const key = userId ? `user_${userId}_${productId}` : `session_${sessionId}_${productId}`;
  await db.collection(COL).doc(key).set(
    {
      user_id: userId ? String(userId) : null,
      session_id: sessionId ?? null,
      product_id: String(productId),
      viewed_at: new Date().toISOString(),
    },
    { merge: true },
  );
};

/**
 * Get up to 10 recently viewed products for a user or session.
 * @param {{ userId?, sessionId?, limit? }} params
 * @returns {Promise<Array>}
 */
export const findRecent = async ({ userId = null, sessionId = null, limit = 10 }) => {
  let snap;

  if (userId) {
    snap = await db.collection(COL)
      .where('user_id', '==', String(userId))
      .get();
  } else if (sessionId) {
    snap = await db.collection(COL)
      .where('session_id', '==', String(sessionId))
      .get();
  } else {
    return [];
  }

  // Sort by viewed_at client-side and limit
  const sortedDocs = snap.docs
    .sort((a, b) => new Date(b.data().viewed_at) - new Date(a.data().viewed_at))
    .slice(0, limit);

  const results = await Promise.all(
    sortedDocs.map(async (doc) => {
      const { product_id, viewed_at } = doc.data();
      const productDoc = await db.collection('products').doc(String(product_id)).get();
      if (!productDoc.exists) return null;
      const p = productDoc.data();
      return {
        ...p,
        id: p.id ?? product_id,
        category_name: p.category_name ?? null,
        category_slug: p.category_slug ?? null,
        viewed_at,
      };
    }),
  );

  return results.filter(Boolean);
};
