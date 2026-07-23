/**
 * OrdersPage.tsx — Customer Order History & Tracking
 *
 * Displays all past and active orders for the authenticated user,
 * with status color badges and interactive order cancellation.
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../services/axiosInstance';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import type { Order, OrderItem } from '../types';
import '../styles/pages.css';

interface OrderWithItems extends Order {
  items?: OrderItem[];
}

const STATUS_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  Pending:    { bg: 'rgba(245, 158, 11, 0.15)', border: 'rgba(245, 158, 11, 0.4)', text: '#f59e0b' },
  Processing: { bg: 'rgba(59, 130, 246, 0.15)', border: 'rgba(59, 130, 246, 0.4)', text: '#60a5fa' },
  Shipped:    { bg: 'rgba(139, 92, 246, 0.15)', border: 'rgba(139, 92, 246, 0.4)', text: '#a78bfa' },
  Delivered:  { bg: 'rgba(34, 197, 94, 0.15)',  border: 'rgba(34, 197, 94, 0.4)',  text: '#4ade80' },
  Cancelled:  { bg: 'rgba(239, 68, 68, 0.15)',  border: 'rgba(239, 68, 68, 0.4)',  text: '#f87171' },
};

const OrdersPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get('/api/orders');
      if (res.data && res.data.data && res.data.data.orders) {
        setOrders(res.data.data.orders);
      }
    } catch (err: any) {
      console.error('Error fetching orders:', err);
      setError(err.response?.data?.message || 'Failed to fetch order history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  const handleCancelOrder = async (orderId: number) => {
    if (!window.confirm(`Are you sure you want to cancel order #${orderId}?`)) return;

    setCancellingId(orderId);
    try {
      const res = await axiosInstance.put(`/api/orders/${orderId}/cancel`);
      if (res.data && res.data.success) {
        toast.success(`Order #${orderId} cancelled successfully.`);
        fetchOrders();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to cancel order.');
    } finally {
      setCancellingId(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="container page-content">
        <div className="empty-state">
          <span className="empty-state__icon">🔒</span>
          <h1 className="empty-state__title">Please Sign In</h1>
          <p className="empty-state__desc">Sign in to view your order history and track active shipments.</p>
          <Link to="/login" className="hero__btn--primary" style={{ marginTop: '1rem', display: 'inline-block' }}>
            Sign In Now
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container page-content">
      <header className="page-header">
        <h1 className="page-title">My Orders</h1>
        <p className="page-subtitle">Track your recent orders and review purchase history</p>
      </header>

      {/* Loading Skeleton */}
      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="skeleton" style={{ height: '220px', borderRadius: 'var(--radius-xl)' }} />
          ))}
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="empty-state">
          <span className="empty-state__icon">⚠️</span>
          <h1 className="empty-state__title">Failed to load orders</h1>
          <p className="empty-state__desc">{error}</p>
          <button className="hero__btn--primary" style={{ marginTop: '1rem' }} onClick={fetchOrders}>
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && orders.length === 0 && (
        <div className="empty-state">
          <span className="empty-state__icon">📦</span>
          <h1 className="empty-state__title">No orders found</h1>
          <p className="empty-state__desc">You haven't placed any orders yet. Explore our store to start shopping!</p>
          <Link to="/products" className="hero__btn--primary" style={{ marginTop: '1.5rem', display: 'inline-block' }}>
            Browse Products
          </Link>
        </div>
      )}

      {/* Orders List */}
      {!loading && !error && orders.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {orders.map((order) => {
            const statusConfig = STATUS_COLORS[order.order_status] || STATUS_COLORS.Pending;
            const isCancellable = order.order_status === 'Pending' || order.order_status === 'Processing';
            const dateStr = new Date(order.created_at).toLocaleString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: true,
            });

            return (
              <div
                key={order.id}
                style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '1.5rem',
                  boxShadow: 'var(--shadow-md)',
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-text)', margin: 0 }}>
                      Order #{order.id}
                    </h2>
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Placed on {dateStr}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span
                      style={{
                        padding: '4px 12px',
                        borderRadius: 'var(--radius-full)',
                        background: statusConfig.bg,
                        border: `1px solid ${statusConfig.border}`,
                        color: statusConfig.text,
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {order.order_status}
                    </span>

                    <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--color-text)' }}>
                      ${Number(order.total_amount).toFixed(2)}
                    </span>
                  </div>
                </div>

                <hr style={{ borderColor: 'var(--color-border)', opacity: 0.5, margin: '1rem 0' }} />

                {/* Items List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item) => (
                      <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <img
                          src={item.product_image || 'https://placehold.co/60x60/1a1a24/6c63ff?text=Product'}
                          alt={item.product_name}
                          style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }}
                        />
                        <div style={{ flex: 1 }}>
                          <Link to={`/products/${item.product_id}`} style={{ fontWeight: 600, color: 'var(--color-text)', textDecoration: 'none' }}>
                            {item.product_name}
                          </Link>
                          <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                            Qty: {item.quantity} × ${Number(item.unit_price).toFixed(2)}
                          </div>
                        </div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text)' }}>
                          ${Number(item.line_total).toFixed(2)}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                      Payment Method: {order.payment_method}
                    </div>
                  )}
                </div>

                {/* Footer Actions */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', alignItems: 'center' }}>
                  {isCancellable && (
                    <button
                      type="button"
                      className="cart-item__remove"
                      onClick={() => handleCancelOrder(order.id)}
                      disabled={cancellingId === order.id}
                      style={{ fontSize: '0.85rem' }}
                    >
                      {cancellingId === order.id ? 'Cancelling…' : 'Cancel Order'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
};

export default OrdersPage;
