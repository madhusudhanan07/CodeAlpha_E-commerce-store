/**
 * FrequentlyBought.js — Frequently Bought Together Model (Firestore)
 *
 * Provides reusable query functions for the `frequently_bought` Firestore collection.
 * Document ID = "{productId}_{accessoryId}" to enforce uniqueness.
 * Preserves the exact same exported function signatures as the MySQL version.
 */

import db from '../config/db.js';

const COL = 'frequently_bought';

/**
 * Fetch frequently bought accessories for a given product.
 * @param {string|number} productId
 * @returns {Promise<Array>}
 */
export const findByProductId = async (productId) => {
  const snap = await db.collection(COL)
    .where('product_id', '==', String(productId))
    .get();

  const results = await Promise.all(
    snap.docs.map(async (doc) => {
      const { accessory_id, bundle_discount } = doc.data();
      const productDoc = await db.collection('products').doc(String(accessory_id)).get();
      if (!productDoc.exists) return null;
      const p = productDoc.data();
      return {
        id: doc.id,
        bundle_discount,
        ...p,
        id: p.id ?? accessory_id,
        category_name: p.category_name ?? null,
        category_slug: p.category_slug ?? null,
      };
    }),
  );

  return results.filter(Boolean);
};

/**
 * Bulk insert frequently bought accessories pairs.
 * @param {Array<{ product_id, accessory_id, bundle_discount }>} pairs
 * @returns {Promise<Object>} { affectedRows: pairs.length }
 */
export const bulkCreate = async (pairs) => {
  if (!pairs || pairs.length === 0) return { affectedRows: 0 };
  const batch = db.batch();

  for (const pair of pairs) {
    const docId = `${pair.product_id}_${pair.accessory_id}`;
    const ref = db.collection(COL).doc(docId);
    batch.set(ref, {
      product_id: String(pair.product_id),
      accessory_id: String(pair.accessory_id),
      bundle_discount: pair.bundle_discount ?? 10,
    }, { merge: true });
  }

  await batch.commit();
  return { affectedRows: pairs.length };
};
