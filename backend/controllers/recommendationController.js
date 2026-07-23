/**
 * recommendationController.js — Intelligent Recommendation Engine Logic
 *
 * Handles HTTP requests for:
 *  - Related Products (category match with shuffle)
 *  - Frequently Bought Together (accessory bundles)
 *  - Recently Viewed History (user & session support)
 *  - You May Also Like (mixed recommendation algorithm)
 *  - Best Sellers & Trending Now
 */

import pool from '../config/db.js';
import * as ProductModel from '../models/Product.js';
import * as RecentlyViewedModel from '../models/RecentlyViewed.js';
import * as FrequentlyBoughtModel from '../models/FrequentlyBought.js';
import * as ProductPopularityModel from '../models/ProductPopularity.js';
import * as UserModel from '../models/User.js';
import '../scripts/seedRecommendations.js';

// Helper to resolve user ID from token
const resolveUserId = async (decodedUser) => {
  if (!decodedUser || !decodedUser.uid) return null;
  const user = await UserModel.findByFirebaseUid(decodedUser.uid);
  return user?.id || null;
};

// ── 1. GET /api/products/:id/related ─────────────────────────────────────────
export const getRelatedProducts = async (req, res, next) => {
  try {
    const productId = Number(req.params.id);
    const product = await ProductModel.findById(productId);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    // Fetch products from same category excluding current product, shuffled
    const [categoryRows] = await pool.query(
      `SELECT p.*, c.name AS category_name, c.slug AS category_slug
       FROM products p
       LEFT JOIN categories c ON c.id = p.category_id
       WHERE p.category_id = ? AND p.id != ?
       ORDER BY RAND()
       LIMIT 6`,
      [product.category_id, productId],
    );

    let related = categoryRows;

    // Fallback if category has fewer products: pick from nearest categories
    if (related.length < 4) {
      const [fallbackRows] = await pool.query(
        `SELECT p.*, c.name AS category_name, c.slug AS category_slug
         FROM products p
         LEFT JOIN categories c ON c.id = p.category_id
         WHERE p.id != ?
         ORDER BY RAND()
         LIMIT ?`,
        [productId, 6 - related.length],
      );
      related = [...related, ...fallbackRows];
    }

    return res.status(200).json({
      success: true,
      message: 'Related products retrieved.',
      data: { products: related, count: related.length },
    });
  } catch (error) {
    next(error);
  }
};

// ── 2. GET /api/products/:id/frequently-bought ───────────────────────────────
export const getFrequentlyBought = async (req, res, next) => {
  try {
    const productId = Number(req.params.id);
    const mainProduct = await ProductModel.findById(productId);

    if (!mainProduct) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const accessories = await FrequentlyBoughtModel.findByProductId(productId);

    // Calculate bundle total price
    const subtotal = accessories.reduce((acc, item) => acc + Number(item.price), Number(mainProduct.price));
    const bundleDiscount = 15;
    const bundleTotal = Number((subtotal * (1 - bundleDiscount / 100)).toFixed(2));

    return res.status(200).json({
      success: true,
      message: 'Frequently bought bundle retrieved.',
      data: {
        main_product: mainProduct,
        accessories,
        bundle_summary: {
          item_count: accessories.length + 1,
          subtotal,
          bundle_discount: bundleDiscount,
          bundle_total: bundleTotal,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// ── 3. GET /api/products/recently-viewed ──────────────────────────────────────
export const getRecentlyViewed = async (req, res, next) => {
  try {
    const userId = req.decodedUser ? await resolveUserId(req.decodedUser) : null;
    const sessionId = req.query.session_id || null;

    const products = await RecentlyViewedModel.findRecent({ userId, sessionId, limit: 10 });

    return res.status(200).json({
      success: true,
      message: 'Recently viewed history retrieved.',
      data: { products, count: products.length },
    });
  } catch (error) {
    next(error);
  }
};

// ── 4. POST /api/products/recently-viewed ─────────────────────────────────────
export const recordRecentlyViewed = async (req, res, next) => {
  try {
    const { product_id, session_id } = req.body;
    const productId = Number(product_id);

    if (!productId || isNaN(productId)) {
      return res.status(400).json({ success: false, message: 'Valid product_id is required.' });
    }

    const userId = req.decodedUser ? await resolveUserId(req.decodedUser) : null;

    await RecentlyViewedModel.recordView({
      userId,
      sessionId: session_id || null,
      productId,
    });

    return res.status(200).json({
      success: true,
      message: 'Product view recorded.',
    });
  } catch (error) {
    next(error);
  }
};

// ── 5. GET /api/products/recommended ─────────────────────────────────────────
export const getRecommended = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.*, c.name AS category_name, c.slug AS category_slug
       FROM products p
       LEFT JOIN categories c ON c.id = p.category_id
       ORDER BY RAND()
       LIMIT 8`,
    );

    return res.status(200).json({
      success: true,
      message: 'Recommended products retrieved.',
      data: { products: rows, count: rows.length },
    });
  } catch (error) {
    next(error);
  }
};

// ── 6. GET /api/products/best-sellers ─────────────────────────────────────────
export const getBestSellers = async (req, res, next) => {
  try {
    const products = await ProductPopularityModel.findBestSellers(8);
    return res.status(200).json({
      success: true,
      message: 'Best sellers retrieved.',
      data: { products, count: products.length },
    });
  } catch (error) {
    next(error);
  }
};

// ── 7. GET /api/products/trending ─────────────────────────────────────────────
export const getTrending = async (req, res, next) => {
  try {
    const products = await ProductPopularityModel.findTrending(8);
    return res.status(200).json({
      success: true,
      message: 'Trending products retrieved.',
      data: { products, count: products.length },
    });
  } catch (error) {
    next(error);
  }
};
