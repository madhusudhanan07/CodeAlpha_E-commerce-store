/**
 * Category.js — Category Model
 *
 * Provides reusable, parameterised query functions for the `categories` table.
 * Uses the existing MySQL connection pool from config/db.js.
 *
 * Responsibilities:
 *  - Data access for product categories
 *  - No business logic, no HTTP handling, no routing
 */

import pool from '../config/db.js';

// ── READ ──────────────────────────────────────────────────────────────────────

/**
 * Fetch all categories ordered alphabetically by name.
 * @returns {Promise<Array>} Array of category rows
 */
export const findAll = async () => {
  const [rows] = await pool.query(
    'SELECT id, name, slug, description, created_at FROM categories ORDER BY name ASC',
  );
  return rows;
};

/**
 * Find a single category by its internal ID.
 * @param {number} id
 * @returns {Promise<Object|null>} Category row or null
 */
export const findById = async (id) => {
  const [rows] = await pool.query(
    'SELECT id, name, slug, description, created_at FROM categories WHERE id = ? LIMIT 1',
    [id],
  );
  return rows[0] ?? null;
};

/**
 * Find a category by its URL slug (used in frontend routing).
 * @param {string} slug
 * @returns {Promise<Object|null>} Category row or null
 */
export const findBySlug = async (slug) => {
  const [rows] = await pool.query(
    'SELECT id, name, slug, description, created_at FROM categories WHERE slug = ? LIMIT 1',
    [slug],
  );
  return rows[0] ?? null;
};

// ── CREATE ────────────────────────────────────────────────────────────────────

/**
 * Insert a new category.
 * @param {{ name: string, slug: string, description?: string }} data
 * @returns {Promise<Object>} mysql2 OkPacket (insertId available)
 */
export const create = async ({ name, slug, description = null }) => {
  const [result] = await pool.query(
    'INSERT INTO categories (name, slug, description) VALUES (?, ?, ?)',
    [name, slug, description],
  );
  return result;
};

// ── UPDATE ────────────────────────────────────────────────────────────────────

/**
 * Update a category by ID.
 * @param {number} id
 * @param {{ name?: string, slug?: string, description?: string }} fields
 * @returns {Promise<Object>} mysql2 OkPacket
 */
export const updateById = async (id, { name, slug, description }) => {
  const [result] = await pool.query(
    `UPDATE categories
     SET name        = COALESCE(?, name),
         slug        = COALESCE(?, slug),
         description = COALESCE(?, description)
     WHERE id = ?`,
    [name ?? null, slug ?? null, description ?? null, id],
  );
  return result;
};

// ── DELETE ────────────────────────────────────────────────────────────────────

/**
 * Delete a category by ID.
 * Note: FK `fk_products_category` uses ON DELETE RESTRICT — deletion will
 * fail if any products still reference this category.
 * @param {number} id
 * @returns {Promise<Object>} mysql2 OkPacket
 */
export const deleteById = async (id) => {
  const [result] = await pool.query('DELETE FROM categories WHERE id = ?', [id]);
  return result;
};
