/**
 * ProductGallery.js — Product Gallery Image Model
 *
 * Interacts with the `product_gallery` table in MySQL.
 */

import pool from '../config/db.js';

// Ensure table exists at runtime
const ensureTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS product_gallery (
        id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        product_id    BIGINT UNSIGNED NOT NULL,
        image_url     VARCHAR(500)    NOT NULL,
        display_order INT             NOT NULL DEFAULT 0,
        created_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        INDEX idx_gallery_product_id (product_id),
        CONSTRAINT fk_gallery_product FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
  } catch (err) {
    console.error('Error ensuring product_gallery table:', err.message);
  }
};

ensureTable();

/**
 * Fetch all gallery images for a given product ID, ordered by display_order.
 * @param {number} productId
 * @returns {Promise<Array>} Array of gallery image rows
 */
export const findByProductId = async (productId) => {
  const [rows] = await pool.query(
    'SELECT id, product_id, image_url, display_order, created_at FROM product_gallery WHERE product_id = ? ORDER BY display_order ASC, id ASC',
    [productId],
  );
  return rows;
};

/**
 * Bulk insert gallery images for a product.
 * @param {number} productId
 * @param {Array<{ image_url: string, display_order?: number }>} items
 */
export const bulkCreate = async (productId, items) => {
  if (!items || items.length === 0) return { affectedRows: 0 };
  const values = items.map((item, idx) => [productId, item.image_url, item.display_order ?? idx]);
  const [result] = await pool.query(
    'INSERT INTO product_gallery (product_id, image_url, display_order) VALUES ?',
    [values],
  );
  return result;
};
