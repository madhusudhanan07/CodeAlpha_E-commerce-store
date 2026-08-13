/**
 * CartItem.js — Cart Item Model (Firestore)
 *
 * Provides reusable query functions for the `cart_items` Firestore collection.
 * Document ID = "{userId}_{productId}" to enforce uniqueness per user-product pair.
 * Preserves the exact same exported function signatures as the MySQL version.
 */

import db from '../config/db.js';

const COL = 'cart_items';

// ── Helpers ───────────────────────────────────────────────────────────────────

const cartDocId = (userId, productId) => `${userId}_${productId}`;

const enrichItem = async (data) => {
  // Fetch product details for the cart item
  const productDoc = await db.collection('products').doc(String(data.product_id)).get();
  const product = productDoc.exists ? productDoc.data() : {};

  const categoryName = product.category_name ?? null;

  return {
    id: `${data.user_id}_${data.product_id}`,
    user_id: data.user_id,
    product_id: data.product_id,
    quantity: data.quantity,
    created_at: data.created_at ?? null,
    product_name: product.name ?? null,
    product_slug: product.slug ?? null,
    product_image: product.image_url ?? null,
    product_price: Number(product.price ?? 0),
    product_stock: Number(product.stock ?? 0),
    product_category: categoryName,
  };
};

// ── READ ──────────────────────────────────────────────────────────────────────

/**
 * Fetch all cart items for a given user, joining product details.
 * @param {string} userId  — Firebase UID
 * @returns {Promise<Array>}
 */
export const findByUserId = async (userId) => {
  const snap = await db.collection(COL)
    .where('user_id', '==', String(userId))
    .get();

  const items = await Promise.all(snap.docs.map((doc) => enrichItem(doc.data())));
  return items.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
};

/**
 * Find a specific cart item by user and product.
 * @param {string} userId
 * @param {string|number} productId
 * @returns {Promise<Object|null>}
 */
export const findByUserAndProduct = async (userId, productId) => {
  const doc = await db.collection(COL).doc(cartDocId(userId, productId)).get();
  if (!doc.exists) return null;
  return enrichItem(doc.data());
};

/**
 * Return the total number of items in a user's cart (sum of quantities).
 * @param {string} userId
 * @returns {Promise<number>}
 */
export const countByUserId = async (userId) => {
  const snap = await db.collection(COL).where('user_id', '==', String(userId)).get();
  return snap.docs.reduce((sum, doc) => sum + (doc.data().quantity ?? 0), 0);
};

// ── CREATE / UPDATE ───────────────────────────────────────────────────────────

/**
 * Add a product to the cart or increment its quantity if already present.
 * @param {string} userId
 * @param {string|number} productId
 * @param {number} quantity
 * @returns {Promise<Object>} { affectedRows: 1 }
 */
export const upsert = async (userId, productId, quantity = 1) => {
  const docRef = db.collection(COL).doc(cartDocId(userId, productId));
  const doc = await docRef.get();

  if (doc.exists) {
    const currentQty = doc.data().quantity ?? 0;
    await docRef.update({ quantity: currentQty + quantity });
  } else {
    await docRef.set({
      user_id: String(userId),
      product_id: String(productId),
      quantity,
      created_at: new Date().toISOString(),
    });
  }
  return { affectedRows: 1 };
};

// ── UPDATE ────────────────────────────────────────────────────────────────────

/**
 * Set the exact quantity for a cart item.
 * @param {string} userId
 * @param {string|number} productId
 * @param {number} quantity
 * @returns {Promise<Object>} { affectedRows: 1 }
 */
export const updateQuantity = async (userId, productId, quantity) => {
  await db.collection(COL).doc(cartDocId(userId, productId)).update({ quantity });
  return { affectedRows: 1 };
};

// ── DELETE ────────────────────────────────────────────────────────────────────

/**
 * Remove a specific product from a user's cart.
 * @param {string} userId
 * @param {string|number} productId
 * @returns {Promise<Object>} { affectedRows: 1 }
 */
export const removeItem = async (userId, productId) => {
  await db.collection(COL).doc(cartDocId(userId, productId)).delete();
  return { affectedRows: 1 };
};

/**
 * Clear all items from a user's cart (called after successful order placement).
 * @param {string} userId
 * @returns {Promise<Object>} { affectedRows: number }
 */
export const clearByUserId = async (userId) => {
  const snap = await db.collection(COL).where('user_id', '==', String(userId)).get();
  const batch = db.batch();
  snap.docs.forEach((doc) => batch.delete(doc.ref));
  await batch.commit();
  return { affectedRows: snap.size };
};
