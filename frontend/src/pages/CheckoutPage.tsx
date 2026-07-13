/**
 * CheckoutPage.tsx — Placeholder Checkout Page
 * Will render the order summary, shipping form, and payment UI in Phase 2.
 */

import '../styles/pages.css';

const CheckoutPage: React.FC = () => {
  return (
    <section className="page" aria-label="Checkout page">
      <p className="page__badge">Checkout</p>
      <h1 className="page__title">Secure Checkout</h1>
      <p className="page__subtitle">
        Shipping address, payment details, and order confirmation
        will be implemented in the checkout feature phase.
      </p>
    </section>
  );
};

export default CheckoutPage;
