/**
 * models/index.js — Model Registry
 *
 * Re-exports all model modules from a single import point.
 *
 * Usage in controllers (Phase 3+):
 *   import { User, Product, Order } from '../models/index.js';
 *   const user = await User.findByFirebaseUid(uid);
 */

export * as User      from './User.js';
export * as Category  from './Category.js';
export * as Product   from './Product.js';
export * as CartItem  from './CartItem.js';
export * as Order     from './Order.js';
export * as OrderItem from './OrderItem.js';
