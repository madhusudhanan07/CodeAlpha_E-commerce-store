/**
 * CartPage.tsx — Shopping Cart View
 *
 * Displays items in the cart, allows quantity updates and removal.
 * Shows summary and checkout action.
 */

import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import '../styles/pages.css';

const CartPage: React.FC = () => {
  const { cart, count, total_price, loading, error, updateQuantity, removeFromCart, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <main className="container page-content">
        <div className="empty-state">
          <span className="empty-state__icon">🔒</span>
          <h1 className="empty-state__title">Please Sign In</h1>
          <p className="empty-state__desc">You need to sign in to view your cart.</p>
          <Link to="/login" className="hero__btn--primary" style={{ marginTop: '1rem' }}>
            Sign In
          </Link>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="container page-content">
        <p>Loading cart...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container page-content">
        <div className="empty-state">
          <span className="empty-state__icon">⚠️</span>
          <h1 className="empty-state__title">Failed to load cart</h1>
          <p className="empty-state__desc">{error}</p>
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
          <p className="empty-state__desc">Looks like you haven't added anything yet.</p>
          <Link to="/products" className="hero__btn--primary" style={{ marginTop: '1.5rem', display: 'inline-block' }}>
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="cart-page container">
      <header className="page-header">
        <h1 className="page-title">Shopping Cart</h1>
        <p className="page-subtitle">You have {count} items in your cart.</p>
      </header>

      <div className="cart-layout">
        {/* Cart Items List */}
        <div className="cart-items">
          <div className="cart-items__header">
            <span>Product</span>
            <span>Quantity</span>
            <span>Total</span>
          </div>

          {cart.map((item) => (
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
                  <span className="cart-item__category">{item.product_category || 'Category'}</span>
                  <span className="cart-item__price">${Number(item.product_price).toFixed(2)}</span>
                </div>
              </div>

              <div className="cart-item__quantity">
                <div className="qty-controls">
                  <button
                    type="button"
                    title="Decrease quantity"
                    onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    −
                  </button>
                  <span className="qty-value">{item.quantity}</span>
                  <button
                    type="button"
                    title="Increase quantity"
                    onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                    disabled={item.quantity >= item.product_stock}
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  className="cart-item__remove"
                  onClick={() => removeFromCart(item.product_id)}
                >
                  Remove
                </button>
              </div>

              <div className="cart-item__total">
                ${Number(item.subtotal).toFixed(2)}
              </div>
            </div>
          ))}

          <div style={{ marginTop: '1rem' }}>
             <button className="cart__clear-btn" onClick={clearCart}>
               Clear Cart
             </button>
          </div>
        </div>

        {/* Cart Summary Panel */}
        <aside className="cart-summary">
          <h2 className="cart-summary__title">Order Summary</h2>
          <div className="cart-summary__row">
            <span>Items ({count})</span>
            <span>${Number(total_price).toFixed(2)}</span>
          </div>
          <div className="cart-summary__row">
            <span>Shipping</span>
            <span>Calculated at checkout</span>
          </div>
          <hr />
          <div className="cart-summary__row cart-summary__total">
            <span>Subtotal</span>
            <span>${Number(total_price).toFixed(2)}</span>
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
