/**
 * CheckoutPage.tsx — Complete Checkout Experience
 *
 * Displays:
 *  - Shipping address form (full name, mobile, address, city, state, ZIP)
 *  - Payment method selector (COD, UPI, Credit/Debit Card)
 *  - Order summary sidebar with product list, totals, and delivery charge
 *  - Place Order button with loading state
 *
 * On successful order placement, redirects to /order-success with order data.
 */

import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { placeOrder } from '../services/orderService';
import type { ShippingAddress, PaymentMethod } from '../types';
import '../styles/checkout.css';

interface FormErrors {
  full_name?: string;
  mobile?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
}

const PAYMENT_METHODS: { id: PaymentMethod; icon: string; name: string; desc: string }[] = [
  { id: 'Cash on Delivery', icon: '💵', name: 'Cash on Delivery',  desc: 'Pay when you receive your order' },
  { id: 'UPI',              icon: '📱', name: 'UPI',               desc: 'Pay instantly via UPI apps' },
  { id: 'Credit/Debit Card',icon: '💳', name: 'Credit/Debit Card', desc: 'Demo mode — no real charges' },
];

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, count, total_price, loading: cartLoading, fetchCart } = useCart();
  const { isAuthenticated } = useAuth();

  // ── Form State ──────────────────────────────────────────────────────────────
  const [address, setAddress] = useState<ShippingAddress>({
    full_name: '',
    mobile: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash on Delivery');
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [stockErrors, setStockErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // ── Derived totals ────────────────────────────────────────────────────────
  const subtotal = Number(total_price);
  const deliveryCharge = subtotal >= 500 ? 0 : 40;
  const grandTotal = subtotal + deliveryCharge;

  // ── Validation ────────────────────────────────────────────────────────────
  const validate = (): boolean => {
    const e: FormErrors = {};

    if (!address.full_name.trim()) e.full_name = 'Full name is required';
    if (!address.mobile.trim()) {
      e.mobile = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(address.mobile.trim())) {
      e.mobile = 'Enter a valid 10-digit mobile number';
    }
    if (!address.address.trim()) e.address = 'Address is required';
    if (!address.city.trim()) e.city = 'City is required';
    if (!address.state.trim()) e.state = 'State is required';
    if (!address.zip_code.trim()) {
      e.zip_code = 'ZIP code is required';
    } else if (!/^\d{5,6}$/.test(address.zip_code.trim())) {
      e.zip_code = 'Enter a valid ZIP code';
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Input handler ─────────────────────────────────────────────────────────
  const handleInputChange = (field: keyof ShippingAddress, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
    // Clear field error on change
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handlePlaceOrder = async (e: FormEvent) => {
    e.preventDefault();
    setApiError(null);
    setStockErrors([]);

    if (!validate()) return;

    setSubmitting(true);
    try {
      const orderConfirmation = await placeOrder({
        shipping_address: {
          full_name: address.full_name.trim(),
          mobile: address.mobile.trim(),
          address: address.address.trim(),
          city: address.city.trim(),
          state: address.state.trim(),
          zip_code: address.zip_code.trim(),
        },
        payment_method: paymentMethod,
      });

      // Refresh cart (will be empty now)
      await fetchCart();

      // Redirect to success page with order data
      navigate('/order-success', {
        state: { order: orderConfirmation },
        replace: true,
      });
    } catch (err: any) {
      // Check if it's a stock error with a list
      const errorMessage = err.message || 'Something went wrong. Please try again.';

      // If the error response contains stock-level detail
      if (err.response?.data?.errors) {
        setStockErrors(err.response.data.errors);
      }
      setApiError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Guards ────────────────────────────────────────────────────────────────

  if (!isAuthenticated) {
    return (
      <main className="container page-content">
        <div className="empty-state">
          <span className="empty-state__icon">🔒</span>
          <h1 className="empty-state__title">Please Sign In</h1>
          <p className="empty-state__desc">You need to sign in to proceed with checkout.</p>
          <Link to="/login" className="order-success__btn order-success__btn--primary" style={{ marginTop: '1.5rem' }}>
            Sign In
          </Link>
        </div>
      </main>
    );
  }

  if (cartLoading) {
    return (
      <div className="checkout-loading">
        <span className="checkout-loading__spinner" />
        <p>Loading checkout...</p>
      </div>
    );
  }

  if (!cart || cart.length === 0) {
    return (
      <main className="container page-content">
        <div className="empty-state">
          <span className="empty-state__icon">🛒</span>
          <h1 className="empty-state__title">Your cart is empty</h1>
          <p className="empty-state__desc">Add items to your cart before checking out.</p>
          <Link to="/products" className="order-success__btn order-success__btn--primary" style={{ marginTop: '1.5rem' }}>
            Browse Products
          </Link>
        </div>
      </main>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <main className="checkout-page container">
      <header className="page-header">
        <h1 className="page-title">Checkout</h1>
        <p className="page-subtitle">Complete your order details below.</p>
      </header>

      <form onSubmit={handlePlaceOrder} className="checkout-layout" noValidate>
        {/* ── Left Column: Shipping + Payment ──────────────────── */}
        <div>
          {/* Error Banners */}
          {apiError && (
            <div className="checkout-error-banner" role="alert" style={{ marginBottom: 'var(--space-4)' }}>
              <span className="checkout-error-banner__title">
                ⚠️ {apiError}
              </span>
              {stockErrors.length > 0 && (
                <ul className="checkout-error-banner__list">
                  {stockErrors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Shipping Address */}
          <section className="checkout-section">
            <h2 className="checkout-section__title">
              <span className="checkout-section__title-icon">📦</span>
              Shipping Address
            </h2>
            <div className="checkout-form">
              {/* Full Name */}
              <div className="checkout-form__field">
                <label htmlFor="checkout-fullname" className="checkout-form__label">Full Name</label>
                <input
                  id="checkout-fullname"
                  type="text"
                  className={`checkout-form__input${errors.full_name ? ' checkout-form__input--error' : ''}`}
                  placeholder="John Doe"
                  value={address.full_name}
                  onChange={(e) => handleInputChange('full_name', e.target.value)}
                  autoComplete="name"
                />
                {errors.full_name && <span className="checkout-form__error">{errors.full_name}</span>}
              </div>

              {/* Mobile Number */}
              <div className="checkout-form__field">
                <label htmlFor="checkout-mobile" className="checkout-form__label">Mobile Number</label>
                <input
                  id="checkout-mobile"
                  type="tel"
                  className={`checkout-form__input${errors.mobile ? ' checkout-form__input--error' : ''}`}
                  placeholder="9876543210"
                  value={address.mobile}
                  onChange={(e) => handleInputChange('mobile', e.target.value)}
                  maxLength={10}
                  autoComplete="tel"
                />
                {errors.mobile && <span className="checkout-form__error">{errors.mobile}</span>}
              </div>

              {/* Address */}
              <div className="checkout-form__field checkout-form__field--full">
                <label htmlFor="checkout-address" className="checkout-form__label">Address</label>
                <input
                  id="checkout-address"
                  type="text"
                  className={`checkout-form__input${errors.address ? ' checkout-form__input--error' : ''}`}
                  placeholder="123 Main Street, Apt 4B"
                  value={address.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  autoComplete="street-address"
                />
                {errors.address && <span className="checkout-form__error">{errors.address}</span>}
              </div>

              {/* City */}
              <div className="checkout-form__field">
                <label htmlFor="checkout-city" className="checkout-form__label">City</label>
                <input
                  id="checkout-city"
                  type="text"
                  className={`checkout-form__input${errors.city ? ' checkout-form__input--error' : ''}`}
                  placeholder="Mumbai"
                  value={address.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  autoComplete="address-level2"
                />
                {errors.city && <span className="checkout-form__error">{errors.city}</span>}
              </div>

              {/* State */}
              <div className="checkout-form__field">
                <label htmlFor="checkout-state" className="checkout-form__label">State</label>
                <input
                  id="checkout-state"
                  type="text"
                  className={`checkout-form__input${errors.state ? ' checkout-form__input--error' : ''}`}
                  placeholder="Maharashtra"
                  value={address.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  autoComplete="address-level1"
                />
                {errors.state && <span className="checkout-form__error">{errors.state}</span>}
              </div>

              {/* ZIP Code */}
              <div className="checkout-form__field">
                <label htmlFor="checkout-zip" className="checkout-form__label">ZIP Code</label>
                <input
                  id="checkout-zip"
                  type="text"
                  className={`checkout-form__input${errors.zip_code ? ' checkout-form__input--error' : ''}`}
                  placeholder="400001"
                  value={address.zip_code}
                  onChange={(e) => handleInputChange('zip_code', e.target.value)}
                  maxLength={6}
                  autoComplete="postal-code"
                />
                {errors.zip_code && <span className="checkout-form__error">{errors.zip_code}</span>}
              </div>
            </div>
          </section>

          {/* Payment Method */}
          <section className="checkout-section">
            <h2 className="checkout-section__title">
              <span className="checkout-section__title-icon">💳</span>
              Payment Method
            </h2>
            <div className="payment-methods">
              {PAYMENT_METHODS.map((method) => (
                <div
                  key={method.id}
                  className={`payment-method${paymentMethod === method.id ? ' payment-method--active' : ''}`}
                  onClick={() => setPaymentMethod(method.id)}
                  role="radio"
                  aria-checked={paymentMethod === method.id}
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setPaymentMethod(method.id); }}
                >
                  <div className="payment-method__radio">
                    <div className="payment-method__radio-dot" />
                  </div>
                  <span className="payment-method__icon">{method.icon}</span>
                  <div className="payment-method__info">
                    <div className="payment-method__name">{method.name}</div>
                    <div className="payment-method__desc">{method.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ── Right Column: Order Summary ──────────────────────── */}
        <aside className="checkout-summary">
          <h2 className="checkout-summary__title">Order Summary</h2>

          {/* Item list */}
          <div className="checkout-summary__items">
            {cart.map((item) => (
              <div key={item.product_id} className="checkout-summary-item">
                <img
                  src={item.product_image || 'https://placehold.co/48x48/1a1a24/6c63ff?text=No+Img'}
                  alt={item.product_name}
                  className="checkout-summary-item__image"
                />
                <div className="checkout-summary-item__info">
                  <div className="checkout-summary-item__name">{item.product_name}</div>
                  <div className="checkout-summary-item__qty">Qty: {item.quantity}</div>
                </div>
                <span className="checkout-summary-item__price">
                  ${Number(item.subtotal).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <hr />

          {/* Totals */}
          <div className="checkout-summary__row">
            <span>Items ({count})</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="checkout-summary__row">
            <span>Delivery</span>
            <span>
              {deliveryCharge === 0 ? (
                <span className="checkout-summary__free-delivery">FREE</span>
              ) : (
                `$${deliveryCharge.toFixed(2)}`
              )}
            </span>
          </div>
          {deliveryCharge > 0 && (
            <div className="checkout-summary__row" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-success)' }}>
              <span>💡 Free delivery on orders over $500</span>
            </div>
          )}

          <hr />

          <div className="checkout-summary__row checkout-summary__row--total">
            <span>Grand Total</span>
            <span>${grandTotal.toFixed(2)}</span>
          </div>

          {/* Place Order Button */}
          <button
            type="submit"
            className="checkout-btn"
            disabled={submitting}
            id="place-order-btn"
          >
            {submitting ? (
              <>
                <span className="checkout-btn__spinner" />
                Processing...
              </>
            ) : (
              <>🔒 Place Order — ${grandTotal.toFixed(2)}</>
            )}
          </button>

          <Link to="/cart" style={{ display: 'block', textAlign: 'center', marginTop: 'var(--space-3)', color: 'var(--color-primary-light)', fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>
            ← Back to Cart
          </Link>
        </aside>
      </form>
    </main>
  );
};

export default CheckoutPage;
