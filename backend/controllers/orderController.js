/**
 * orderController.js — Order Processing Business Logic
 *
 * Handles checkout, order creation, and order retrieval.
 * Uses MySQL transactions to ensure atomicity during order placement.
 *
 * Flow for POST /api/orders (place order):
 *  1. Resolve Firebase UID → MySQL user ID
 *  2. Fetch cart items for user
 *  3. Validate stock availability for each item
 *  4. Calculate grand total
 *  5. Create order record (within transaction)
 *  6. Bulk-insert order items (within transaction)
 *  7. Decrement product stock for each item (within transaction)
 *  8. Clear user's cart (within transaction)
 *  9. Return order confirmation
 */

import pool from '../config/db.js';
import * as OrderModel from '../models/Order.js';
import * as OrderItemModel from '../models/OrderItem.js';
import * as CartItemModel from '../models/CartItem.js';
import * as ProductModel from '../models/Product.js';
import * as UserModel from '../models/User.js';

// ── Helper: resolve Firebase UID → MySQL user ID ─────────────────────────────
const resolveUserId = async (firebaseUid) => {
  const user = await UserModel.findByFirebaseUid(firebaseUid);
  return user?.id || null;
};

// ── POST /api/orders — Place a new order ─────────────────────────────────────
export const placeOrder = async (req, res, next) => {
  const connection = await pool.getConnection();

  try {
    const userId = await resolveUserId(req.decodedUser.uid);
    if (!userId) {
      return res.status(404).json({
        success: false,
        message: 'User account not found. Please sign in again.',
      });
    }

    const { shipping_address, payment_method = 'Cash on Delivery' } = req.body;

    // ── 1. Validate shipping address ─────────────────────────────────────────
    if (!shipping_address) {
      return res.status(400).json({
        success: false,
        message: 'Shipping address is required.',
      });
    }

    const { full_name, mobile, address, city, state, zip_code } = shipping_address;

    if (!full_name || !mobile || !address || !city || !state || !zip_code) {
      return res.status(400).json({
        success: false,
        message: 'All shipping address fields are required (full name, mobile, address, city, state, ZIP code).',
      });
    }

    // ── 2. Validate payment method ───────────────────────────────────────────
    const validPaymentMethods = ['Cash on Delivery', 'UPI', 'Credit/Debit Card'];
    if (!validPaymentMethods.includes(payment_method)) {
      return res.status(400).json({
        success: false,
        message: `Invalid payment method. Choose from: ${validPaymentMethods.join(', ')}`,
      });
    }

    // ── 3. Fetch user's cart ─────────────────────────────────────────────────
    const cartItems = await CartItemModel.findByUserId(userId);

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Your cart is empty. Add items before placing an order.',
      });
    }

    // ── 4. Validate stock & calculate totals ─────────────────────────────────
    const stockErrors = [];
    let subtotal = 0;

    for (const item of cartItems) {
      const product = await ProductModel.findById(item.product_id);

      if (!product) {
        stockErrors.push(`Product "${item.product_name}" is no longer available.`);
        continue;
      }

      if (product.stock < item.quantity) {
        stockErrors.push(
          product.stock === 0
            ? `"${item.product_name}" is out of stock.`
            : `"${item.product_name}" has only ${product.stock} units in stock (requested ${item.quantity}).`,
        );
        continue;
      }

      subtotal += Number(product.price) * item.quantity;
    }

    if (stockErrors.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Some items in your cart have stock issues.',
        errors: stockErrors,
      });
    }

    // ── 5. Calculate delivery charge & grand total ───────────────────────────
    const deliveryCharge = subtotal >= 500 ? 0 : 40;
    const grandTotal = subtotal + deliveryCharge;

    // ── 6. Execute order placement in a transaction ──────────────────────────
    await connection.beginTransaction();

    try {
      // 6a. Create order
      const [orderResult] = await connection.query(
        `INSERT INTO orders (user_id, total_amount, order_status, payment_status, payment_method, shipping_address)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          userId,
          grandTotal,
          'Processing',
          payment_method === 'Cash on Delivery' ? 'Pending' : 'Paid',
          payment_method,
          JSON.stringify(shipping_address),
        ],
      );

      const orderId = orderResult.insertId;

      // 6b. Bulk-insert order items
      const orderItemValues = cartItems.map((item) => [
        orderId,
        item.product_id,
        item.quantity,
        Number(item.product_price),
      ]);

      await connection.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?',
        [orderItemValues],
      );

      // 6c. Decrement stock for each product
      for (const item of cartItems) {
        await connection.query(
          'UPDATE products SET stock = GREATEST(stock - ?, 0) WHERE id = ?',
          [item.quantity, item.product_id],
        );
      }

      // 6d. Clear user's cart
      await connection.query(
        'DELETE FROM cart_items WHERE user_id = ?',
        [userId],
      );

      // 6e. Commit transaction
      await connection.commit();

      // ── 7. Return order confirmation ─────────────────────────────────────
      return res.status(201).json({
        success: true,
        message: 'Order placed successfully!',
        data: {
          order: {
            id: orderId,
            total_amount: grandTotal,
            subtotal,
            delivery_charge: deliveryCharge,
            payment_method,
            order_status: 'Processing',
            shipping_address,
            item_count: cartItems.length,
            created_at: new Date().toISOString(),
          },
        },
      });
    } catch (txError) {
      await connection.rollback();
      throw txError;
    }
  } catch (error) {
    next(error);
  } finally {
    connection.release();
  }
};

// ── GET /api/orders — Get all orders for the logged-in user ──────────────────
export const getOrders = async (req, res, next) => {
  try {
    const userId = await resolveUserId(req.decodedUser.uid);
    if (!userId) {
      return res.status(404).json({
        success: false,
        message: 'User account not found.',
      });
    }

    const orders = await OrderModel.findByUserId(userId);

    // Parse shipping_address JSON for each order
    const parsedOrders = orders.map((order) => ({
      ...order,
      shipping_address:
        typeof order.shipping_address === 'string'
          ? JSON.parse(order.shipping_address)
          : order.shipping_address,
    }));

    return res.status(200).json({
      success: true,
      message: 'Orders retrieved successfully.',
      data: { orders: parsedOrders, count: parsedOrders.length },
    });
  } catch (error) {
    next(error);
  }
};

// ── GET /api/orders/:id — Get full order details ─────────────────────────────
export const getOrderById = async (req, res, next) => {
  try {
    const orderId = Number(req.params.id);

    if (!orderId || isNaN(orderId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID.',
      });
    }

    const userId = await resolveUserId(req.decodedUser.uid);
    if (!userId) {
      return res.status(404).json({
        success: false,
        message: 'User account not found.',
      });
    }

    // Verify order belongs to user (prevents enumeration)
    const order = await OrderModel.findByIdAndUser(orderId, userId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.',
      });
    }

    // Fetch line items
    const items = await OrderItemModel.findByOrderId(orderId);

    // Parse shipping_address if needed
    const shippingAddress =
      typeof order.shipping_address === 'string'
        ? JSON.parse(order.shipping_address)
        : order.shipping_address;

    return res.status(200).json({
      success: true,
      message: 'Order details retrieved.',
      data: {
        order: {
          ...order,
          shipping_address: shippingAddress,
        },
        items,
      },
    });
  } catch (error) {
    next(error);
  }
};
