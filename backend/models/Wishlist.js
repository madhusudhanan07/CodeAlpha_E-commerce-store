/**
 * Wishlist.js — Wishlist (Favorites) Model
 *
 * Provides reusable query functions for the `wishlist` table.
 * Uses the existing MySQL connection pool from config/db.js.
 */

import pool from '../config/db.js';

// Auto-ensure table exists at runtime
const ensureTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS wishlist (
        id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        user_id      BIGINT UNSIGNED NOT NULL,
        product_id   BIGINT UNSIGNED NOT NULL,
        created_at   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY uq_wishlist_user_product (user_id, product_id),
        CONSTRAINT fk_wishlist_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
        CONSTRAINT fk_wishlist_product FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
  } catch (err) {
    console.error('Error ensuring wishlist table exists:', err.message);
  }
};

ensureTable();

// ── READ ──────────────────────────────────────────────────────────────────────

/**
 * Fetch all wishlist items for a given user, joining full product details.
 * @param {number} userId
 * @returns {Promise<Array>} Array of product rows saved in wishlist
 */
export const findByUserId = async (userId) => {
  const [rows] = await pool.query(
    `SELECT
       p.id,
       p.category_id,
       c.name  AS category_name,
       c.slug  AS category_slug,
       p.name,
       p.slug,
       p.description,
       p.image_url,
       p.price,
       p.stock,
       p.is_featured,
       w.created_at AS saved_at
     FROM wishlist w
     INNER JOIN products p ON p.id = w.product_id
     LEFT JOIN categories c ON c.id = p.category_id
     WHERE w.user_id = ?
     ORDER BY w.created_at DESC`,
    [userId],
  );
  return rows;
};

/**
 * Check whether a product exists in user's wishlist.
 * @param {number} userId
 * @param {number} productId
 * @returns {Promise<boolean>} True if in wishlist
 */
export const existsInWishlist = async (userId, productId) => {
  const [rows] = await pool.query(
    'SELECT 1 FROM wishlist WHERE user_id = ? AND product_id = ? LIMIT 1',
    [userId, productId],
  );
  return rows.length > 0;
};

/**
 * Return count of saved wishlist items for a user.
 * @param {number} userId
 * @returns {Promise<number>} Item count
 */
export const countByUserId = async (userId) => {
  const [rows] = await pool.query(
    'SELECT COUNT(*) AS total FROM wishlist WHERE user_id = ?',
    [userId],
  );
  return Number(rows[0]?.total || 0);
};

// ── CREATE ────────────────────────────────────────────────────────────────────

/**
 * Add a product to a user's wishlist (prevents duplicate via IGNORE).
 * @param {number} userId
 * @param {number} productId
 * @returns {Promise<Object>} mysql2 OkPacket
 */
export const add = async (userId, productId) => {
  const [result] = await pool.query(
    'INSERT IGNORE INTO wishlist (user_id, product_id) VALUES (?, ?)',
    [userId, productId],
  );
  return result;
};

// ── DELETE ────────────────────────────────────────────────────────────────────

/**
 * Remove a product from a user's wishlist.
 * @param {number} userId
 * @param {number} productId
 * @returns {Promise<Object>} mysql2 OkPacket
 */
export const remove = async (userId, productId) => {
  const [result] = await pool.query(
    'DELETE FROM wishlist WHERE user_id = ? AND product_id = ?',
    [userId, productId],
  );
  return result;
};
