/**
 * Navbar.tsx — Application Navigation Bar
 *
 * Sticky, glassmorphism header with:
 *  - Brand logo
 *  - Primary navigation links (using NavLink for active-state styling)
 *  - Auth-aware actions: shows Profile + Logout when signed in, Login + Register when not
 *  - Responsive mobile toggle (hamburger)
 */

import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import '../styles/Navbar.css';
import '../styles/auth.css';

const NAV_LINKS = [
  { label: 'Home',     to: '/' },
  { label: 'Products', to: '/products' },
  { label: 'Cart',     to: '/cart' },
];

const Navbar: React.FC = () => {
  const { isAuthenticated, currentUser, logout } = useAuth();
  const { count } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu  = () => setMenuOpen(false);

  const handleLogout = async () => {
    closeMenu();
    try {
      await logout();
      navigate('/', { replace: true });
    } catch {
      // Logout failure is non-critical — silently ignore
    }
  };

  // Display initials for avatar circle
  const initials = currentUser?.displayName
    ? currentUser.displayName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : currentUser?.email?.[0]?.toUpperCase() ?? '?';

  return (
    <header className="navbar" role="banner">
      <nav className="navbar__inner container" aria-label="Main navigation">

        {/* ── Brand ─────────────────────────────────── */}
        <Link to="/" className="navbar__brand" onClick={closeMenu} aria-label="CodeAlpha Home">
          Code<span>Alpha</span>
        </Link>

        {/* ── Desktop / Mobile Nav Links ─────────────── */}
        <ul className={`navbar__nav${menuOpen ? ' open' : ''}`} role="list">
          {NAV_LINKS.map(({ label, to }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `navbar__link${isActive ? ' active' : ''}`
                }
                onClick={closeMenu}
              >
                {label} {label === 'Cart' && count > 0 && `(${count})`}
              </NavLink>
            </li>
          ))}

          {/* Mobile-only auth links (visible when menu open on small screen) */}
          {isAuthenticated && (
            <>
              <li className="navbar__mobile-auth">
                <NavLink
                  to="/orders"
                  className={({ isActive }) =>
                    `navbar__link${isActive ? ' active' : ''}`
                  }
                  onClick={closeMenu}
                >
                  My Orders
                </NavLink>
              </li>
              <li className="navbar__mobile-auth">
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    `navbar__link${isActive ? ' active' : ''}`
                  }
                  onClick={closeMenu}
                >
                  Profile
                </NavLink>
              </li>
            </>
          )}
        </ul>

        {/* ── Actions ───────────────────────────────── */}
        <div className="navbar__actions">
          {isAuthenticated ? (
            <>
              {/* Avatar + display name */}
              <NavLink
                to="/profile"
                className="navbar__avatar"
                onClick={closeMenu}
                aria-label="My profile"
              >
                <span className="navbar__avatar-circle" aria-hidden="true">
                  {initials}
                </span>
                <span className="navbar__avatar-name">
                  {currentUser?.displayName?.split(' ')[0] ?? 'Profile'}
                </span>
              </NavLink>

              {/* Logout */}
              <button
                id="navbar-logout"
                className="navbar__logout-btn"
                onClick={handleLogout}
                aria-label="Sign out"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="navbar__link"
                onClick={closeMenu}
                aria-label="Sign in"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="navbar__btn--primary"
                onClick={closeMenu}
                aria-label="Create account"
              >
                Register
              </Link>
            </>
          )}

          {/* ── Mobile Hamburger ──────────────────────── */}
          <button
            className="navbar__toggle"
            onClick={toggleMenu}
            aria-expanded={menuOpen}
            aria-controls="main-nav"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            <span />
            <span />
            <span />
          </button>
        </div>

      </nav>
    </header>
  );
};

export default Navbar;
