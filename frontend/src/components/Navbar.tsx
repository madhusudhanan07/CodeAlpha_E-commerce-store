/**
 * Navbar.tsx — Modern Translucent Apple/Shopify Glass Header
 *
 * Sticky white translucent header with:
 *  - Brand logo (Fresh Party / CodeAlpha)
 *  - Search bar input with search icon
 *  - Navigation links (Home, Shop, Categories, Deals, Wishlist, Cart)
 *  - Lucide React SVG icon badges (Heart wishlist badge, Bag cart badge, Profile, Notifications)
 */

import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Search, Heart, ShoppingBag, LogOut, Shield } from 'lucide-react';
import '../styles/Navbar.css';

export const Navbar: React.FC = () => {
  const { isAuthenticated, currentUser, logout, isAdmin } = useAuth();
  const { count: cartCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu  = () => setMenuOpen(false);

  const handleNavSectionClick = (sectionId: string) => {
    closeMenu();
    if (window.location.pathname === '/') {
      const el = document.getElementById(sectionId);
      if (el) {
        const headerOffset = 80;
        const elementPosition = el.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    } else {
      navigate(`/#${sectionId}`);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

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
    : currentUser?.email?.[0]?.toUpperCase() ?? 'U';

  return (
    <header className="navbar-modern" role="banner">
      <div className="navbar-container container">

        {/* ── Brand Logo ─────────────────────────────────── */}
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <div className="logo-icon-box">
            <ShoppingBag className="w-5 h-5 text-white" />
          </div>
          <span className="logo-text">
            NEWONE<span className="logo-text-accent"> SHOP</span>
          </span>
        </Link>

        {/* ── Center Rounded Search Bar ───────────────────── */}
        <form className="navbar-search-form" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            className="navbar-search-input"
            placeholder="Search for products, categories or brands…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="navbar-search-btn" aria-label="Search">
            <Search className="w-4 h-4 text-gray-500" />
          </button>
        </form>

        {/* ── Nav Links ──────────────────────────────────── */}
        <nav className={`navbar-nav-menu${menuOpen ? ' open' : ''}`}>
          <NavLink to="/" end className={({ isActive }) => `nav-item-link${isActive ? ' active' : ''}`} onClick={closeMenu}>
            Home
          </NavLink>
          <NavLink to="/products" className={({ isActive }) => `nav-item-link${isActive ? ' active' : ''}`} onClick={closeMenu}>
            Shop
          </NavLink>
          <button type="button" className="nav-item-link" onClick={() => handleNavSectionClick('categories-heading')}>
            Categories
          </button>
          <button type="button" className="nav-item-link" onClick={() => handleNavSectionClick('todays-deals')}>
            Deals
          </button>
          <NavLink to="/orders" className={({ isActive }) => `nav-item-link${isActive ? ' active' : ''}`} onClick={closeMenu}>
            Orders
          </NavLink>
          {isAdmin && (
            <NavLink to="/admin" className={({ isActive }) => `nav-item-link${isActive ? ' active' : ''}`} style={{ color: '#2563eb', fontWeight: 800 }} onClick={closeMenu}>
              <Shield className="w-3.5 h-3.5 inline mr-1" /> Admin Panel
            </NavLink>
          )}
        </nav>

        {/* ── Right Action Icons ──────────────────────────── */}
        <div className="navbar-action-icons">
          {/* Wishlist Button */}
          <Link to="/wishlist" className="icon-badge-btn" aria-label="Wishlist" onClick={closeMenu}>
            <Heart className="w-5 h-5 text-gray-700 hover:text-red-500 transition-colors" />
            {wishlistCount > 0 && (
              <span className="badge-count badge-count-pink">{wishlistCount}</span>
            )}
          </Link>

          {/* Cart Button */}
          <Link to="/cart" className="icon-badge-btn" aria-label="Cart" onClick={closeMenu}>
            <ShoppingBag className="w-5 h-5 text-gray-700 hover:text-blue-600 transition-colors" />
            {cartCount > 0 && (
              <span className="badge-count badge-count-blue">{cartCount}</span>
            )}
          </Link>

          {/* Profile / Auth */}
          {isAuthenticated ? (
            <div className="user-profile-menu">
              {isAdmin && (
                <Link to="/admin" className="btn-signin-pill" style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)', padding: '0.4rem 0.85rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }} onClick={closeMenu}>
                  <Shield className="w-3.5 h-3.5 text-white" />
                  Admin
                </Link>
              )}
              <Link to="/profile" className="user-avatar-pill" onClick={closeMenu}>
                <span className="avatar-initials">{initials}</span>
                <span className="user-name-text">
                  {currentUser?.displayName?.split(' ')[0] ?? 'Account'}
                </span>
              </Link>

              <button className="logout-icon-btn" onClick={handleLogout} title="Logout">
                <LogOut className="w-4 h-4 text-gray-600 hover:text-red-600" />
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-signin-pill" onClick={closeMenu}>
              Sign In
            </Link>
          )}

          {/* Mobile Hamburger Toggle */}
          <button className="mobile-menu-toggle" onClick={toggleMenu} aria-label="Toggle navigation">
            <span />
            <span />
            <span />
          </button>
        </div>

      </div>
    </header>
  );
};

export default Navbar;
