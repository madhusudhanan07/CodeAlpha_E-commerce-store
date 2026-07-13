/**
 * Order.js — Order Model
 *
 * Provides reusable, parameterised query functions for the `orders` table.
 * Uses the existing MySQL connection pool from config/db.js.
 *
 * Responsibilities:
 *  - Create orders and query order history
 *  - Update order and payment status
 *  - No business logic, no HTTP handling, no routing
 *
 * Schema notes:
 *  - shipping_address is stored as JSON in MySQL 8 (native JSON column).
 *  - order_status and payment_status are ENUM columns.
 *  - ON DELETE RESTRICT on users.id — order history is preserved.
 */

import pool from '../config/db.js';

// ── Valid ENUM values (mirrors the SQL schema) ────────────────────────────────
export const ORDER_STATUS   = Object.freeze(['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']);
export const PAYMENT_STATUS = Object.freeze(['Pending', 'Paid', 'Failed']);

// ── READ ──────────────────────────────────────────────────────────────────────

/**
 * Fetch all orders for a given user, newest first.
 * @param {number} userId
 * @returns {Promise<Array>} Array of order rows
 */
export const findByUserId = async (userId) => {
  const [rows] = await pool.query(
    `SELECT id, user_id, total_amount, order_status, payment_status,
            shipping_address, created_at
     FROM orders
     WHERE user_id = ?
     ORDER BY created_at DESC`,
    [userId],
  );
  return rows;
};

/**
 * Find a single order by its ID.
 * @param {number} id
 * @returns {Promise<Object|null>} Order row or null
 */
export const findById = async (id) => {
  const [rows] = await pool.query(
    `SELECT id, user_id, total_amount, order_status, payment_status,
            shipping_address, created_at
     FROM orders WHERE id = ? LIMIT 1`,
    [id],
  );
  return rows[0] ?? null;
};

/**
 * Find a single order by ID, verifying it belongs to the given user.
 * Prevents order-ID enumeration attacks at the model level.
 * @param {number} id
 * @param {number} userId
 * @returns {Promise<Object|null>} Order row or null
 */
export const findByIdAndUser = async (id, userId) => {
  const [rows] = await pool.query(
    `SELECT id, user_id, total_amount, order_status, payment_status,
            shipping_address, created_at
     FROM orders WHERE id = ? AND user_id = ? LIMIT 1`,
    [id, userId],
  );
  return rows[0] ?? null;
};

// ── CREATE ────────────────────────────────────────────────────────────────────

/**
 * Insert a new order record.
 * @param {{
 *   user_id:          number,
 *   total_amount:     number,
 *   order_status?:    string,
 *   payment_status?:  string,
 *   shipping_address?: object
 * }} data
 * @returns {Promise<Object>} mysql2 OkPacket (insertId = new order ID)
 */
export const create = async ({
  user_id,
  total_amount,
  order_status     = 'Pending',
  payment_status   = 'Pending',
  shipping_address = null,
}) => {
  const addressJson = shipping_address ? JSON.stringify(shipping_address) : null;
  const [result] = await pool.query(
    `INSERT INTO orders (user_id, total_amount, order_status, payment_status, shipping_address)
     VALUES (?, ?, ?, ?, ?)`,
    [user_id, total_amount, order_status, payment_status, addressJson],
  );
  return result;
};

// ── UPDATE ────────────────────────────────────────────────────────────────────

/**
 * Update the order_status for a given order.
 * @param {number} id
 * @param {string} status - Must be one of ORDER_STATUS values
 * @returns {Promise<Object>} mysql2 OkPacket
 */
export const updateOrderStatus = async (id, status) => {
  const [result] = await pool.query(
    'UPDATE orders SET order_status = ? WHERE id = ?',
    [status, id],
  );
  return result;
};

/**
 * Update the payment_status for a given order.
 * @param {number} id
 * @param {string} status - Must be one of PAYMENT_STATUS values
 * @returns {Promise<Object>} mysql2 OkPacket
 */
export const updatePaymentStatus = async (id, status) => {
  const [result] = await pool.query(
    'UPDATE orders SET payment_status = ? WHERE id = ?',
    [status, id],
  );
  return result;
};
