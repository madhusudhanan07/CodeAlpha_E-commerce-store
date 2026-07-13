/**
 * index.ts — Global TypeScript Type Definitions
 *
 * Centralizes shared types/interfaces used across the application.
 * Domain-specific types (Product, Order, etc.) will be added here
 * as features are implemented in subsequent phases.
 *
 * Convention:
 *  - Use `interface` for object shapes
 *  - Use `type` for unions, intersections, and aliases
 *  - Prefix context/state types with the domain name (e.g., CartState)
 */

// ── API ───────────────────────────────────────────────────────────────────────

/** Standard shape returned by every API endpoint */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: unknown;
}

// ── User ──────────────────────────────────────────────────────────────────────

/** Basic user shape — will be extended with role/permissions in the auth phase */
export interface User {
  id: string;
  displayName: string;
  email: string;
  photoURL?: string;
  createdAt: string;
}

// ── Product ───────────────────────────────────────────────────────────────────

/** Full product shape matching the products table + categories JOIN */
export interface Product {
  id: number;
  category_id: number;
  category_name: string;
  category_slug: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  price: number;
  stock: number;
  is_featured: 0 | 1;
  created_at: string;
  updated_at: string;
}

/** Shape returned by the list/search/featured endpoints */
export interface ProductListResponse {
  products: Product[];
  count: number;
}

/** Query params accepted by GET /api/products */
export interface ProductQueryParams {
  search?: string;
  featured?: '1';
  category?: string;
}

// ── Cart (placeholder) ────────────────────────────────────────────────────────

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  total: number;
}

// ── Order (placeholder) ───────────────────────────────────────────────────────

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
}
