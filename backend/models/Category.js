/**
 * Category.js — Category Model (Firestore)
 *
 * Provides reusable query functions for the `categories` Firestore collection.
 * Preserves the exact same exported function signatures as the MySQL version
 * so that all controllers and routes continue to work without modification.
 */

import db from '../config/db.js';

const COL = 'categories';

// ── Helpers ───────────────────────────────────────────────────────────────────

const docToRow = (doc) => ({ id: doc.id, ...doc.data() });

// ── READ ──────────────────────────────────────────────────────────────────────

/**
 * Fetch all categories ordered alphabetically by name.
 * @returns {Promise<Array>}
 */
export const findAll = async () => {
  const snap = await db.collection(COL).orderBy('name', 'asc').get();
  return snap.docs.map(docToRow);
};

/**
 * Find a single category by its document ID.
 * @param {string|number} id
 * @returns {Promise<Object|null>}
 */
export const findById = async (id) => {
  const doc = await db.collection(COL).doc(String(id)).get();
  return doc.exists ? docToRow(doc) : null;
};

/**
 * Find a category by its URL slug.
 * @param {string} slug
 * @returns {Promise<Object|null>}
 */
export const findBySlug = async (slug) => {
  const snap = await db.collection(COL).where('slug', '==', slug).limit(1).get();
  if (snap.empty) return null;
  return docToRow(snap.docs[0]);
};

// ── CREATE ────────────────────────────────────────────────────────────────────

/**
 * Insert a new category.
 * @param {{ name: string, slug: string, description?: string }} data
 * @returns {Promise<Object>} Object with insertId (= new doc ID)
 */
export const create = async ({ name, slug, description = null }) => {
  // Count existing to generate a sequential numeric ID
  const snap = await db.collection(COL).get();
  const newId = String(snap.size + 1);

  await db.collection(COL).doc(newId).set({
    id: newId,
    name,
    slug,
    description: description ?? null,
    icon: 'FolderTree',
    featured: false,
    status: 'Active',
    display_order: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  return { insertId: newId };
};

// ── UPDATE ────────────────────────────────────────────────────────────────────

/**
 * Update a category by ID.
 * @param {string|number} id
 * @param {{ name?: string, slug?: string, description?: string, [key: string]: any }} fields
 * @returns {Promise<Object>} { affectedRows: 1 }
 */
export const updateById = async (id, fields) => {
  const updateData = { updated_at: new Date().toISOString() };
  if (fields.name        !== undefined) updateData.name        = fields.name;
  if (fields.slug        !== undefined) updateData.slug        = fields.slug;
  if (fields.description !== undefined) updateData.description = fields.description;
  if (fields.icon        !== undefined) updateData.icon        = fields.icon;
  if (fields.featured    !== undefined) updateData.featured    = fields.featured;
  if (fields.status      !== undefined) updateData.status      = fields.status;
  if (fields.display_order !== undefined) updateData.display_order = fields.display_order;
  if (fields.banner_image  !== undefined) updateData.banner_image  = fields.banner_image;

  await db.collection(COL).doc(String(id)).update(updateData);
  return { affectedRows: 1 };
};

// ── DELETE ────────────────────────────────────────────────────────────────────

/**
 * Delete a category by ID.
 * @param {string|number} id
 * @returns {Promise<Object>} { affectedRows: 1 }
 */
export const deleteById = async (id) => {
  await db.collection(COL).doc(String(id)).delete();
  return { affectedRows: 1 };
};
