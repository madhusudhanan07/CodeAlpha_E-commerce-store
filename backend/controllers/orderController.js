/**
 * orderController.js — Order Processing Business Logic (Firestore)
 *
 * Handles checkout, order creation, order retrieval, and cancellation.
 * Uses Firestore batch writes to ensure atomicity during order placement and cancellation.
 * MySQL transactions replaced with db.batch() operations.
 */

import db from '../config/db.js';
import * as OrderModel from '../models/Order.js';
import * as OrderItemModel from '../models/OrderItem.js';
import * as CartItemModel from '../models/CartItem.js';
import * as ProductModel from '../models/Product.js';
import * as UserModel from '../models/User.js';

// ── Helper: resolve Firebase UID → user document (returns UID string) ─────────
const resolveUserId = async (firebaseUid) => {
  let user = await UserModel.findByFirebaseUid(firebaseUid);
  if (!user) {
    // Auto-provision user in Firestore if not yet registered
    await UserModel.create({
      firebase_uid: firebaseUid,
      full_name: 'Customer',
      email: `${firebaseUid}@firebase.user`,
    });
    user = await UserModel.findByFirebaseUid(firebaseUid);
  }
  return user?.firebase_uid || user?.id || null;
};

// ── POST /api/orders — Place a new order ─────────────────────────────────────
export const placeOrder = async (req, res, next) => {
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
      payment_method  = 'Cash on Delivery',
      delivery_method = 'Standard Delivery',
      coupon_code     = null,
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
    const enrichedItems = [];

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
      enrichedItems.push({
        product_id: String(item.product_id),
        product_name: item.product_name ?? product.name,
        product_slug: item.product_slug ?? product.slug,
        product_image: item.product_image ?? product.image_url,
        quantity: item.quantity,
        unit_price: Number(product.price),
        line_total: Number(product.price) * item.quantity,
      });
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

    const tax      = Number((subtotal * 0.08).toFixed(2));
    let discount   = 0;
    if (coupon_code && coupon_code.toUpperCase() === 'CODEALPHA20') {
      discount = Number((subtotal * 0.20).toFixed(2));
    }

    const grandTotal = Number((subtotal + deliveryCharge + tax - discount).toFixed(2));

    // ── 6. Execute order placement using Firestore batch writes ──────────────
    const batch    = db.batch();
    const orderRef = db.collection('orders').doc(); // auto-generated ID

    // 6a. Create order document with embedded items
    batch.set(orderRef, {
      user_id: String(userId),
      total_amount: grandTotal,
      order_status: 'Processing',
      payment_status: payment_method === 'Cash on Delivery' ? 'Pending' : 'Paid',
      payment_method,
      shipping_address: {
        ...shipping_address,
        delivery_method,
        coupon_code,
        subtotal,
        tax,
        shipping_fee: deliveryCharge,
        discount,
      },
      items: enrichedItems,
      created_at: new Date().toISOString(),
    });

    // 6b. Decrement stock for each product in the batch
    for (const item of cartItems) {
      const productRef = db.collection('products').doc(String(item.product_id));
      const productDoc = await productRef.get();
      if (productDoc.exists) {
        const currentStock = Number(productDoc.data().stock ?? 0);
        batch.update(productRef, {
          stock: Math.max(currentStock - item.quantity, 0),
          updated_at: new Date().toISOString(),
        });
      }
    }

    // 6c. Clear cart items in the batch
    const cartSnap = await db.collection('cart_items')
      .where('user_id', '==', String(userId))
      .get();
    cartSnap.docs.forEach((doc) => batch.delete(doc.ref));

    // 6d. Commit the entire batch atomically
    await batch.commit();

    const orderId = orderRef.id;

    // ── 7. Return order confirmation ─────────────────────────────────────────
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
  } catch (error) {
    next(error);
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

    // Items are already embedded in each order document
    const ordersWithItems = orders.map((order) => ({
      ...order,
      items: order.items ?? [],
    }));

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
    const orderId = req.params.id;

    if (!orderId) {
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

    // Items are embedded — use OrderItemModel for consistent response shape
    const items = await OrderItemModel.findByOrderId(orderId);

    return res.status(200).json({
      success: true,
      message: 'Order details retrieved.',
      data: {
        order: {
          ...order,
          shipping_address: order.shipping_address,
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
  try {
    const orderId = req.params.id;
    const userId  = await resolveUserId(req.decodedUser.uid);

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

    const items = order.items ?? [];

    // Use Firestore batch to atomically cancel order + restore stock
    const batch = db.batch();

    // Update order status to Cancelled
    const orderRef = db.collection('orders').doc(String(orderId));
    batch.update(orderRef, { order_status: 'Cancelled' });

    // Restore product stock
    for (const item of items) {
      const productRef = db.collection('products').doc(String(item.product_id));
      const productDoc = await productRef.get();
      if (productDoc.exists) {
        const currentStock = Number(productDoc.data().stock ?? 0);
        batch.update(productRef, {
          stock: currentStock + item.quantity,
          updated_at: new Date().toISOString(),
        });
      }
    }

    await batch.commit();

    const updatedOrder = await OrderModel.findByIdAndUser(orderId, userId);

    return res.status(200).json({
      success: true,
      message: 'Order cancelled successfully. Stock restored.',
      data: { order: updatedOrder },
    });
  } catch (error) {
    next(error);
  }
};
