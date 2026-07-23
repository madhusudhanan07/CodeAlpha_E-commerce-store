/**
 * ProductReview.js — Product Review Model
 *
 * Interacts with the `product_reviews` table in MySQL.
 */

import pool from '../config/db.js';

// Ensure table schema matches specs at runtime
const ensureTable = async () => {
  try {
    // Check if column user_id exists in product_reviews
    const [cols] = await pool.query(`SHOW COLUMNS FROM product_reviews LIKE 'user_id'`);
    if (cols.length === 0) {
      // Drop old incompatible table if present
      await pool.query('SET FOREIGN_KEY_CHECKS = 0');
      await pool.query('DROP TABLE IF EXISTS product_reviews');
      await pool.query('SET FOREIGN_KEY_CHECKS = 1');
    }

    await pool.query(`
      CREATE TABLE IF NOT EXISTS product_reviews (
        id                BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        product_id         BIGINT UNSIGNED NOT NULL,
        user_id            BIGINT UNSIGNED NOT NULL,
        rating            INT             NOT NULL DEFAULT 5,
        title             VARCHAR(255)    NOT NULL,
        review            TEXT            NOT NULL,
        verified_purchase TINYINT(1)      NOT NULL DEFAULT 1,
        created_at         DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at         DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY uq_reviews_product_user (product_id, user_id),
        INDEX idx_reviews_product_id (product_id),
        INDEX idx_reviews_user_id (user_id),
        CONSTRAINT fk_reviews_product FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE,
        CONSTRAINT fk_reviews_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
  } catch (err) {
    console.error('Error ensuring product_reviews table:', err.message);
  }
};

ensureTable();

/**
 * Fetch all reviews for a product with user details joined.
 * @param {number} productId
 * @returns {Promise<Array>}
 */
export const findByProductId = async (productId) => {
  const [rows] = await pool.query(
    `SELECT 
        pr.id,
        pr.product_id,
        pr.user_id,
        pr.rating,
        pr.title,
        pr.review,
        pr.verified_purchase,
        pr.created_at,
        pr.updated_at,
        u.full_name AS user_name,
        u.email AS user_email,
        u.firebase_uid
     FROM product_reviews pr
     INNER JOIN users u ON u.id = pr.user_id
     WHERE pr.product_id = ?
     ORDER BY pr.created_at DESC`,
    [productId],
  );

  return rows.map((r) => ({
    ...r,
    user_avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(r.user_name || 'Customer')}&background=6c63ff&color=fff`,
  }));
};

/**
 * Get single review by review ID.
 * @param {number} reviewId
 * @returns {Promise<Object|null>}
 */
export const findById = async (reviewId) => {
  const [rows] = await pool.query(
    `SELECT pr.*, u.full_name AS user_name, u.email AS user_email, u.firebase_uid
     FROM product_reviews pr
     INNER JOIN users u ON u.id = pr.user_id
     WHERE pr.id = ? LIMIT 1`,
    [reviewId],
  );
  if (rows.length === 0) return null;
  const r = rows[0];
  return {
    ...r,
    user_avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(r.user_name || 'Customer')}&background=6c63ff&color=fff`,
  };
};

/**
 * Get average rating, total count, and rating distribution for a product.
 * @param {number} productId
 * @returns {Promise<{ average_rating: number, review_count: number, rating_distribution: Object }>}
 */
export const getRatingSummary = async (productId) => {
  const [rows] = await pool.query(
    `SELECT 
        AVG(rating) AS avg_rating,
        COUNT(*) AS total_reviews,
        SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) AS count_5,
        SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) AS count_4,
        SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) AS count_3,
        SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) AS count_2,
        SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) AS count_1
     FROM product_reviews
     WHERE product_id = ?`,
    [productId],
  );

  const row = rows[0] || {};
  const avg = Number(row.avg_rating || 5.0);
  const total = Number(row.total_reviews || 0);

  return {
    average_rating: Number(avg.toFixed(1)),
    review_count: total,
    rating_distribution: {
      5: Number(row.count_5 || 0),
      4: Number(row.count_4 || 0),
      3: Number(row.count_3 || 0),
      2: Number(row.count_2 || 0),
      1: Number(row.count_1 || 0),
    },
  };
};

/**
 * Check if a user has purchased a product.
 * @param {number} userId
 * @param {number} productId
 * @returns {Promise<boolean>}
 */
export const hasUserPurchased = async (userId, productId) => {
  const [rows] = await pool.query(
    `SELECT oi.id 
     FROM order_items oi
     INNER JOIN orders o ON o.id = oi.order_id
     WHERE o.user_id = ? AND oi.product_id = ?
     LIMIT 1`,
    [userId, productId],
  );
  return rows.length > 0;
};

/**
 * Check if user already reviewed a product.
 * @param {number} userId
 * @param {number} productId
 * @returns {Promise<Object|null>}
 */
export const findByUserAndProduct = async (userId, productId) => {
  const [rows] = await pool.query(
    'SELECT * FROM product_reviews WHERE user_id = ? AND product_id = ? LIMIT 1',
    [userId, productId],
  );
  return rows[0] ?? null;
};

/**
 * Create a new review.
 * @param {{ product_id: number, user_id: number, rating: number, title: string, review: string, verified_purchase?: boolean }} data
 */
export const create = async ({ product_id, user_id, rating, title, review, verified_purchase = true }) => {
  const [result] = await pool.query(
    `INSERT INTO product_reviews (product_id, user_id, rating, title, review, verified_purchase)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [product_id, user_id, rating, title, review, verified_purchase ? 1 : 0],
  );
  return result;
};

/**
 * Update an existing review by ID and user_id.
 * @param {number} reviewId
 * @param {number} userId
 * @param {{ rating: number, title: string, review: string }} fields
 */
export const updateById = async (reviewId, userId, { rating, title, review }) => {
  const [result] = await pool.query(
    `UPDATE product_reviews
     SET rating = ?, title = ?, review = ?
     WHERE id = ? AND user_id = ?`,
    [rating, title, review, reviewId, userId],
  );
  return result;
};

/**
 * Delete a review by ID and user_id.
 * @param {number} reviewId
 * @param {number} userId
 */
export const deleteById = async (reviewId, userId) => {
  const [result] = await pool.query(
    'DELETE FROM product_reviews WHERE id = ? AND user_id = ?',
    [reviewId, userId],
  );
  return result;
};

