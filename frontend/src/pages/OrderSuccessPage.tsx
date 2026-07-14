/**
 * OrderSuccessPage.tsx — Order Confirmation Success Screen
 *
 * Displayed after a successful checkout. Receives order data via React Router state.
 *
 * Shows:
 *  - Animated success checkmark icon
 *  - Order ID, Total Amount, Payment Method, Items Count
 *  - "Continue Shopping" and "View Orders" action buttons
 *
 * If accessed without order data (direct URL), redirects to home.
 */

import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import type { OrderConfirmation } from '../types';
import '../styles/checkout.css';

const OrderSuccessPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = (location.state as { order?: OrderConfirmation })?.order;

  // If no order data, redirect to home
  useEffect(() => {
    if (!order) {
      navigate('/', { replace: true });
    }
  }, [order, navigate]);

  if (!order) return null;

  return (
    <main className="order-success" aria-label="Order success page">
      <div className="order-success__card">
        {/* Success Icon */}
        <div className="order-success__icon" aria-hidden="true">
          <span className="order-success__checkmark">✓</span>
        </div>

        <h1 className="order-success__title">Order Placed!</h1>
        <p className="order-success__subtitle">
          Thank you for your purchase. Your order has been confirmed and is being processed.
        </p>

        {/* Order Details Grid */}
        <div className="order-success__details">
          <div className="order-success__detail">
            <span className="order-success__detail-label">Order ID</span>
            <span className="order-success__detail-value">#{order.id}</span>
          </div>
          <div className="order-success__detail">
            <span className="order-success__detail-label">Total Amount</span>
            <span className="order-success__detail-value order-success__detail-value--amount">
              ${Number(order.total_amount).toFixed(2)}
            </span>
          </div>
          <div className="order-success__detail">
            <span className="order-success__detail-label">Payment</span>
            <span className="order-success__detail-value">{order.payment_method}</span>
          </div>
          <div className="order-success__detail">
            <span className="order-success__detail-label">Items</span>
            <span className="order-success__detail-value">{order.item_count} product{order.item_count !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="order-success__actions">
          <Link to="/products" className="order-success__btn order-success__btn--primary">
            Continue Shopping
          </Link>
          <Link to="/orders" className="order-success__btn order-success__btn--secondary">
            View My Orders
          </Link>
        </div>
      </div>
    </main>
  );
};

export default OrderSuccessPage;
