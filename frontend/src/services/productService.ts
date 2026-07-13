/**
 * productService.ts — Product API Layer
 *
 * All product-related HTTP calls go through this service.
 * Uses the pre-configured axiosInstance (auth token auto-attached when signed in).
 *
 * Functions:
 *  - fetchProducts(params?)    → GET /api/products
 *  - fetchFeatured()           → GET /api/products/featured
 *  - fetchProductById(id)      → GET /api/products/:id
 *  - fetchProductBySlug(slug)  → GET /api/products/slug/:slug
 *  - fetchByCategory(slug)     → GET /api/products/category/:slug
 *  - searchProducts(term)      → GET /api/products?search=<term>
 */

import axiosInstance from './axiosInstance';
import type {
  ApiResponse,
  Product,
  ProductListResponse,
  ProductQueryParams,
} from '../types';

// ── Helpers ────────────────────────────────────────────────────────────────────

const BASE = '/api/products';

// ── Fetch all products (with optional query params) ───────────────────────────

export const fetchProducts = async (
  params: ProductQueryParams = {},
): Promise<ProductListResponse> => {
  const { data } = await axiosInstance.get<ApiResponse<ProductListResponse>>(BASE, { params });
  return data.data!;
};

// ── Featured products (for homepage) ─────────────────────────────────────────

export const fetchFeatured = async (): Promise<ProductListResponse> => {
  const { data } = await axiosInstance.get<ApiResponse<ProductListResponse>>(
    `${BASE}/featured`,
  );
  return data.data!;
};

// ── Single product by numeric ID ──────────────────────────────────────────────

export const fetchProductById = async (id: number): Promise<Product> => {
  const { data } = await axiosInstance.get<ApiResponse<{ product: Product }>>(
    `${BASE}/${id}`,
  );
  return data.data!.product;
};

// ── Single product by slug ────────────────────────────────────────────────────

export const fetchProductBySlug = async (slug: string): Promise<Product> => {
  const { data } = await axiosInstance.get<ApiResponse<{ product: Product }>>(
    `${BASE}/slug/${slug}`,
  );
  return data.data!.product;
};

// ── Products by category slug ─────────────────────────────────────────────────

export const fetchByCategory = async (
  categorySlug: string,
): Promise<ProductListResponse> => {
  const { data } = await axiosInstance.get<ApiResponse<ProductListResponse>>(
    `${BASE}/category/${categorySlug}`,
  );
  return data.data!;
};

// ── Search products ───────────────────────────────────────────────────────────

export const searchProducts = async (term: string): Promise<ProductListResponse> => {
  return fetchProducts({ search: term });
};
