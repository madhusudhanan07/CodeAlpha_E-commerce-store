/**
 * ProductSpecification.js — Product Specification Model
 *
 * Interacts with the `product_specifications` table in MySQL.
 */

import pool from '../config/db.js';

// Ensure table exists at runtime
const ensureTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS product_specifications (
        id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        product_id BIGINT UNSIGNED NOT NULL,
        spec_key   VARCHAR(150)    NOT NULL,
        spec_value VARCHAR(255)    NOT NULL,
        PRIMARY KEY (id),
        INDEX idx_specs_product_id (product_id),
        CONSTRAINT fk_specs_product FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
  } catch (err) {
    console.error('Error ensuring product_specifications table:', err.message);
  }
};

ensureTable();

/**
 * Fetch all specifications for a given product ID.
 * @param {number} productId
 * @returns {Promise<Array>} Array of specification rows
 */
export const findByProductId = async (productId) => {
  const [rows] = await pool.query(
    'SELECT id, product_id, spec_key, spec_value FROM product_specifications WHERE product_id = ? ORDER BY id ASC',
    [productId],
  );
  return rows;
};

/**
 * Bulk insert specifications for a product.
 * @param {number} productId
 * @param {Array<{ spec_key: string, spec_value: string }>} specs
 */
export const bulkCreate = async (productId, specs) => {
  if (!specs || specs.length === 0) return { affectedRows: 0 };
  const values = specs.map((item) => [productId, item.spec_key, item.spec_value]);
  const [result] = await pool.query(
    'INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES ?',
    [values],
  );
  return result;
};
