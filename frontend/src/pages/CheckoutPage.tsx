/**
 * CheckoutPage.tsx — Premium Checkout Workflow
 *
 * Steps:
 *  1. Shipping Address form with field validations
 *  2. Delivery Method Selection (Standard, Express, Store Pickup)
 *  3. Payment Method UI (COD, Credit/Debit Card, UPI, Wallet)
 *  4. Coupon Code Application
 *  5. Real-time Order Summary breakdown & Order Placement
 */

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../services/axiosInstance';
import toast from 'react-hot-toast';
import '../styles/pages.css';

interface ShippingForm {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { cart, count, total_price, clearCart } = useCart();

  const [form, setForm] = useState<ShippingForm>({
    firstName: currentUser?.displayName?.split(' ')[0] || '',
    lastName: currentUser?.displayName?.split(' ')[1] || '',
    phone: '',
    email: currentUser?.email || '',
    address: '',
    city: '',
    state: '',
    country: 'United States',
    zipCode: '',
  });

  const [deliveryMethod, setDeliveryMethod] = useState<'Standard Delivery' | 'Express Delivery' | 'Store Pickup'>('Standard Delivery');
  const [paymentMethod, setPaymentMethod] = useState<'Cash on Delivery' | 'Credit/Debit Card' | 'UPI' | 'Wallet'>('Cash on Delivery');

  // Payment UIs
  const [cardDetails, setCardDetails] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [upiId, setUpiId] = useState('');
  const [selectedWallet, setSelectedWallet] = useState('Paytm');

  // Coupon
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [placingOrder, setPlacingOrder] = useState(false);

  if (!cart || cart.length === 0) {
    return (
      <main className="container page-content">
        <div className="empty-state">
          <span className="empty-state__icon">🛒</span>
          <h1 className="empty-state__title">Your cart is empty</h1>
          <p className="empty-state__desc">Add products to your cart before proceeding to checkout.</p>
          <Link to="/products" className="hero__btn--primary" style={{ marginTop: '1.5rem', display: 'inline-block' }}>
            Browse Catalogue
          </Link>
        </div>
      </main>
    );
  }

  // ── Calculation logic ───────────────────────────────────────────────────────
  let shippingFee = 0;
  if (deliveryMethod === 'Express Delivery') {
    shippingFee = 15;
  } else if (deliveryMethod === 'Store Pickup') {
    shippingFee = 0;
  } else {
    shippingFee = total_price >= 50 ? 0 : 10;
  }

  const tax = Number((total_price * 0.08).toFixed(2));
  const discount = appliedCoupon === 'CODEALPHA20' ? Number((total_price * 0.20).toFixed(2)) : 0;
  const grandTotal = Number((total_price + shippingFee + tax - discount).toFixed(2));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponInput.trim().toUpperCase() === 'CODEALPHA20') {
      setAppliedCoupon('CODEALPHA20');
      toast.success('Coupon CODEALPHA20 applied! 20% discount unlocked.');
    } else {
      toast.error('Invalid coupon code. Try "CODEALPHA20".');
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validations
    if (!form.firstName || !form.lastName || !form.phone || !form.address || !form.city || !form.state || !form.zipCode) {
      toast.error('Please fill in all required shipping address fields.');
      return;
    }

    if (paymentMethod === 'Credit/Debit Card' && (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv)) {
      toast.error('Please complete your credit card details.');
      return;
    }

    if (paymentMethod === 'UPI' && !upiId.includes('@')) {
      toast.error('Please enter a valid UPI ID (e.g., user@upi).');
      return;
    }

    setPlacingOrder(true);

    try {
      const payload = {
        shipping_address: {
          full_name: `${form.firstName} ${form.lastName}`.trim(),
          mobile: form.phone,
          email: form.email,
          address: form.address,
          city: form.city,
          state: form.state,
          country: form.country,
          zip_code: form.zipCode,
        },
        payment_method: paymentMethod,
        delivery_method: deliveryMethod,
        coupon_code: appliedCoupon,
      };

      const res = await axiosInstance.post('/api/orders', payload);

      if (res.data && res.data.data && res.data.data.order) {
        toast.success('Order placed successfully!');
        await clearCart();
        navigate('/order-success', { state: { order: res.data.data.order } });
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Failed to place order.');
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <main className="cart-page container" style={{ paddingBottom: '4rem' }}>
      <header className="page-header">
        <h1 className="page-title">Checkout</h1>
        <p className="page-subtitle">Complete your shipping and payment information</p>
      </header>

      <form onSubmit={handlePlaceOrder} className="cart-layout">
        
        {/* ── LEFT: FORM STEPS ────────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* STEP 1: Shipping Address */}
          <section className="cart-summary" style={{ borderRadius: 'var(--radius-xl)' }}>
            <h2 className="cart-summary__title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>1️⃣</span> Shipping Address
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="auth-form__label">First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  className="search-bar__input"
                  value={form.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className="auth-form__label">Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  className="search-bar__input"
                  value={form.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
              <div>
                <label className="auth-form__label">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+1 (555) 000-0000"
                  className="search-bar__input"
                  value={form.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className="auth-form__label">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  className="search-bar__input"
                  value={form.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div style={{ marginTop: '1rem' }}>
              <label className="auth-form__label">Street Address *</label>
              <input
                type="text"
                name="address"
                placeholder="123 Shopping Avenue, Suite 400"
                className="search-bar__input"
                value={form.address}
                onChange={handleInputChange}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
              <div>
                <label className="auth-form__label">City *</label>
                <input
                  type="text"
                  name="city"
                  className="search-bar__input"
                  value={form.city}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className="auth-form__label">State *</label>
                <input
                  type="text"
                  name="state"
                  className="search-bar__input"
                  value={form.state}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className="auth-form__label">Zip Code *</label>
                <input
                  type="text"
                  name="zipCode"
                  className="search-bar__input"
                  value={form.zipCode}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </section>

          {/* STEP 2: Delivery Method */}
          <section className="cart-summary" style={{ borderRadius: 'var(--radius-xl)' }}>
            <h2 className="cart-summary__title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>2️⃣</span> Delivery Method
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
              {[
                { type: 'Standard Delivery', fee: '$10 (Free over $50)', desc: '3-5 Business Days' },
                { type: 'Express Delivery', fee: '$15.00', desc: '1-2 Business Days Priority' },
                { type: 'Store Pickup', fee: 'FREE', desc: 'Pick up at local partner hub' },
              ].map(({ type, fee, desc }) => (
                <label
                  key={type}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem',
                    borderRadius: 'var(--radius-lg)',
                    border: `1px solid ${deliveryMethod === type ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    background: deliveryMethod === type ? 'rgba(108, 99, 255, 0.1)' : 'var(--color-surface)',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <input
                      type="radio"
                      name="deliveryMethod"
                      checked={deliveryMethod === type}
                      onChange={() => setDeliveryMethod(type as any)}
                    />
                    <div>
                      <strong style={{ display: 'block', color: 'var(--color-text)' }}>{type}</strong>
                      <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{desc}</span>
                    </div>
                  </div>
                  <span style={{ fontWeight: 700, color: 'var(--color-primary-light)' }}>{fee}</span>
                </label>
              ))}
            </div>
          </section>

          {/* STEP 3: Payment Method */}
          <section className="cart-summary" style={{ borderRadius: 'var(--radius-xl)' }}>
            <h2 className="cart-summary__title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>3️⃣</span> Payment Method
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', marginTop: '1rem' }}>
              {['Cash on Delivery', 'Credit/Debit Card', 'UPI', 'Wallet'].map((pm) => (
                <button
                  type="button"
                  key={pm}
                  className={`product-filters__chip ${paymentMethod === pm ? 'product-filters__chip--active' : ''}`}
                  onClick={() => setPaymentMethod(pm as any)}
                  style={{ textAlign: 'center', padding: '0.75rem' }}
                >
                  {pm}
                </button>
              ))}
            </div>

            {/* Dynamic UI Panels */}
            {paymentMethod === 'Credit/Debit Card' && (
              <div style={{ marginTop: '1.25rem', padding: '1rem', background: 'var(--color-surface-2)', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ marginBottom: '0.75rem' }}>
                  <label className="auth-form__label">Card Number</label>
                  <input
                    type="text"
                    placeholder="4532 •••• •••• 8921"
                    className="search-bar__input"
                    value={cardDetails.number}
                    onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label className="auth-form__label">Name on Card</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="search-bar__input"
                      value={cardDetails.name}
                      onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="auth-form__label">Expiry</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="search-bar__input"
                      value={cardDetails.expiry}
                      onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="auth-form__label">CVV</label>
                    <input
                      type="password"
                      placeholder="•••"
                      className="search-bar__input"
                      value={cardDetails.cvv}
                      onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'UPI' && (
              <div style={{ marginTop: '1.25rem', padding: '1rem', background: 'var(--color-surface-2)', borderRadius: 'var(--radius-lg)' }}>
                <label className="auth-form__label">UPI ID / VPA</label>
                <input
                  type="text"
                  placeholder="username@upi"
                  className="search-bar__input"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                />
              </div>
            )}

            {paymentMethod === 'Wallet' && (
              <div style={{ marginTop: '1.25rem', padding: '1rem', background: 'var(--color-surface-2)', borderRadius: 'var(--radius-lg)', display: 'flex', gap: '0.75rem' }}>
                {['Paytm', 'PhonePe', 'PayPal', 'Amazon Pay'].map((w) => (
                  <button
                    type="button"
                    key={w}
                    className={`product-filters__chip ${selectedWallet === w ? 'product-filters__chip--active' : ''}`}
                    onClick={() => setSelectedWallet(w)}
                  >
                    {w}
                  </button>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* ── RIGHT: ORDER SUMMARY & PLACE ORDER ───────────────────────────── */}
        <aside className="cart-summary">
          <h2 className="cart-summary__title">Order Summary ({count} items)</h2>

          {/* Cart items list preview */}
          <div style={{ maxHeight: '240px', overflowY: 'auto', marginBottom: '1rem', paddingRight: '4px' }}>
            {cart.map((item) => (
              <div key={item.product_id} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'center' }}>
                <img
                  src={item.product_image || 'https://placehold.co/60x60/1a1a24/6c63ff?text=Product'}
                  alt={item.product_name}
                  style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px' }}
                />
                <div style={{ flex: 1, fontSize: '0.85rem' }}>
                  <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>{item.product_name}</div>
                  <div style={{ color: 'var(--color-text-muted)' }}>Qty: {item.quantity} × ${Number(item.product_price).toFixed(2)}</div>
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>${Number(item.subtotal).toFixed(2)}</div>
              </div>
            ))}
          </div>

          <hr />

          {/* Coupon Code Entry */}
          <div style={{ margin: '1rem 0' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                placeholder="Promo code (CODEALPHA20)"
                className="search-bar__input"
                style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
              />
              <button
                type="button"
                className="product-filters__chip product-filters__chip--active"
                onClick={handleApplyCoupon}
              >
                Apply
              </button>
            </div>
            {appliedCoupon && (
              <div style={{ color: 'var(--color-success)', fontSize: '0.8rem', marginTop: '0.4rem', fontWeight: 600 }}>
                ✓ Coupon CODEALPHA20 applied (20% OFF)
              </div>
            )}
          </div>

          <hr />

          <div className="cart-summary__row">
            <span>Subtotal</span>
            <span>${Number(total_price).toFixed(2)}</span>
          </div>

          <div className="cart-summary__row">
            <span>Shipping</span>
            <span>{shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}</span>
          </div>

          <div className="cart-summary__row">
            <span>Estimated Tax (8%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>

          {discount > 0 && (
            <div className="cart-summary__row" style={{ color: 'var(--color-success)' }}>
              <span>Coupon Discount</span>
              <span>−${discount.toFixed(2)}</span>
            </div>
          )}

          <hr />

          <div className="cart-summary__row cart-summary__total">
            <span>Grand Total</span>
            <span>${grandTotal.toFixed(2)}</span>
          </div>

          <button
            type="submit"
            className="hero__btn--primary"
            disabled={placingOrder}
            style={{ width: '100%', marginTop: '1.5rem', textAlign: 'center' }}
          >
            {placingOrder ? 'Processing Order…' : 'Place Order Now'}
          </button>
        </aside>
      </form>
    </main>
  );
};

export default CheckoutPage;
