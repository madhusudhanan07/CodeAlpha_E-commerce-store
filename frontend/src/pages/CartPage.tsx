/**
 * CartPage.tsx — Shopping Cart View
 *
 * Displays items in the user's cart, enables real-time quantity adjustments,
 * item removal, and displays a comprehensive order summary breakdown.
 */

import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import '../styles/pages.css';

const CartPageSkeleton: React.FC = () => (
  <main className="cart-page container" aria-busy="true" aria-label="Loading shopping cart">
    <div className="skeleton-line skeleton-line--lg" style={{ width: '220px', height: '32px', marginBottom: '0.5rem' }} />
    <div className="skeleton-line skeleton-line--sm" style={{ width: '160px', marginBottom: '2rem' }} />

    <div className="cart-layout">
      <div className="cart-items skeleton" style={{ minHeight: '300px', borderRadius: 'var(--radius-xl)' }} />
      <div className="cart-summary skeleton" style={{ minHeight: '300px', borderRadius: 'var(--radius-xl)' }} />
    </div>
  </main>
);

const CartPage: React.FC = () => {
  const { cart, count, total_price, loading, error, updateQuantity, removeFromCart, clearCart, fetchCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleUpdate = async (id: number, qty: number) => {
    try {
      await updateQuantity(id, qty);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update quantity');
    }
  };

  const handleRemove = async (id: number) => {
    try {
      await removeFromCart(id);
      toast.success('Item removed from cart');
    } catch (err: any) {
      toast.error(err.message || 'Failed to remove item');
    }
  };

  const handleClear = async () => {
    try {
      await clearCart();
      toast.success('Cart cleared');
    } catch (err: any) {
      toast.error(err.message || 'Failed to clear cart');
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="container page-content">
        <div className="empty-state">
          <span className="empty-state__icon">🔒</span>
          <h1 className="empty-state__title">Please Sign In</h1>
          <p className="empty-state__desc">You need to sign in to view and manage your shopping cart.</p>
          <Link to="/login" className="hero__btn--primary" style={{ marginTop: '1rem', display: 'inline-block' }}>
            Sign In Now
          </Link>
        </div>
      </main>
    );
  }

  if (loading) {
    return <CartPageSkeleton />;
  }

  if (error) {
    return (
      <main className="container page-content">
        <div className="empty-state">
          <span className="empty-state__icon">⚠️</span>
          <h1 className="empty-state__title">Failed to load cart</h1>
          <p className="empty-state__desc">{error}</p>
          <button className="hero__btn--primary" style={{ marginTop: '1rem' }} onClick={fetchCart}>
            Try Again
          </button>
        </div>
      </main>
    );
  }

  if (!cart || cart.length === 0) {
    return (
      <main className="container page-content">
        <div className="empty-state">
          <span className="empty-state__icon" aria-hidden="true">🛒</span>
          <h1 className="empty-state__title">Your cart is empty</h1>
          <p className="empty-state__desc">Looks like you haven't added any products to your cart yet.</p>
          <Link to="/products" className="hero__btn--primary" style={{ marginTop: '1.5rem', display: 'inline-block' }}>
            Browse Catalogue
          </Link>
        </div>
      </main>
    );
  }

  const tax = Number((total_price * 0.08).toFixed(2));
  const grandTotal = Number((total_price + tax).toFixed(2));

  return (
    <main className="cart-page container">
      <header className="page-header">
        <h1 className="page-title">Shopping Cart</h1>
        <p className="page-subtitle">
          You have <strong>{count}</strong> {count === 1 ? 'item' : 'items'} in your cart.
        </p>
      </header>

      <div className="cart-layout">
        {/* Cart Items List */}
        <div className="cart-items">
          <div className="cart-items__header">
            <span>Product</span>
            <span>Quantity</span>
            <span>Subtotal</span>
          </div>

          {cart.map((item) => {
            const isAtMaxStock = item.quantity >= item.product_stock;
            return (
              <div key={item.product_id} className="cart-item">
                <div className="cart-item__product">
                  <img
                    src={item.product_image || 'https://placehold.co/100x100/1a1a24/6c63ff?text=No+Img'}
                    alt={item.product_name}
                    className="cart-item__image"
                  />
                  <div className="cart-item__info">
                    <Link to={`/products/${item.product_id}`} className="cart-item__name">
                      {item.product_name}
                    </Link>
                    <span className="cart-item__category">{item.product_category || 'General'}</span>
                    <span className="cart-item__price">${Number(item.product_price).toFixed(2)}</span>
                  </div>
                </div>

                <div className="cart-item__quantity">
                  <div className="qty-controls" role="group" aria-label={`Quantity for ${item.product_name}`}>
                    <button
                      type="button"
                      title="Decrease quantity"
                      onClick={() => handleUpdate(item.product_id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="qty-value" aria-live="polite">{item.quantity}</span>
                    <button
                      type="button"
                      title={isAtMaxStock ? 'Max stock reached' : 'Increase quantity'}
                      onClick={() => handleUpdate(item.product_id, item.quantity + 1)}
                      disabled={isAtMaxStock}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    className="cart-item__remove"
                    onClick={() => handleRemove(item.product_id)}
                  >
                    Remove
                  </button>
                </div>

                <div className="cart-item__total">
                  ${Number(item.subtotal).toFixed(2)}
                </div>
              </div>
            );
          })}

          <div style={{ padding: '1rem 0.5rem 0', display: 'flex', justifyContent: 'flex-end' }}>
            <button className="cart__clear-btn" onClick={handleClear}>
              Clear Entire Cart
            </button>
          </div>
        </div>

        {/* Cart Summary Panel */}
        <aside className="cart-summary">
          <h2 className="cart-summary__title">Order Summary</h2>
          
          <div className="cart-summary__row">
            <span>Total Items</span>
            <span>{count}</span>
          </div>

          <div className="cart-summary__row">
            <span>Subtotal</span>
            <span>${Number(total_price).toFixed(2)}</span>
          </div>

          <div className="cart-summary__row">
            <span>Estimated Tax (8%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>

          <hr />

          <div className="cart-summary__row cart-summary__total">
            <span>Grand Total</span>
            <span>${grandTotal.toFixed(2)}</span>
          </div>

          <button
            className="hero__btn--primary"
            style={{ width: '100%', marginTop: '1.5rem', textAlign: 'center' }}
            onClick={() => navigate('/checkout')}
          >
            Proceed to Checkout
          </button>

          <Link to="/products" className="cart-summary__continue">
            ← Continue Shopping
          </Link>
        </aside>
      </div>
    </main>
  );
};

export default CartPage;
