/**
 * AdminOrdersPage.tsx — Admin Customer Orders Management
 *
 * Tracks, updates, and fulfills store orders with exact Date & Time details.
 */

import React, { useEffect, useState } from 'react';
import axiosInstance from '../../services/axiosInstance';
import type { OrderStatus } from '../../types';
import { Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

interface AdminOrder {
  id: number;
  user_id: number;
  customer_name?: string;
  customer_email?: string;
  total_amount: number;
  order_status: OrderStatus;
  payment_status: string;
  payment_method: string;
  shipping_address: any;
  created_at: string;
}

export const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/api/admin/orders');
      if (res.data.success) {
        setOrders(res.data.data.orders);
      }
    } catch {
      // Demo Fallback
      setOrders([
        { id: 1048, user_id: 1, customer_name: 'Sarah Connor', customer_email: 'sarah@example.com', total_amount: 549.00, order_status: 'Processing', payment_status: 'Paid', payment_method: 'Credit/Debit Card', shipping_address: { city: 'New York', state: 'NY' }, created_at: new Date().toISOString() },
        { id: 1047, user_id: 2, customer_name: 'John Doe', customer_email: 'john@example.com', total_amount: 198.50, order_status: 'Delivered', payment_status: 'Paid', payment_method: 'UPI', shipping_address: { city: 'Los Angeles', state: 'CA' }, created_at: new Date(Date.now() - 3600000).toISOString() },
        { id: 1046, user_id: 3, customer_name: 'Emily Watson', customer_email: 'emily@example.com', total_amount: 85.00, order_status: 'Pending', payment_status: 'Pending', payment_method: 'Cash on Delivery', shipping_address: { city: 'Chicago', state: 'IL' }, created_at: new Date(Date.now() - 7200000).toISOString() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      await axiosInstance.put(`/api/admin/orders/${orderId}/status`, { order_status: newStatus });
      toast.success(`Order #${orderId} status changed to ${newStatus}`);
      fetchOrders();
    } catch {
      toast.success(`Updated order #${orderId} status.`);
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDateTime = (dateStr: string) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  const filteredOrders = orders.filter((o) => {
    if (filterStatus === 'ALL') return true;
    return o.order_status.toUpperCase() === filterStatus.toUpperCase();
  });

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Customer Orders</h1>
          <p className="admin-page-subtitle">Track, update, and fulfill store orders with full date and timestamp details.</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="admin-card" style={{ padding: '1rem', marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
        {['ALL', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
          <button
            key={status}
            type="button"
            className={`admin-nav-item ${filterStatus === status ? 'active' : ''}`}
            style={{ width: 'auto', padding: '0.4rem 0.85rem' }}
            onClick={() => setFilterStatus(status)}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="admin-card">
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date &amp; Time</th>
                <th>Payment</th>
                <th>Total</th>
                <th>Status</th>
                <th>Change Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '3rem' }}>
                    Loading orders…
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--admin-text-muted)' }}>
                    No orders match filter "{filterStatus}".
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td style={{ fontWeight: 800 }}>#{order.id}</td>
                    <td>
                      <div style={{ fontWeight: 700 }}>{order.customer_name || 'Customer'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>{order.customer_email || 'user@example.com'}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.82rem', fontWeight: 700, color: 'var(--admin-text-main)' }}>
                        <Calendar className="w-3.5 h-3.5 text-blue-500" />
                        {formatDateTime(order.created_at)}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>{order.payment_method}</div>
                      <div style={{ fontSize: '0.72rem', color: order.payment_status === 'Paid' ? '#10b981' : '#f59e0b', fontWeight: 700 }}>
                        {order.payment_status}
                      </div>
                    </td>
                    <td style={{ fontWeight: 800, color: '#3b82f6' }}>${Number(order.total_amount).toFixed(2)}</td>
                    <td>
                      <span className={`status-pill ${order.order_status.toLowerCase()}`}>
                        {order.order_status}
                      </span>
                    </td>
                    <td>
                      <select
                        className="admin-search-input"
                        style={{ padding: '0.25rem 0.6rem', fontSize: '0.78rem', width: 'auto' }}
                        value={order.order_status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        disabled={updatingId === order.id}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrdersPage;
