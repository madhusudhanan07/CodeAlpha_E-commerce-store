/**
 * orderController.js — Order Processing Business Logic
 *
 * Handles checkout, order creation, order retrieval, and cancellation.
 * Uses MySQL transactions to ensure atomicity during order placement and cancellation.
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

    const {
      shipping_address,
      payment_method = 'Cash on Delivery',
      delivery_method = 'Standard Delivery',
      coupon_code = null,
    } = req.body;

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
    const validPaymentMethods = ['Cash on Delivery', 'Credit/Debit Card', 'UPI', 'Wallet'];
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

    // ── 5. Calculate shipping fee, tax (8%), discount & grand total ──────────
    let deliveryCharge = 0;
    if (delivery_method === 'Express Delivery') {
      deliveryCharge = 15;
    } else if (delivery_method === 'Store Pickup') {
      deliveryCharge = 0;
    } else {
      deliveryCharge = subtotal >= 50 ? 0 : 10;
    }

    const tax = Number((subtotal * 0.08).toFixed(2));
    let discount = 0;
    if (coupon_code && coupon_code.toUpperCase() === 'CODEALPHA20') {
      discount = Number((subtotal * 0.20).toFixed(2));
    }

    const grandTotal = Number((subtotal + deliveryCharge + tax - discount).toFixed(2));

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
          JSON.stringify({
            ...shipping_address,
            delivery_method,
            coupon_code,
            subtotal,
            tax,
            shipping_fee: deliveryCharge,
            discount,
          }),
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
            tax,
            shipping_fee: deliveryCharge,
            discount,
            payment_method,
            delivery_method,
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

    // Join order items for each order
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const items = await OrderItemModel.findByOrderId(order.id);
        const parsedAddress =
          typeof order.shipping_address === 'string'
            ? JSON.parse(order.shipping_address)
            : order.shipping_address;

        return {
          ...order,
          shipping_address: parsedAddress,
          items,
        };
      }),
    );

    return res.status(200).json({
      success: true,
      message: 'Orders retrieved successfully.',
      data: { orders: ordersWithItems, count: ordersWithItems.length },
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

    const order = await OrderModel.findByIdAndUser(orderId, userId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.',
      });
    }

    const items = await OrderItemModel.findByOrderId(orderId);
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

// ── PUT /api/orders/:id/cancel — Cancel an order ─────────────────────────────
export const cancelOrder = async (req, res, next) => {
  const connection = await pool.getConnection();

  try {
    const orderId = Number(req.params.id);
    const userId = await resolveUserId(req.decodedUser.uid);

    if (!userId) {
      return res.status(404).json({ success: false, message: 'User account not found.' });
    }

    const order = await OrderModel.findByIdAndUser(orderId, userId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    if (order.order_status === 'Shipped' || order.order_status === 'Delivered') {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled once it is ${order.order_status.toLowerCase()}.`,
      });
    }

    if (order.order_status === 'Cancelled') {
      return res.status(400).json({ success: false, message: 'Order is already cancelled.' });
    }

    const items = await OrderItemModel.findByOrderId(orderId);

    await connection.beginTransaction();

    try {
      // Update status to Cancelled
      await connection.query('UPDATE orders SET order_status = ? WHERE id = ?', ['Cancelled', orderId]);

      // Restore product stock
      for (const item of items) {
        await connection.query(
          'UPDATE products SET stock = stock + ? WHERE id = ?',
          [item.quantity, item.product_id],
        );
      }

      await connection.commit();

      const updatedOrder = await OrderModel.findByIdAndUser(orderId, userId);

      return res.status(200).json({
        success: true,
        message: 'Order cancelled successfully. Stock restored.',
        data: { order: updatedOrder },
      });
    } catch (txErr) {
      await connection.rollback();
      throw txErr;
    }
  } catch (error) {
    next(error);
  } finally {
    connection.release();
  }
};
