/**
 * OrderSuccessPage.tsx — Order Confirmation & Success View
 *
 * Rendered immediately after a successful checkout submission.
 */

import { useLocation, Link } from 'react-router-dom';
import '../styles/pages.css';

const OrderSuccessPage: React.FC = () => {
  const location = useLocation();
  const order = location.state?.order;

  // Calculate estimated delivery date (4 business days from today)
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 4);
  const formattedDelivery = deliveryDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <main className="container page-content">
      <div className="empty-state" style={{ maxWidth: '600px', margin: '2rem auto' }}>
        
        {/* Animated Celebration Icon */}
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(16, 185, 129, 0.3))',
          border: '2px solid #22c55e',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2.5rem',
          color: '#22c55e',
          margin: '0 auto 1.5rem',
          boxShadow: '0 0 30px rgba(34, 197, 94, 0.4)',
        }}>
          ✓
        </div>

        <h1 className="empty-state__title" style={{ fontSize: '2rem' }}>Order Placed Successfully!</h1>
        
        <p className="empty-state__desc" style={{ fontSize: '1rem', marginTop: '0.5rem' }}>
          Thank you for your purchase. We have received your order and are currently preparing it for shipment.
        </p>

        {/* Confirmation Details Card */}
        <div style={{
          width: '100%',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.5rem',
          margin: '1.5rem 0',
          textAlign: 'left',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>Order ID:</span>
            <strong style={{ color: 'var(--color-primary-light)' }}>#{order?.id || 'ORD-84920'}</strong>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>Total Amount Paid:</span>
            <strong style={{ color: 'var(--color-text)' }}>${Number(order?.total_amount || 0).toFixed(2)}</strong>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>Payment Method:</span>
            <span style={{ fontWeight: 600 }}>{order?.payment_method || 'Cash on Delivery'}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>Estimated Delivery:</span>
            <strong style={{ color: '#38bdf8' }}>{formattedDelivery}</strong>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to="/orders" className="hero__btn--primary">
            View My Orders
          </Link>
          <Link to="/products" className="hero__btn--ghost">
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
};

export default OrderSuccessPage;
