/**
 * User.js — User Model
 *
 * Provides reusable, parameterised query functions for the `users` table.
 * Uses the existing MySQL connection pool from config/db.js.
 *
 * Responsibilities:
 *  - Data access (SELECT, INSERT, UPDATE, DELETE) for users
 *  - No business logic, no HTTP handling, no routing
 *
 * All functions are async and return raw result sets from mysql2.
 */

import pool from '../config/db.js';

// ── READ ──────────────────────────────────────────────────────────────────────

/**
 * Fetch every user row. Use with caution in production (paginate instead).
 * @returns {Promise<Array>} Array of user rows
 */
export const findAll = async () => {
  const [rows] = await pool.query(
    'SELECT id, firebase_uid, full_name, email, phone, created_at, updated_at FROM users ORDER BY created_at DESC',
  );
  return rows;
};

/**
 * Find a single user by their internal auto-increment ID.
 * @param {number} id
 * @returns {Promise<Object|null>} User row or null
 */
export const findById = async (id) => {
  const [rows] = await pool.query(
    'SELECT id, firebase_uid, full_name, email, phone, created_at, updated_at FROM users WHERE id = ? LIMIT 1',
    [id],
  );
  return rows[0] ?? null;
};

/**
 * Find a user by their Firebase UID.
 * Used during authentication to look up or create accounts.
 * @param {string} firebaseUid
 * @returns {Promise<Object|null>} User row or null
 */
export const findByFirebaseUid = async (firebaseUid) => {
  const [rows] = await pool.query(
    'SELECT id, firebase_uid, full_name, email, phone, created_at, updated_at FROM users WHERE firebase_uid = ? LIMIT 1',
    [firebaseUid],
  );
  return rows[0] ?? null;
};

/**
 * Find a user by their email address.
 * @param {string} email
 * @returns {Promise<Object|null>} User row or null
 */
export const findByEmail = async (email) => {
  const [rows] = await pool.query(
    'SELECT id, firebase_uid, full_name, email, phone, created_at, updated_at FROM users WHERE email = ? LIMIT 1',
    [email],
  );
  return rows[0] ?? null;
};

// ── CREATE ────────────────────────────────────────────────────────────────────

/**
 * Insert a new user record.
 * @param {{ firebase_uid: string, full_name: string, email: string, phone?: string }} data
 * @returns {Promise<{ insertId: number }>} mysql2 OkPacket
 */
export const create = async ({ firebase_uid, full_name, email, phone = null }) => {
  const [result] = await pool.query(
    'INSERT INTO users (firebase_uid, full_name, email, phone) VALUES (?, ?, ?, ?)',
    [firebase_uid, full_name, email, phone],
  );
  return result;
};

// ── UPDATE ────────────────────────────────────────────────────────────────────

/**
 * Update a user's mutable profile fields.
 * @param {number} id
 * @param {{ full_name?: string, phone?: string }} fields
 * @returns {Promise<Object>} mysql2 OkPacket (affectedRows indicates success)
 */
export const updateById = async (id, { full_name, phone }) => {
  const [result] = await pool.query(
    'UPDATE users SET full_name = COALESCE(?, full_name), phone = COALESCE(?, phone) WHERE id = ?',
    [full_name ?? null, phone ?? null, id],
  );
  return result;
};

// ── DELETE ────────────────────────────────────────────────────────────────────

/**
 * Delete a user by ID.
 * Note: ON DELETE CASCADE on cart_items will remove the user's cart.
 *       ON DELETE RESTRICT on orders prevents deletion if orders exist.
 * @param {number} id
 * @returns {Promise<Object>} mysql2 OkPacket
 */
export const deleteById = async (id) => {
  const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
  return result;
};
