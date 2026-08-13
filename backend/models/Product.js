/**
 * Product.js — Product Model (Firestore)
 *
 * Provides reusable query functions for the `products` Firestore collection.
 * Preserves the exact same exported function signatures as the MySQL version.
 *
 * Gallery images and specifications are embedded in each product document
 * as `images[]` and `specifications[]` arrays respectively.
 */

import db from '../config/db.js';

const COL = 'products';

// ── Helpers ───────────────────────────────────────────────────────────────────

const docToRow = (doc) => {
  const data = doc.data();
  return {
    id: data.id ?? doc.id,
    category_id: data.category_id ?? null,
    category_name: data.category_name ?? null,
    category_slug: data.category_slug ?? null,
    name: data.name,
    slug: data.slug,
    description: data.description ?? null,
    image_url: data.image_url ?? null,
    price: Number(data.price ?? 0),
    stock: Number(data.stock ?? 0),
    is_featured: data.is_featured ? 1 : 0,
    brand: data.brand ?? 'Generic',
    sku: data.sku ?? null,
    old_price: data.old_price ?? null,
    discount_pct: data.discount_pct ?? 0,
    specifications: data.specifications ?? [],
    images: data.images ?? [],
    tags: data.tags ?? null,
    weight: data.weight ?? null,
    dimensions: data.dimensions ?? null,
    warranty: data.warranty ?? null,
    return_policy: data.return_policy ?? null,
    shipping_info: data.shipping_info ?? null,
    is_active: data.is_active !== false,
    created_at: data.created_at ?? null,
    updated_at: data.updated_at ?? null,
  };
};

// ── READ ──────────────────────────────────────────────────────────────────────

/**
 * Fetch all products ordered by created_at DESC.
 * @returns {Promise<Array>}
 */
export const findAll = async () => {
  const snap = await db.collection(COL).orderBy('created_at', 'desc').get();
  return snap.docs.map(docToRow);
};

/**
 * Find a single product by its document ID.
 * @param {string|number} id
 * @returns {Promise<Object|null>}
 */
export const findById = async (id) => {
  const doc = await db.collection(COL).doc(String(id)).get();
  return doc.exists ? docToRow(doc) : null;
};

/**
 * Find a product by its URL slug.
 * @param {string} slug
 * @returns {Promise<Object|null>}
 */
export const findBySlug = async (slug) => {
  const snap = await db.collection(COL).where('slug', '==', slug).limit(1).get();
  if (snap.empty) return null;
  return docToRow(snap.docs[0]);
};

/**
 * Fetch all products in a given category by category ID.
 * Filters client-side to avoid requiring composite index.
 * @param {string|number} categoryId
 * @returns {Promise<Array>}
 */
export const findByCategoryId = async (categoryId) => {
  const snap = await db.collection(COL)
    .where('category_id', '==', String(categoryId))
    .get();
  return snap.docs.map(docToRow).sort((a, b) => a.name.localeCompare(b.name));
};

/**
 * Fetch all products with is_featured = true.
 * Uses client-side filter to avoid requiring a Firestore composite index.
 * @returns {Promise<Array>}
 */
export const findFeatured = async () => {
  const snap = await db.collection(COL).get();
  return snap.docs
    .map(docToRow)
    .filter((p) => p.is_featured)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
};

/**
 * Search products by name or description (case-insensitive prefix match via client-side filter).
 * Firestore doesn't support native LIKE — we fetch all and filter in JS.
 * For large catalogs, consider Algolia; for this scale it's fine.
 * @param {string} term
 * @returns {Promise<Array>}
 */
export const search = async (term) => {
  const lower = term.toLowerCase();
  const snap = await db.collection(COL).get();
  return snap.docs
    .map(docToRow)
    .filter(
      (p) =>
        p.name?.toLowerCase().includes(lower) ||
        p.description?.toLowerCase().includes(lower),
    )
    .sort((a, b) => a.name.localeCompare(b.name));
};

// ── CREATE ────────────────────────────────────────────────────────────────────

/**
 * Insert a new product.
 * @param {{ category_id, name, slug, description, image_url, price, stock, is_featured, ... }} data
 * @returns {Promise<Object>} { insertId: newId }
 */
export const create = async ({
  category_id,
  name,
  slug,
  description    = null,
  image_url      = null,
  price,
  stock          = 0,
  is_featured    = 0,
  brand          = 'Generic',
  sku            = null,
  old_price      = null,
  discount_pct   = 0,
  specifications = [],
  images         = [],
  tags           = null,
  weight         = null,
  dimensions     = null,
  warranty       = null,
  return_policy  = null,
  shipping_info  = null,
  is_active      = true,
  category_name  = null,
  category_slug  = null,
}) => {
  // Resolve category info if not provided
  if (!category_name && category_id) {
    const catDoc = await db.collection('categories').doc(String(category_id)).get();
    if (catDoc.exists) {
      const cat = catDoc.data();
      category_name = cat.name;
      category_slug = cat.slug;
    }
  }

  const snap = await db.collection(COL).get();
  const newId = String(snap.size + 1);
  const now = new Date().toISOString();

  const productData = {
    id: newId,
    category_id: String(category_id),
    category_name,
    category_slug,
    name,
    slug,
    description,
    image_url,
    price: Number(price),
    stock: Number(stock),
    is_featured: Boolean(is_featured),
    brand,
    sku,
    old_price: old_price ? Number(old_price) : null,
    discount_pct: Number(discount_pct),
    specifications,
    images,
    tags,
    weight,
    dimensions,
    warranty,
    return_policy,
    shipping_info,
    is_active: Boolean(is_active),
    created_at: now,
    updated_at: now,
  };

  await db.collection(COL).doc(newId).set(productData);
  return { insertId: newId };
};

// ── UPDATE ────────────────────────────────────────────────────────────────────

/**
 * Update a product by ID. Only provided fields are changed.
 * @param {string|number} id
 * @param {Object} fields
 * @returns {Promise<Object>} { affectedRows: 1 }
 */
export const updateById = async (id, fields) => {
  const updateData = { updated_at: new Date().toISOString() };
  const allowed = [
    'category_id', 'name', 'slug', 'description', 'image_url',
    'price', 'stock', 'is_featured', 'brand', 'sku', 'old_price',
    'discount_pct', 'specifications', 'images', 'tags', 'weight',
    'dimensions', 'warranty', 'return_policy', 'shipping_info', 'is_active',
    'category_name', 'category_slug',
  ];

  for (const key of allowed) {
    if (fields[key] !== undefined && fields[key] !== null) {
      updateData[key] = fields[key];
    }
  }

  // Resolve category details if category_id changed
  if (fields.category_id) {
    const catDoc = await db.collection('categories').doc(String(fields.category_id)).get();
    if (catDoc.exists) {
      const cat = catDoc.data();
      updateData.category_name = cat.name;
      updateData.category_slug = cat.slug;
    }
    updateData.category_id = String(fields.category_id);
  }

  await db.collection(COL).doc(String(id)).update(updateData);
  return { affectedRows: 1 };
};

/**
 * Decrement stock for a product. Prevents going below zero.
 * @param {string|number} id
 * @param {number} quantity
 * @returns {Promise<Object>} { affectedRows: 1 }
 */
export const decrementStock = async (id, quantity) => {
  const doc = await db.collection(COL).doc(String(id)).get();
  if (!doc.exists) return { affectedRows: 0 };
  const currentStock = Number(doc.data().stock ?? 0);
  const newStock = Math.max(currentStock - quantity, 0);
  await db.collection(COL).doc(String(id)).update({ stock: newStock, updated_at: new Date().toISOString() });
  return { affectedRows: 1 };
};

/**
 * Increment stock for a product (used during order cancellation).
 * @param {string|number} id
 * @param {number} quantity
 * @returns {Promise<Object>} { affectedRows: 1 }
 */
export const incrementStock = async (id, quantity) => {
  const doc = await db.collection(COL).doc(String(id)).get();
  if (!doc.exists) return { affectedRows: 0 };
  const currentStock = Number(doc.data().stock ?? 0);
  await db.collection(COL).doc(String(id)).update({
    stock: currentStock + quantity,
    updated_at: new Date().toISOString(),
  });
  return { affectedRows: 1 };
};

// ── DELETE ────────────────────────────────────────────────────────────────────

/**
 * Delete a product by ID.
 * @param {string|number} id
 * @returns {Promise<Object>} { affectedRows: 1 }
 */
export const deleteById = async (id) => {
  await db.collection(COL).doc(String(id)).delete();
  return { affectedRows: 1 };
};
