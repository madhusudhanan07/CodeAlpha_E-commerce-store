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

// ── Cart ──────────────────────────────────────────────────────────────────────

export interface CartItem {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  created_at: string;
  product_name: string;
  product_slug: string;
  product_image: string | null;
  product_price: number | string;
  product_stock: number;
  product_category: string | null;
  subtotal: number;
}

export interface CartState {
  cart: CartItem[];
  count: number;
  total_price: number;
}

// ── Order ─────────────────────────────────────────────────────────────────────

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
export type PaymentStatus = 'Pending' | 'Paid' | 'Failed';
export type PaymentMethod = 'Cash on Delivery' | 'UPI' | 'Credit/Debit Card';

/** Shipping address captured at checkout */
export interface ShippingAddress {
  full_name: string;
  mobile: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
}

/** Order row from GET /api/orders */
export interface Order {
  id: number;
  user_id: number;
  total_amount: number;
  order_status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod;
  shipping_address: ShippingAddress | null;
  created_at: string;
}

/** Order line item from GET /api/orders/:id */
export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  line_total: number;
  product_name: string;
  product_slug: string;
  product_image: string | null;
}

/** Payload for POST /api/orders */
export interface PlaceOrderPayload {
  shipping_address: ShippingAddress;
  payment_method: PaymentMethod;
}

/** Response shape from POST /api/orders */
export interface OrderConfirmation {
  id: number;
  total_amount: number;
  subtotal: number;
  delivery_charge: number;
  payment_method: PaymentMethod;
  order_status: OrderStatus;
  shipping_address: ShippingAddress;
  item_count: number;
  created_at: string;
}

/** Response shape from GET /api/orders */
export interface OrderListResponse {
  orders: Order[];
  count: number;
}

/** Response shape from GET /api/orders/:id */
export interface OrderDetailResponse {
  order: Order;
  items: OrderItem[];
}
