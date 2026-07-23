/**
 * productController.js — Product Business Logic
 *
 * Handles all product-related HTTP requests.
 * Dynamic product details include:
 *  - Gallery Images (product_gallery / product_images)
 *  - Technical Specifications (product_specifications)
 *  - Customer Reviews & Ratings (product_reviews)
 *  - Product Comparison Payload (up to 4 products)
 *  - Related Products from the same category
 */

import * as ProductModel from '../models/Product.js';
import * as ProductGalleryModel from '../models/ProductGallery.js';
import * as ProductSpecificationModel from '../models/ProductSpecification.js';
import * as ProductReviewModel from '../models/ProductReview.js';
import '../scripts/seedProductDetails.js';

// Helper to attach dynamic gallery, specs, reviews, and related products
const enrichProductDetails = async (product) => {
  if (!product) return null;

  const [gallery, specifications, reviews, ratingSummary, allCategoryProducts] = await Promise.all([
    ProductGalleryModel.findByProductId(product.id),
    ProductSpecificationModel.findByProductId(product.id),
    ProductReviewModel.findByProductId(product.id),
    ProductReviewModel.getRatingSummary(product.id),
    ProductModel.findAll(),
  ]);

  const galleryImages = gallery.length > 0
    ? gallery
    : [{ id: 0, product_id: product.id, image_url: product.image_url, display_order: 1 }];

  const relatedProducts = allCategoryProducts
    .filter((p) => p.category_slug === product.category_slug && p.id !== product.id)
    .slice(0, 4);

  return {
    ...product,
    gallery: galleryImages,
    specifications,
    reviews,
    average_rating: ratingSummary.average_rating,
    review_count: ratingSummary.review_count,
    related_products: relatedProducts,
  };
};

// ── GET /api/products ─────────────────────────────────────────────────────────
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

// ── GET /api/products/compare?ids=1,2,3,4 ─────────────────────────────────────
export const getProductsToCompare = async (req, res, next) => {
  try {
    const rawIds = req.query.ids;
    if (!rawIds) {
      return res.status(400).json({ success: false, message: 'Please provide product ids parameter (?ids=1,2,3).' });
    }

    const ids = String(rawIds)
      .split(',')
      .map((id) => Number(id.trim()))
      .filter((id) => Number.isInteger(id) && id > 0)
      .slice(0, 4);

    if (ids.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid product IDs provided.' });
    }

    const products = await Promise.all(
      ids.map(async (id) => {
        const base = await ProductModel.findById(id);
        return enrichProductDetails(base);
      }),
    );

    const validProducts = products.filter(Boolean);

    return res.status(200).json({
      success: true,
      message: 'Comparison products retrieved.',
      data: { products: validProducts, count: validProducts.length },
    });
  } catch (error) {
    next(error);
  }
};

// ── GET /api/products/category/:category ──────────────────────────────────────
export const getProductsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const all = await ProductModel.findAll();
    const products = all.filter((p) => p.category_slug === category);

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
export const getProductById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({
        success: false,
        message: 'Product ID must be a positive integer.',
      });
    }

    const baseProduct = await ProductModel.findById(id);
    if (!baseProduct) {
      return res.status(404).json({
        success: false,
        message: `Product with ID ${id} not found.`,
      });
    }

    const product = await enrichProductDetails(baseProduct);

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
export const getProductBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const baseProduct = await ProductModel.findBySlug(slug);

    if (!baseProduct) {
      return res.status(404).json({
        success: false,
        message: `Product '${slug}' not found.`,
      });
    }

    const product = await enrichProductDetails(baseProduct);

    return res.status(200).json({
      success: true,
      message: 'Product retrieved successfully.',
      data: { product },
    });
  } catch (error) {
    next(error);
  }
};

// ── GET /api/products/:id/gallery & /api/products/:id/images ─────────────────
export const getProductGallery = async (req, res, next) => {
  try {
    const productId = Number(req.params.id);
    const gallery = await ProductGalleryModel.findByProductId(productId);
    return res.status(200).json({
      success: true,
      message: 'Product gallery images retrieved.',
      data: { gallery, images: gallery, count: gallery.length },
    });
  } catch (error) {
    next(error);
  }
};

// ── GET /api/products/:id/specifications ──────────────────────────────────────
export const getProductSpecifications = async (req, res, next) => {
  try {
    const productId = Number(req.params.id);
    const specifications = await ProductSpecificationModel.findByProductId(productId);
    return res.status(200).json({
      success: true,
      message: 'Product specifications retrieved.',
      data: { specifications, count: specifications.length },
    });
  } catch (error) {
    next(error);
  }
};

// ── GET /api/products/:id/reviews ─────────────────────────────────────────────
export const getProductReviews = async (req, res, next) => {
  try {
    const productId = Number(req.params.id);
    const reviews = await ProductReviewModel.findByProductId(productId);
    const ratingSummary = await ProductReviewModel.getRatingSummary(productId);

    return res.status(200).json({
      success: true,
      message: 'Product reviews retrieved.',
      data: {
        reviews,
        count: reviews.length,
        average_rating: ratingSummary.average_rating,
        review_count: ratingSummary.review_count,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ── POST /api/products/:id/reviews ────────────────────────────────────────────
export const addProductReview = async (req, res, next) => {
  try {
    const productId = Number(req.params.id);
    const { rating, review } = req.body;

    const numRating = Number(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be a number between 1 and 5.' });
    }

    if (!review || !review.trim()) {
      return res.status(400).json({ success: false, message: 'Review comment is required.' });
    }

    const userName = req.decodedUser?.name || req.decodedUser?.email?.split('@')[0] || 'Verified Customer';
    const userAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=6c63ff&color=fff`;

    await ProductReviewModel.bulkCreate(productId, [
      {
        user_name: userName,
        user_avatar: userAvatar,
        rating: numRating,
        review: review.trim(),
        verified_purchase: true,
      },
    ]);

    const reviews = await ProductReviewModel.findByProductId(productId);
    const ratingSummary = await ProductReviewModel.getRatingSummary(productId);

    return res.status(201).json({
      success: true,
      message: 'Review posted successfully!',
      data: {
        reviews,
        count: reviews.length,
        average_rating: ratingSummary.average_rating,
        review_count: ratingSummary.review_count,
      },
    });
  } catch (error) {
    next(error);
  }
};
