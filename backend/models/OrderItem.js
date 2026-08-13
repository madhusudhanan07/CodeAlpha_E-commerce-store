/**
 * OrderItem.js — Order Item Model (Firestore)
 *
 * Order items are embedded as `items[]` array inside each order document.
 * This model provides compatibility shim functions so the existing
 * productController and orderController don't need changes.
 *
 * findByOrderId() reads the items from the parent order document.
 */

import db from '../config/db.js';

const ORDER_COL = 'orders';

// ── READ ──────────────────────────────────────────────────────────────────────

/**
 * Fetch all line items for a given order.
 * Items are embedded in the order document's `items` array.
 * @param {string} orderId
 * @returns {Promise<Array>}
 */
export const findByOrderId = async (orderId) => {
  const doc = await db.collection(ORDER_COL).doc(String(orderId)).get();
  if (!doc.exists) return [];

  const items = doc.data().items ?? [];
  return items.map((item, idx) => ({
    id: `${orderId}_${idx}`,
    order_id: orderId,
    product_id: item.product_id,
    quantity: item.quantity,
    unit_price: Number(item.unit_price ?? item.price ?? 0),
    line_total: Number(item.line_total ?? (item.unit_price ?? item.price ?? 0) * item.quantity),
    product_name: item.product_name ?? null,
    product_slug: item.product_slug ?? null,
    product_image: item.product_image ?? null,
  }));
};

/**
 * Find a single order item by index-based ID (legacy compat).
 * @param {string} id  — format: "orderId_index"
 * @returns {Promise<Object|null>}
 */
export const findById = async (id) => {
  const [orderId, idx] = String(id).split('_');
  const items = await findByOrderId(orderId);
  return items[Number(idx)] ?? null;
};

// ── CREATE ────────────────────────────────────────────────────────────────────

/**
 * Bulk-insert order items into the parent order document.
 * This is called by orderController when placing an order.
 * @param {string} orderId
 * @param {Array<{ product_id, product_name, product_slug, product_image, quantity, unit_price }>} items
 * @returns {Promise<Object>} { affectedRows: items.length }
 */
export const bulkCreate = async (orderId, items) => {
  if (!items || items.length === 0) return { affectedRows: 0 };

  const formattedItems = items.map((item) => ({
    product_id: String(item.product_id),
    product_name: item.product_name ?? null,
    product_slug: item.product_slug ?? null,
    product_image: item.product_image ?? null,
    quantity: item.quantity,
    unit_price: Number(item.unit_price ?? item.price ?? 0),
    line_total: Number((item.unit_price ?? item.price ?? 0) * item.quantity),
  }));

  await db.collection(ORDER_COL).doc(String(orderId)).update({ items: formattedItems });
  return { affectedRows: items.length };
};

/**
 * Insert a single order line item (adds to the items array).
 * @param {{ order_id, product_id, quantity, price }} data
 * @returns {Promise<Object>} { affectedRows: 1 }
 */
export const create = async ({ order_id, product_id, quantity, price }) => {
  const doc = await db.collection(ORDER_COL).doc(String(order_id)).get();
  const existingItems = doc.exists ? (doc.data().items ?? []) : [];

  const productDoc = await db.collection('products').doc(String(product_id)).get();
  const product = productDoc.exists ? productDoc.data() : {};

  existingItems.push({
    product_id: String(product_id),
    product_name: product.name ?? null,
    product_slug: product.slug ?? null,
    product_image: product.image_url ?? null,
    quantity,
    unit_price: Number(price),
    line_total: Number(price) * quantity,
  });

  await db.collection(ORDER_COL).doc(String(order_id)).update({ items: existingItems });
  return { affectedRows: 1 };
};

// ── DELETE ────────────────────────────────────────────────────────────────────

/**
 * Clear all items for an order (not usually needed — handled by order deletion).
 * @param {string} orderId
 * @returns {Promise<Object>} { affectedRows: 1 }
 */
export const deleteByOrderId = async (orderId) => {
  await db.collection(ORDER_COL).doc(String(orderId)).update({ items: [] });
  return { affectedRows: 1 };
};
