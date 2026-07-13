/**
 * OrderItem.js — Order Item Model
 *
 * Provides reusable, parameterised query functions for the `order_items` table.
 * Uses the existing MySQL connection pool from config/db.js.
 *
 * Responsibilities:
 *  - Insert and retrieve line items belonging to an order
 *  - No business logic, no HTTP handling, no routing
 *
 * Schema notes:
 *  - `price` is a snapshot of the product price at purchase time.
 *    It is intentionally DECOUPLED from products.price so that
 *    future price changes do not alter historical order totals.
 *  - ON DELETE CASCADE on orders.id — if an order is deleted, its
 *    line items are automatically removed.
 *  - ON DELETE RESTRICT on products.id — prevents deleting a product
 *    that appears in any historical order.
 */

import pool from '../config/db.js';

// ── READ ──────────────────────────────────────────────────────────────────────

/**
 * Fetch all line items for a given order, joining product details.
 * @param {number} orderId
 * @returns {Promise<Array>} Array of order item rows with product snapshot info
 */
export const findByOrderId = async (orderId) => {
  const [rows] = await pool.query(
    `SELECT
       oi.id,
       oi.order_id,
       oi.product_id,
       oi.quantity,
       oi.price          AS unit_price,
       (oi.quantity * oi.price) AS line_total,
       p.name            AS product_name,
       p.slug            AS product_slug,
       p.image_url       AS product_image
     FROM order_items oi
     INNER JOIN products p ON p.id = oi.product_id
     WHERE oi.order_id = ?
     ORDER BY oi.id ASC`,
    [orderId],
  );
  return rows;
};

/**
 * Find a single order item by its ID.
 * @param {number} id
 * @returns {Promise<Object|null>} Order item row or null
 */
export const findById = async (id) => {
  const [rows] = await pool.query(
    `SELECT oi.id, oi.order_id, oi.product_id, oi.quantity, oi.price
     FROM order_items oi WHERE oi.id = ? LIMIT 1`,
    [id],
  );
  return rows[0] ?? null;
};

// ── CREATE ────────────────────────────────────────────────────────────────────

/**
 * Insert a single order line item.
 * @param {{
 *   order_id:   number,
 *   product_id: number,
 *   quantity:   number,
 *   price:      number   — price per unit at time of purchase (snapshot)
 * }} data
 * @returns {Promise<Object>} mysql2 OkPacket
 */
export const create = async ({ order_id, product_id, quantity, price }) => {
  const [result] = await pool.query(
    'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
    [order_id, product_id, quantity, price],
  );
  return result;
};

/**
 * Bulk-insert multiple line items for a single order in one query.
 * Much more efficient than looping individual INSERT calls.
 *
 * @param {number} orderId
 * @param {Array<{ product_id: number, quantity: number, price: number }>} items
 * @returns {Promise<Object>} mysql2 OkPacket (affectedRows = items.length)
 */
export const bulkCreate = async (orderId, items) => {
  if (!items || items.length === 0) return { affectedRows: 0 };

  // Build parameterised multi-row VALUES clause
  const values   = items.map(({ product_id, quantity, price }) => [orderId, product_id, quantity, price]);
  const [result] = await pool.query(
    'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?',
    [values],
  );
  return result;
};

// ── DELETE ────────────────────────────────────────────────────────────────────

/**
 * Delete all line items belonging to an order.
 * Normally handled automatically by ON DELETE CASCADE on orders.id,
 * but exposed here for explicit use if needed.
 * @param {number} orderId
 * @returns {Promise<Object>} mysql2 OkPacket
 */
export const deleteByOrderId = async (orderId) => {
  const [result] = await pool.query(
    'DELETE FROM order_items WHERE order_id = ?',
    [orderId],
  );
  return result;
};
