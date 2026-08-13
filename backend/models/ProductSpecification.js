/**
 * ProductSpecification.js — Product Specification Model (Firestore)
 *
 * Specifications are stored as a `specifications[]` array embedded in each product document.
 * This model provides a compatibility shim so productController works unchanged.
 */

import db from '../config/db.js';

const COL = 'products';

/**
 * Fetch all specifications for a given product ID.
 * @param {string|number} productId
 * @returns {Promise<Array>}
 */
export const findByProductId = async (productId) => {
  const doc = await db.collection(COL).doc(String(productId)).get();
  if (!doc.exists) return [];

  const specs = doc.data().specifications ?? [];

  // Return in the same shape as the MySQL version
  return specs.map((spec, idx) => ({
    id: idx + 1,
    product_id: productId,
    spec_key: spec.spec_key ?? spec.key ?? '',
    spec_value: spec.spec_value ?? spec.value ?? '',
  }));
};

/**
 * Bulk insert specifications for a product (stored in product document).
 * @param {string|number} productId
 * @param {Array<{ spec_key: string, spec_value: string }>} specs
 * @returns {Promise<Object>} { affectedRows: specs.length }
 */
export const bulkCreate = async (productId, specs) => {
  if (!specs || specs.length === 0) return { affectedRows: 0 };

  const formatted = specs.map((s) => ({
    spec_key: s.spec_key ?? s.key ?? '',
    spec_value: s.spec_value ?? s.value ?? '',
  }));

  await db.collection(COL).doc(String(productId)).update({ specifications: formatted });
  return { affectedRows: specs.length };
};
