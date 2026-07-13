/**
 * CartPage.tsx — Placeholder Cart Page
 * Will display selected items, quantities, and total in Phase 2.
 */

import '../styles/pages.css';

const CartPage: React.FC = () => {
  return (
    <section className="page" aria-label="Shopping cart page">
      <p className="page__badge">Shopping Cart</p>
      <h1 className="page__title">Your Cart</h1>
      <p className="page__subtitle">
        Cart items, quantities, subtotals, and the checkout button
        will be implemented in the cart feature phase.
      </p>
    </section>
  );
};

export default CartPage;
