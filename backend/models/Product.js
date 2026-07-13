/**
 * Product.js — Product Model
 *
 * Provides reusable, parameterised query functions for the `products` table.
 * Uses the existing MySQL connection pool from config/db.js.
 *
 * Responsibilities:
 *  - Full CRUD for the product catalogue
 *  - Filtering by category, featured flag, price range, and search term
 *  - No business logic, no HTTP handling, no routing
 */

import pool from '../config/db.js';

// ── Base SELECT fragment (avoids repeating column list) ───────────────────────
const SELECT_COLS = `
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
  p.created_at,
  p.updated_at
`;

const FROM_JOIN = `
  FROM products p
  INNER JOIN categories c ON c.id = p.category_id
`;

// ── READ ──────────────────────────────────────────────────────────────────────

/**
 * Fetch all products with their category name.
 * @returns {Promise<Array>} Array of product rows
 */
export const findAll = async () => {
  const [rows] = await pool.query(
    `SELECT ${SELECT_COLS} ${FROM_JOIN} ORDER BY p.created_at DESC`,
  );
  return rows;
};

/**
 * Find a single product by its internal ID.
 * @param {number} id
 * @returns {Promise<Object|null>} Product row or null
 */
export const findById = async (id) => {
  const [rows] = await pool.query(
    `SELECT ${SELECT_COLS} ${FROM_JOIN} WHERE p.id = ? LIMIT 1`,
    [id],
  );
  return rows[0] ?? null;
};

/**
 * Find a product by its URL slug.
 * @param {string} slug
 * @returns {Promise<Object|null>} Product row or null
 */
export const findBySlug = async (slug) => {
  const [rows] = await pool.query(
    `SELECT ${SELECT_COLS} ${FROM_JOIN} WHERE p.slug = ? LIMIT 1`,
    [slug],
  );
  return rows[0] ?? null;
};

/**
 * Fetch all products in a given category.
 * @param {number} categoryId
 * @returns {Promise<Array>} Array of product rows
 */
export const findByCategoryId = async (categoryId) => {
  const [rows] = await pool.query(
    `SELECT ${SELECT_COLS} ${FROM_JOIN} WHERE p.category_id = ? ORDER BY p.name ASC`,
    [categoryId],
  );
  return rows;
};

/**
 * Fetch all products with is_featured = 1 (for homepage display).
 * @returns {Promise<Array>} Array of featured product rows
 */
export const findFeatured = async () => {
  const [rows] = await pool.query(
    `SELECT ${SELECT_COLS} ${FROM_JOIN} WHERE p.is_featured = 1 ORDER BY p.created_at DESC`,
  );
  return rows;
};

/**
 * Full-text style search on product name and description.
 * Uses LIKE for now — can be upgraded to FULLTEXT index in a future phase.
 * @param {string} term  - Search term
 * @returns {Promise<Array>} Matching product rows
 */
export const search = async (term) => {
  const pattern = `%${term}%`;
  const [rows] = await pool.query(
    `SELECT ${SELECT_COLS} ${FROM_JOIN}
     WHERE p.name LIKE ? OR p.description LIKE ?
     ORDER BY p.name ASC`,
    [pattern, pattern],
  );
  return rows;
};

// ── CREATE ────────────────────────────────────────────────────────────────────

/**
 * Insert a new product.
 * @param {{
 *   category_id: number,
 *   name: string,
 *   slug: string,
 *   description?: string,
 *   image_url?: string,
 *   price: number,
 *   stock?: number,
 *   is_featured?: number
 * }} data
 * @returns {Promise<Object>} mysql2 OkPacket (insertId available)
 */
export const create = async ({
  category_id,
  name,
  slug,
  description = null,
  image_url   = null,
  price,
  stock       = 0,
  is_featured = 0,
}) => {
  const [result] = await pool.query(
    `INSERT INTO products
      (category_id, name, slug, description, image_url, price, stock, is_featured)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [category_id, name, slug, description, image_url, price, stock, is_featured],
  );
  return result;
};

// ── UPDATE ────────────────────────────────────────────────────────────────────

/**
 * Update a product by ID. Only provided fields are changed.
 * @param {number} id
 * @param {{
 *   category_id?: number,
 *   name?: string,
 *   slug?: string,
 *   description?: string,
 *   image_url?: string,
 *   price?: number,
 *   stock?: number,
 *   is_featured?: number
 * }} fields
 * @returns {Promise<Object>} mysql2 OkPacket
 */
export const updateById = async (id, fields) => {
  const {
    category_id, name, slug, description,
    image_url, price, stock, is_featured,
  } = fields;

  const [result] = await pool.query(
    `UPDATE products SET
       category_id = COALESCE(?, category_id),
       name        = COALESCE(?, name),
       slug        = COALESCE(?, slug),
       description = COALESCE(?, description),
       image_url   = COALESCE(?, image_url),
       price       = COALESCE(?, price),
       stock       = COALESCE(?, stock),
       is_featured = COALESCE(?, is_featured)
     WHERE id = ?`,
    [
      category_id ?? null,
      name        ?? null,
      slug        ?? null,
      description ?? null,
      image_url   ?? null,
      price       ?? null,
      stock       ?? null,
      is_featured ?? null,
      id,
    ],
  );
  return result;
};

/**
 * Decrement stock for a product. Prevents going below zero.
 * @param {number} id       - Product ID
 * @param {number} quantity - Units to deduct
 * @returns {Promise<Object>} mysql2 OkPacket
 */
export const decrementStock = async (id, quantity) => {
  const [result] = await pool.query(
    'UPDATE products SET stock = GREATEST(stock - ?, 0) WHERE id = ?',
    [quantity, id],
  );
  return result;
};

// ── DELETE ────────────────────────────────────────────────────────────────────

/**
 * Delete a product by ID.
 * Note: FK `fk_order_items_product` uses ON DELETE RESTRICT — deletion will
 * fail if the product appears in any historical order_items.
 * @param {number} id
 * @returns {Promise<Object>} mysql2 OkPacket
 */
export const deleteById = async (id) => {
  const [result] = await pool.query('DELETE FROM products WHERE id = ?', [id]);
  return result;
};
