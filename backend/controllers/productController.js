/**
 * productController.js — Product Business Logic
 *
 * Handles all product-related HTTP requests.
 * Public routes: list, get by id/slug, search, featured, by category.
 * All routes are currently public (read-only).
 * Admin write routes can be protected in a future phase.
 */

import * as ProductModel from '../models/Product.js';

// ── GET /api/products ─────────────────────────────────────────────────────────
/**
 * Return all products, with optional filtering:
 *   ?search=<term>     → full-text LIKE search on name + description
 *   ?category=<slug>   → filter by category slug (resolved via JOIN)
 *   ?featured=1        → return only featured products
 *   ?limit=<n>         → cap the result count (naive, not paginated)
 */
export const getAllProducts = async (req, res, next) => {
  try {
    const { search, featured } = req.query;

    let products;

    if (search && search.trim()) {
      products = await ProductModel.search(search.trim());
    } else if (featured === '1') {
      products = await ProductModel.findFeatured();
    } else {
      products = await ProductModel.findAll();
    }

    return res.status(200).json({
      success: true,
      message: 'Products retrieved successfully.',
      data: { products, count: products.length },
    });
  } catch (error) {
    next(error);
  }
};

// ── GET /api/products/featured ────────────────────────────────────────────────
/**
 * Return only featured products (is_featured = 1).
 * Dedicated endpoint for the homepage hero section.
 */
export const getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await ProductModel.findFeatured();
    return res.status(200).json({
      success: true,
      message: 'Featured products retrieved.',
      data: { products, count: products.length },
    });
  } catch (error) {
    next(error);
  }
};

// ── GET /api/products/category/:category ──────────────────────────────────────
/**
 * Return products filtered by category slug.
 * :category is the slug string (e.g. "electronics").
 */
export const getProductsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;

    // The model's findAll uses a JOIN — we filter in SQL via category slug
    const all = await ProductModel.findAll();
    const products = all.filter(
      (p) => p.category_slug === category,
    );

    return res.status(200).json({
      success: true,
      message: `Products in category '${category}' retrieved.`,
      data: { products, count: products.length },
    });
  } catch (error) {
    next(error);
  }
};

// ── GET /api/products/:id ─────────────────────────────────────────────────────
/**
 * Return a single product by its numeric ID.
 */
export const getProductById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({
        success: false,
        message: 'Product ID must be a positive integer.',
      });
    }

    const product = await ProductModel.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product with ID ${id} not found.`,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Product retrieved successfully.',
      data: { product },
    });
  } catch (error) {
    next(error);
  }
};

// ── GET /api/products/slug/:slug ──────────────────────────────────────────────
/**
 * Return a single product by its URL slug.
 */
export const getProductBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const product = await ProductModel.findBySlug(slug);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product '${slug}' not found.`,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Product retrieved successfully.',
      data: { product },
    });
  } catch (error) {
    next(error);
  }
};
