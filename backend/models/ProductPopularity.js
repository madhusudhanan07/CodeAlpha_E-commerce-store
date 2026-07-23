/**
 * ProductPopularity.js — Product Popularity Metrics Model
 *
 * Tracks sales count, view count, wishlist count, and calculates popularity score.
 */

import pool from '../config/db.js';

// Auto-ensure table exists
const ensureTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS product_popularity (
        id               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        product_id       BIGINT UNSIGNED NOT NULL,
        sold_count       INT             NOT NULL DEFAULT 0,
        view_count       INT             NOT NULL DEFAULT 0,
        wishlist_count   INT             NOT NULL DEFAULT 0,
        popularity_score INT             NOT NULL DEFAULT 0,
        PRIMARY KEY (id),
        UNIQUE KEY uq_pop_product (product_id),
        CONSTRAINT fk_pop_product FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
  } catch (err) {
    console.error('Error ensuring product_popularity table:', err.message);
  }
};

ensureTable();

/**
 * Fetch top best seller products sorted by sold_count & popularity_score.
 */
export const findBestSellers = async (limit = 8) => {
  const [rows] = await pool.query(
    `SELECT p.*, c.name AS category_name, c.slug AS category_slug,
            COALESCE(pp.sold_count, 0) AS sold_count,
            COALESCE(pp.popularity_score, 0) AS popularity_score
     FROM products p
     LEFT JOIN product_popularity pp ON pp.product_id = p.id
     LEFT JOIN categories c ON c.id = p.category_id
     ORDER BY pp.sold_count DESC, p.is_featured DESC, p.id ASC
     LIMIT ?`,
    [limit],
  );
  return rows;
};

/**
 * Fetch trending products (highest views, ratings, wishlist counts).
 */
export const findTrending = async (limit = 8) => {
  const [rows] = await pool.query(
    `SELECT p.*, c.name AS category_name, c.slug AS category_slug,
            COALESCE(pp.view_count, 0) AS view_count,
            COALESCE(pp.popularity_score, 0) AS popularity_score
     FROM products p
     LEFT JOIN product_popularity pp ON pp.product_id = p.id
     LEFT JOIN categories c ON c.id = p.category_id
     ORDER BY pp.popularity_score DESC, p.is_featured DESC, p.id DESC
     LIMIT ?`,
    [limit],
  );
  return rows;
};

/**
 * Bulk seed or initialize popularity metrics.
 */
export const seedMetrics = async (metrics) => {
  if (!metrics || metrics.length === 0) return { affectedRows: 0 };
  const values = metrics.map((m) => [
    m.product_id,
    m.sold_count ?? 50,
    m.view_count ?? 200,
    m.wishlist_count ?? 30,
    m.popularity_score ?? 100,
  ]);
  const [result] = await pool.query(
    `INSERT INTO product_popularity (product_id, sold_count, view_count, wishlist_count, popularity_score)
     VALUES ?
     ON DUPLICATE KEY UPDATE
       sold_count = VALUES(sold_count),
       view_count = VALUES(view_count),
       wishlist_count = VALUES(wishlist_count),
       popularity_score = VALUES(popularity_score)`,
    [values],
  );
  return result;
};
