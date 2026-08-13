/**
 * ProductGallery.js — Product Gallery Image Model (Firestore)
 *
 * Gallery images are stored as an `images[]` array embedded in each product document.
 * This model provides a compatibility shim so productController works unchanged.
 */

import db from '../config/db.js';

const COL = 'products';

/**
 * Fetch all gallery images for a given product ID.
 * @param {string|number} productId
 * @returns {Promise<Array>}
 */
export const findByProductId = async (productId) => {
  const doc = await db.collection(COL).doc(String(productId)).get();
  if (!doc.exists) return [];

  const data = doc.data();
  const images = data.images ?? [];

  // Return in the same shape as the MySQL version
  return images.map((img, idx) => ({
    id: idx + 1,
    product_id: productId,
    image_url: typeof img === 'string' ? img : img.image_url,
    display_order: typeof img === 'string' ? idx : (img.display_order ?? idx),
    created_at: data.created_at ?? null,
  }));
};

/**
 * Bulk insert gallery images for a product (stored in product document).
 * @param {string|number} productId
 * @param {Array<{ image_url: string, display_order?: number }>} items
 * @returns {Promise<Object>} { affectedRows: items.length }
 */
export const bulkCreate = async (productId, items) => {
  if (!items || items.length === 0) return { affectedRows: 0 };

  const images = items.map((item, idx) => ({
    image_url: item.image_url,
    display_order: item.display_order ?? idx,
  }));

  await db.collection(COL).doc(String(productId)).update({ images });
  return { affectedRows: items.length };
};
