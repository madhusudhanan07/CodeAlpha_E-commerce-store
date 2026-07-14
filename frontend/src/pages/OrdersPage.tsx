/**
 * OrdersPage.tsx — My Orders Page with Order Detail Modal
 *
 * Displays:
 *  - List of all user orders (Order ID, Date, Status Badge, Total)
 *  - Clicking an order opens a fullscreen modal with:
 *    - Order info (ID, date, status, payment method)
 *    - Purchased products with quantity, price, and line totals
 *    - Shipping address
 *    - Order total breakdown
 *
 * Order statuses have distinct colored badges:
 *  Processing → amber, Confirmed → blue, Shipped → purple, Delivered → green, Cancelled → red
 */

import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchOrders, fetchOrderById } from '../services/orderService';
import type { Order, OrderItem, OrderStatus } from '../types';
import '../styles/checkout.css';

// ── Status badge class mapping ───────────────────────────────────────────────
const statusBadgeClass = (status: OrderStatus): string => {
  const map: Record<string, string> = {
    Pending:    'order-status-badge--pending',
    Processing: 'order-status-badge--processing',
    Confirmed:  'order-status-badge--confirmed',
    Shipped:    'order-status-badge--shipped',
    Delivered:  'order-status-badge--delivered',
    Cancelled:  'order-status-badge--cancelled',
  };
  return map[status] || 'order-status-badge--pending';
};

const OrdersPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Detail modal state
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedItems, setSelectedItems] = useState<OrderItem[]>([]);
  const [detailLoading, setDetailLoading] = useState(false);

  // ── Fetch orders ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isAuthenticated) return;

    const loadOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchOrders();
        setOrders(data.orders);
      } catch (err: any) {
        setError(err.message || 'Failed to load orders.');
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [isAuthenticated]);

  // ── Open order detail ─────────────────────────────────────────────────────
  const openOrderDetail = useCallback(async (orderId: number) => {
    setDetailLoading(true);
    try {
      const data = await fetchOrderById(orderId);
      setSelectedOrder(data.order);
      setSelectedItems(data.items);
    } catch (err: any) {
      setError(err.message || 'Failed to load order details.');
    } finally {
      setDetailLoading(false);
    }
  }, []);

  // ── Close detail modal ────────────────────────────────────────────────────
  const closeDetail = useCallback(() => {
    setSelectedOrder(null);
    setSelectedItems([]);
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDetail();
    };
    if (selectedOrder) {
      document.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [selectedOrder, closeDetail]);

  // ── Format date ───────────────────────────────────────────────────────────
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // ── Guards ────────────────────────────────────────────────────────────────

  if (!isAuthenticated) {
    return (
      <main className="container page-content">
        <div className="empty-state">
          <span className="empty-state__icon">🔒</span>
          <h1 className="empty-state__title">Please Sign In</h1>
          <p className="empty-state__desc">Sign in to view your orders.</p>
          <Link to="/login" className="order-success__btn order-success__btn--primary" style={{ marginTop: '1.5rem' }}>
            Sign In
          </Link>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <div className="checkout-loading">
        <span className="checkout-loading__spinner" />
        <p>Loading your orders...</p>
      </div>
    );
  }

  if (error && orders.length === 0) {
    return (
      <main className="container page-content">
        <div className="empty-state">
          <span className="empty-state__icon">⚠️</span>
          <h1 className="empty-state__title">Something went wrong</h1>
          <p className="empty-state__desc">{error}</p>
        </div>
      </main>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <main className="orders-page container">
      <header className="page-header">
        <h1 className="page-title">My Orders</h1>
        <p className="page-subtitle">
          {orders.length === 0
            ? "You haven't placed any orders yet."
            : `You have ${orders.length} order${orders.length !== 1 ? 's' : ''}.`}
        </p>
      </header>

      {orders.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state__icon">📦</span>
          <h2 className="empty-state__title">No orders yet</h2>
          <p className="empty-state__desc">
            Start shopping to see your orders here.
          </p>
          <Link
            to="/products"
            className="order-success__btn order-success__btn--primary"
            style={{ marginTop: '1.5rem' }}
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order, index) => (
            <div
              key={order.id}
              className="order-card"
              onClick={() => openOrderDetail(order.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') openOrderDetail(order.id); }}
              style={{ animationDelay: `${index * 0.05}s` }}
              aria-label={`Order #${order.id}`}
            >
              <div className="order-card__header">
                <div>
                  <div className="order-card__id">
                    Order <span>#{order.id}</span>
                  </div>
                  <div className="order-card__date">{formatDate(order.created_at)}</div>
                </div>
                <span className={`order-status-badge ${statusBadgeClass(order.order_status)}`}>
                  <span className="order-status-dot" />
                  {order.order_status}
                </span>
              </div>

              <div className="order-card__footer">
                <div>
                  <div className="order-card__total">${Number(order.total_amount).toFixed(2)}</div>
                  <div className="order-card__payment">{order.payment_method}</div>
                </div>
                <span className="order-card__arrow">→</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Order Detail Modal ──────────────────────────────────────────────── */}
      {(selectedOrder || detailLoading) && (
        <div
          className="order-detail-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeDetail();
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Order details"
        >
          {detailLoading ? (
            <div className="order-detail" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
              <div className="checkout-loading" style={{ minHeight: 'auto' }}>
                <span className="checkout-loading__spinner" />
                <p>Loading order details...</p>
              </div>
            </div>
          ) : selectedOrder && (
            <div className="order-detail">
              {/* Header */}
              <div className="order-detail__header">
                <div>
                  <h2 className="order-detail__title">
                    Order <span>#{selectedOrder.id}</span>
                  </h2>
                  <p className="order-detail__meta">
                    {formatDate(selectedOrder.created_at)}
                    {' · '}
                    <span className={`order-status-badge ${statusBadgeClass(selectedOrder.order_status)}`}>
                      <span className="order-status-dot" />
                      {selectedOrder.order_status}
                    </span>
                  </p>
                </div>
                <button
                  className="order-detail__close"
                  onClick={closeDetail}
                  aria-label="Close order details"
                >
                  ✕
                </button>
              </div>

              {/* Purchased Items */}
              <div className="order-detail__section">
                <h3 className="order-detail__section-title">Purchased Items</h3>
                <div className="order-detail__items">
                  {selectedItems.map((item) => (
                    <div key={item.id} className="order-detail-item">
                      <img
                        src={item.product_image || 'https://placehold.co/56x56/1a1a24/6c63ff?text=No+Img'}
                        alt={item.product_name}
                        className="order-detail-item__image"
                      />
                      <div className="order-detail-item__info">
                        <div className="order-detail-item__name">{item.product_name}</div>
                        <div className="order-detail-item__meta">
                          Qty: {item.quantity} × ${Number(item.unit_price).toFixed(2)}
                        </div>
                      </div>
                      <span className="order-detail-item__total">
                        ${Number(item.line_total).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              {selectedOrder.shipping_address && (
                <div className="order-detail__section">
                  <h3 className="order-detail__section-title">Shipping Address</h3>
                  <div className="order-detail__address">
                    <strong>{selectedOrder.shipping_address.full_name}</strong>
                    <br />
                    {selectedOrder.shipping_address.address}
                    <br />
                    {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} — {selectedOrder.shipping_address.zip_code}
                    <br />
                    📞 {selectedOrder.shipping_address.mobile}
                  </div>
                </div>
              )}

              {/* Order Total */}
              <div className="order-detail__section">
                <h3 className="order-detail__section-title">Payment Summary</h3>
                <div className="order-detail__totals">
                  <div className="order-detail__totals-row">
                    <span>Payment Method</span>
                    <span>{selectedOrder.payment_method}</span>
                  </div>
                  <div className="order-detail__totals-row">
                    <span>Payment Status</span>
                    <span>{selectedOrder.payment_status}</span>
                  </div>
                  <div className="order-detail__totals-row order-detail__totals-row--grand">
                    <span>Grand Total</span>
                    <span>${Number(selectedOrder.total_amount).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
};

export default OrdersPage;
