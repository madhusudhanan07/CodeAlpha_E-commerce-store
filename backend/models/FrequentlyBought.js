/**
 * FrequentlyBought.js — Frequently Bought Together Model
 *
 * Interacts with the `frequently_bought` table in MySQL to suggest complementary accessories.
 */

import pool from '../config/db.js';

// Auto-ensure table exists
const ensureTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS frequently_bought (
        id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        product_id      BIGINT UNSIGNED NOT NULL,
        accessory_id    BIGINT UNSIGNED NOT NULL,
        bundle_discount INT             NOT NULL DEFAULT 10,
        PRIMARY KEY (id),
        UNIQUE KEY uq_bundle_pair (product_id, accessory_id),
        CONSTRAINT fk_fb_product FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE,
        CONSTRAINT fk_fb_accessory FOREIGN KEY (accessory_id) REFERENCES products (id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
  } catch (err) {
    console.error('Error ensuring frequently_bought table:', err.message);
  }
};

ensureTable();

/**
 * Fetch frequently bought accessories for a given product.
 */
export const findByProductId = async (productId) => {
  const [rows] = await pool.query(
    `SELECT fb.id, fb.bundle_discount, p.*, c.name AS category_name, c.slug AS category_slug
     FROM frequently_bought fb
     INNER JOIN products p ON p.id = fb.accessory_id
     LEFT JOIN categories c ON c.id = p.category_id
     WHERE fb.product_id = ?`,
    [productId],
  );
  return rows;
};

/**
 * Bulk insert frequently bought accessories pair.
 */
export const bulkCreate = async (pairs) => {
  if (!pairs || pairs.length === 0) return { affectedRows: 0 };
  const values = pairs.map((pair) => [pair.product_id, pair.accessory_id, pair.bundle_discount ?? 10]);
  const [result] = await pool.query(
    'INSERT IGNORE INTO frequently_bought (product_id, accessory_id, bundle_discount) VALUES ?',
    [values],
  );
  return result;
};
