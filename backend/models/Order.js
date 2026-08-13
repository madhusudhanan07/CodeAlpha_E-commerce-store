/**
 * Order.js — Order Model (Firestore)
 *
 * Provides reusable query functions for the `orders` Firestore collection.
 * Order items are stored as a nested `items[]` array inside each order document
 * (instead of a separate order_items collection) — this is idiomatic Firestore
 * and eliminates the need for JOIN queries.
 *
 * Preserves the exact same exported function signatures as the MySQL version.
 */

import db from '../config/db.js';

const COL = 'orders';

export const ORDER_STATUS   = Object.freeze(['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']);
export const PAYMENT_STATUS = Object.freeze(['Pending', 'Paid', 'Failed']);

// ── Helpers ───────────────────────────────────────────────────────────────────

const docToRow = (doc) => {
  const data = doc.data();
  return {
    id: doc.id,
    user_id: data.user_id,
    total_amount: Number(data.total_amount ?? 0),
    order_status: data.order_status ?? 'Pending',
    payment_status: data.payment_status ?? 'Pending',
    payment_method: data.payment_method ?? 'Cash on Delivery',
    shipping_address: data.shipping_address ?? null,
    items: data.items ?? [],
    created_at: data.created_at ?? null,
  };
};

// ── READ ──────────────────────────────────────────────────────────────────────

/**
 * Fetch all orders for a given user, newest first.
 * Client-side sort to avoid composite index.
 * @param {string} userId  — Firebase UID
 * @returns {Promise<Array>}
 */
export const findByUserId = async (userId) => {
  const snap = await db.collection(COL)
    .where('user_id', '==', String(userId))
    .get();
  return snap.docs.map(docToRow).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
};

/**
 * Find a single order by its Firestore document ID.
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
export const findById = async (id) => {
  const doc = await db.collection(COL).doc(String(id)).get();
  return doc.exists ? docToRow(doc) : null;
};

/**
 * Find a single order by ID, verifying it belongs to the given user.
 * @param {string} id
 * @param {string} userId  — Firebase UID
 * @returns {Promise<Object|null>}
 */
export const findByIdAndUser = async (id, userId) => {
  const doc = await db.collection(COL).doc(String(id)).get();
  if (!doc.exists) return null;
  const data = doc.data();
  if (data.user_id !== String(userId)) return null;
  return docToRow(doc);
};

/**
 * Fetch all orders (admin use). Sorted client-side.
 * @returns {Promise<Array>}
 */
export const findAllOrders = async () => {
  const snap = await db.collection(COL).get();
  return snap.docs.map(docToRow).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
};

// ── CREATE ────────────────────────────────────────────────────────────────────

/**
 * Insert a new order record.
 * @param {{ user_id, total_amount, order_status, payment_status, payment_method, shipping_address, items }} data
 * @returns {Promise<Object>} { insertId: newDocId }
 */
export const create = async ({
  user_id,
  total_amount,
  order_status     = 'Pending',
  payment_status   = 'Pending',
  payment_method   = 'Cash on Delivery',
  shipping_address = null,
  items            = [],
}) => {
  const docRef = db.collection(COL).doc(); // auto-generate ID
  await docRef.set({
    user_id: String(user_id),
    total_amount: Number(total_amount),
    order_status,
    payment_status,
    payment_method,
    shipping_address: shipping_address ?? null,
    items,
    created_at: new Date().toISOString(),
  });
  return { insertId: docRef.id };
};

// ── UPDATE ────────────────────────────────────────────────────────────────────

/**
 * Update the order_status for a given order.
 * @param {string} id
 * @param {string} status
 * @returns {Promise<Object>} { affectedRows: 1 }
 */
export const updateOrderStatus = async (id, status) => {
  await db.collection(COL).doc(String(id)).update({ order_status: status });
  return { affectedRows: 1 };
};

/**
 * Update the payment_status for a given order.
 * @param {string} id
 * @param {string} status
 * @returns {Promise<Object>} { affectedRows: 1 }
 */
export const updatePaymentStatus = async (id, status) => {
  await db.collection(COL).doc(String(id)).update({ payment_status: status });
  return { affectedRows: 1 };
};
