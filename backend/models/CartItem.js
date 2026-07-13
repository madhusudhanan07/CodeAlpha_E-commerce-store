/**
 * CartItem.js — Cart Item Model
 *
 * Provides reusable, parameterised query functions for the `cart_items` table.
 * Uses the existing MySQL connection pool from config/db.js.
 *
 * Responsibilities:
 *  - Manage a user's active shopping cart at the database level
 *  - No business logic, no HTTP handling, no routing
 *
 * Schema notes:
 *  - The table has a UNIQUE KEY on (user_id, product_id), so a user
 *    cannot have duplicate rows for the same product.
 *  - `upsert` leverages INSERT ... ON DUPLICATE KEY UPDATE to add to
 *    an existing quantity or create a new row.
 */

import pool from '../config/db.js';

// ── READ ──────────────────────────────────────────────────────────────────────

/**
 * Fetch all cart items for a given user, joining product details.
 * @param {number} userId
 * @returns {Promise<Array>} Array of cart item rows with product info
 */
export const findByUserId = async (userId) => {
  const [rows] = await pool.query(
    `SELECT
       ci.id,
       ci.user_id,
       ci.product_id,
       ci.quantity,
       ci.created_at,
       p.name        AS product_name,
       p.slug        AS product_slug,
       p.image_url   AS product_image,
       p.price       AS product_price,
       p.stock       AS product_stock,
       c.name        AS product_category
     FROM cart_items ci
     INNER JOIN products p ON p.id = ci.product_id
     LEFT JOIN categories c ON p.category_id = c.id
     WHERE ci.user_id = ?
     ORDER BY ci.created_at DESC`,
    [userId],
  );
  return rows;
};

/**
 * Find a specific cart item by user and product (checks if product is in cart).
 * @param {number} userId
 * @param {number} productId
 * @returns {Promise<Object|null>} Cart item row or null
 */
export const findByUserAndProduct = async (userId, productId) => {
  const [rows] = await pool.query(
    'SELECT * FROM cart_items WHERE user_id = ? AND product_id = ? LIMIT 1',
    [userId, productId],
  );
  return rows[0] ?? null;
};

/**
 * Return the total number of items in a user's cart (sum of quantities).
 * Useful for the cart badge in the Navbar.
 * @param {number} userId
 * @returns {Promise<number>} Total item count
 */
export const countByUserId = async (userId) => {
  const [rows] = await pool.query(
    'SELECT COALESCE(SUM(quantity), 0) AS total FROM cart_items WHERE user_id = ?',
    [userId],
  );
  return Number(rows[0].total);
};

// ── CREATE / UPDATE ───────────────────────────────────────────────────────────

/**
 * Add a product to the cart or increment its quantity if already present.
 * Uses INSERT ... ON DUPLICATE KEY UPDATE to honour the unique constraint.
 * @param {number} userId
 * @param {number} productId
 * @param {number} quantity  - Units to add (default 1)
 * @returns {Promise<Object>} mysql2 OkPacket
 */
export const upsert = async (userId, productId, quantity = 1) => {
  const [result] = await pool.query(
    `INSERT INTO cart_items (user_id, product_id, quantity)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)`,
    [userId, productId, quantity],
  );
  return result;
};

// ── UPDATE ────────────────────────────────────────────────────────────────────

/**
 * Set the exact quantity for a cart item (replaces, not increments).
 * @param {number} userId
 * @param {number} productId
 * @param {number} quantity  - New absolute quantity
 * @returns {Promise<Object>} mysql2 OkPacket
 */
export const updateQuantity = async (userId, productId, quantity) => {
  const [result] = await pool.query(
    'UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ?',
    [quantity, userId, productId],
  );
  return result;
};

// ── DELETE ────────────────────────────────────────────────────────────────────

/**
 * Remove a specific product from a user's cart.
 * @param {number} userId
 * @param {number} productId
 * @returns {Promise<Object>} mysql2 OkPacket
 */
export const removeItem = async (userId, productId) => {
  const [result] = await pool.query(
    'DELETE FROM cart_items WHERE user_id = ? AND product_id = ?',
    [userId, productId],
  );
  return result;
};

/**
 * Clear all items from a user's cart (called after successful order placement).
 * @param {number} userId
 * @returns {Promise<Object>} mysql2 OkPacket
 */
export const clearByUserId = async (userId) => {
  const [result] = await pool.query(
    'DELETE FROM cart_items WHERE user_id = ?',
    [userId],
  );
  return result;
};
