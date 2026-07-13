/**
 * Footer.tsx — Application Footer
 *
 * Four-column semantic footer with:
 *  - Brand blurb
 *  - Shop links
 *  - Account links
 *  - Support links
 *  - Copyright bar
 *
 * All links are placeholders — they will be wired to real routes
 * as features are implemented.
 */

import { Link } from 'react-router-dom';
import '../styles/Footer.css';

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo">
      <div className="container">

        {/* ── Four-column grid ───────────────────────────────── */}
        <div className="footer__grid">

          {/* Brand column */}
          <div className="footer__col">
            <p className="footer__brand-name">Code<span>Alpha</span></p>
            <p className="footer__tagline">
              A modern e-commerce experience built for speed, simplicity, and style.
            </p>
          </div>

          {/* Shop column */}
          <div className="footer__col">
            <h3 className="footer__col-title">Shop</h3>
            <ul className="footer__links" role="list">
              <li><Link to="/products" className="footer__link">All Products</Link></li>
              <li><Link to="/cart"     className="footer__link">Cart</Link></li>
              <li><Link to="/checkout" className="footer__link">Checkout</Link></li>
            </ul>
          </div>

          {/* Account column */}
          <div className="footer__col">
            <h3 className="footer__col-title">Account</h3>
            <ul className="footer__links" role="list">
              <li><Link to="/login"    className="footer__link">Sign In</Link></li>
              <li><Link to="/register" className="footer__link">Register</Link></li>
            </ul>
          </div>

          {/* Support column */}
          <div className="footer__col">
            <h3 className="footer__col-title">Support</h3>
            <ul className="footer__links" role="list">
              <li><Link to="/" className="footer__link">Help Center</Link></li>
              <li><Link to="/" className="footer__link">Contact Us</Link></li>
              <li><Link to="/" className="footer__link">Privacy Policy</Link></li>
            </ul>
          </div>

        </div>

        {/* ── Bottom bar ─────────────────────────────────────── */}
        <div className="footer__bottom">
          <p>&copy; {year} CodeAlpha. All rights reserved.</p>
          <p>Built with React &amp; Express</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
