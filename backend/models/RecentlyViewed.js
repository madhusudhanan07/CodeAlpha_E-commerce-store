/**
 * RecentlyViewed.js — Recently Viewed Products Model
 *
 * Stores and retrieves recently viewed product history for both logged-in users and guest sessions.
 */

import pool from '../config/db.js';

// Auto-ensure table exists
const ensureTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS recently_viewed (
        id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        user_id    BIGINT UNSIGNED     NULL,
        session_id VARCHAR(128)        NULL,
        product_id BIGINT UNSIGNED NOT NULL,
        viewed_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY uq_user_product (user_id, product_id),
        UNIQUE KEY uq_session_product (session_id, product_id),
        INDEX idx_recently_user (user_id),
        INDEX idx_recently_session (session_id),
        CONSTRAINT fk_recently_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
        CONSTRAINT fk_recently_product FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
  } catch (err) {
    console.error('Error ensuring recently_viewed table:', err.message);
  }
};

ensureTable();

/**
 * Record a product view for a logged-in user or guest session.
 */
export const recordView = async ({ userId = null, sessionId = null, productId }) => {
  if (userId) {
    await pool.query(
      `INSERT INTO recently_viewed (user_id, product_id, viewed_at)
       VALUES (?, ?, NOW())
       ON DUPLICATE KEY UPDATE viewed_at = NOW()`,
      [userId, productId],
    );
  } else if (sessionId) {
    await pool.query(
      `INSERT INTO recently_viewed (session_id, product_id, viewed_at)
       VALUES (?, ?, NOW())
       ON DUPLICATE KEY UPDATE viewed_at = NOW()`,
      [sessionId, productId],
    );
  }
};

/**
 * Get up to 10 recently viewed products for a user or session.
 */
export const findRecent = async ({ userId = null, sessionId = null, limit = 10 }) => {
  let rows = [];
  if (userId) {
    [rows] = await pool.query(
      `SELECT p.*, c.name AS category_name, c.slug AS category_slug, rv.viewed_at
       FROM recently_viewed rv
       INNER JOIN products p ON p.id = rv.product_id
       LEFT JOIN categories c ON c.id = p.category_id
       WHERE rv.user_id = ?
       ORDER BY rv.viewed_at DESC
       LIMIT ?`,
      [userId, limit],
    );
  } else if (sessionId) {
    [rows] = await pool.query(
      `SELECT p.*, c.name AS category_name, c.slug AS category_slug, rv.viewed_at
       FROM recently_viewed rv
       INNER JOIN products p ON p.id = rv.product_id
       LEFT JOIN categories c ON c.id = p.category_id
       WHERE rv.session_id = ?
       ORDER BY rv.viewed_at DESC
       LIMIT ?`,
      [sessionId, limit],
    );
  }
  return rows;
};
