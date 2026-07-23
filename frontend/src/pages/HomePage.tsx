/**
 * HomePage.tsx — Ultra-Premium E-Commerce Platform Landing Page
 *
 * Inspired by Apple, Shopify, Nike, Stripe & Tesla:
 *  1. 45%/55% Desktop Hero Section with Ambient Gradient Blobs
 *  2. "Everything You Need, Delivered To Your Door" Headline
 *  3. Primary Shop Now Gradient Button & Secondary Glass Categories Button
 *  4. 4 Glassmorphism Trust Badges
 *  5. 3D Floating Shopping Product Composition
 *  6. 10 Product Categories Section with Product Counts
 *  7. "Why Shop With Us?" 6 Featured Services Section
 *  8. Today's Deals, Featured Products, Best Sellers, New Arrivals & Recommendations
 *  9. Popular Brands & Newsletter Subscription
 */

import { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { fetchFeatured, fetchProducts } from '../services/productService';
import ProductGrid from '../components/products/ProductGrid';
import ProductCard from '../components/products/ProductCard';
import type { Product } from '../types';
import { Flame, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import BestSellerSection from '../components/recommendations/BestSellerSection';
import TrendingSection from '../components/recommendations/TrendingSection';
import RecentlyViewed from '../components/recommendations/RecentlyViewed';
import FloatingShoppingComposition from '../components/home/FloatingShoppingComposition';
import TrustBadges from '../components/home/TrustBadges';
import CategoriesSection from '../components/home/CategoriesSection';
import WhyShopWithUs from '../components/home/WhyShopWithUs';
import '../styles/products.css';
import '../styles/hero.css';

// ── Popular Brands ───────────────────────────────────────────────────────────
const POPULAR_BRANDS = [
  'Apple', 'Samsung', 'Sony', 'Nike', 'Dell',
  'Canon', 'JBL', 'Adidas', 'Dyson', 'Keychron',
];

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [featured, setFeatured] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [featuredError, setFeaturedError] = useState<string | null>(null);
  const [emailInput, setEmailInput] = useState('');

  // ── Live Deals Countdown Timer ──────────────────────────────────────────────
  const [dealsTimeLeft, setDealsTimeLeft] = useState(() => {
    const now = new Date();
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    const diff = Math.max(0, Math.floor((endOfDay.getTime() - now.getTime()) / 1000));
    return diff > 0 ? diff : 31335;
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setDealsTimeLeft((prev) => (prev > 0 ? prev - 1 : 86400));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDealsTimer = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const pad = (num: number) => String(num).padStart(2, '0');
    return `${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
  };

  // ── Auto scroll if hash present ───────────────────────────────────────────
  useEffect(() => {
    if (location.hash) {
      const sectionId = location.hash.replace('#', '');
      const timer = setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          const headerOffset = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [location.hash, location.key]);

  const loadData = () => {
    setLoading(true);
    setFeaturedError(null);

    // Fetch featured products
    fetchFeatured()
      .then((res) => setFeatured(res.products))
      .catch((err: Error) => setFeaturedError(err.message || 'Failed to load featured products.'))
      .finally(() => setLoading(false));

    // Fetch all products for deals, bestsellers, and new arrivals
    fetchProducts()
      .then((res) => {
        setAllProducts(res.products);
      })
      .catch(console.error);
  };

  useEffect(() => {
    loadData();
  }, []);

  // ── Derived Product Groups ─────────────────────────────────────────────────
  const dealsProducts = useMemo(() => {
    return allProducts.slice(0, 4).map((p, idx) => ({
      ...p,
      discount: idx % 2 === 0 ? 20 : 15,
      oldPrice: (Number(p.price) * 1.25).toFixed(2),
    }));
  }, [allProducts]);

  const bestSellers = useMemo(() => {
    return allProducts.slice(4, 8);
  }, [allProducts]);

  const newArrivals = useMemo(() => {
    return allProducts.slice(8, 12);
  }, [allProducts]);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim() || !emailInput.includes('@')) {
      toast.error('Please enter a valid email address.');
      return;
    }
    toast.success('Thank you for subscribing! Check your inbox for your $20 welcome voucher.');
    setEmailInput('');
  };

  return (
    <>
      {/* ══════════════════════════════════════════════
          1. APPLE & SHOPIFY-GRADE HERO SECTION
      ══════════════════════════════════════════════ */}
      <section className="hero-redesign-light" aria-label="Hero banner">
        <div className="container">
          <div className="hero-grid-light">
            {/* ── LEFT CONTENT ────────────────────────────────────────── */}
            <div className="hero-left-light">
              <div className="hero-quality-badge">
                <span className="badge-star-icon">★</span>
                <span>Best Quality Products</span>
              </div>

              <h1 className="hero-title-light">
                Your Favorite
                <br />
                Products,
                <br />
                <span className="hero-title-gradient">Delivered</span> to You.
              </h1>

              <p className="hero-subtitle-light">
                Discover top quality products, special offers and everything you need in one place.
              </p>

              {/* Action Buttons */}
              <div className="hero-cta-group">
                <Link to="/products" className="btn-hero-primary">
                  Shop Now →
                </Link>

                <button
                  type="button"
                  className="btn-hero-secondary"
                  onClick={() => {
                    const el = document.getElementById('categories-heading');
                    if (el) {
                      const headerOffset = 80;
                      const elementPosition = el.getBoundingClientRect().top;
                      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                    }
                  }}
                >
                  Explore Categories
                </button>
              </div>

              {/* 4 Light-Theme Horizontal Trust Badges */}
              <TrustBadges />
            </div>

            {/* ── RIGHT CONTENT: 3D Shopping Cart & Bags Composition ───── */}
            <FloatingShoppingComposition />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          2. 10 TOP CATEGORIES SECTION
      ══════════════════════════════════════════════ */}
      <CategoriesSection />

      {/* ══════════════════════════════════════════════
          3. FEATURED SERVICES ("WHY SHOP WITH US?")
      ══════════════════════════════════════════════ */}
      <WhyShopWithUs />

      {/* ══════════════════════════════════════════════
          4. TODAY'S DEALS SECTION
      ══════════════════════════════════════════════ */}
      {dealsProducts.length > 0 && (
        <section id="todays-deals" className="section" aria-labelledby="deals-title" style={{ background: 'var(--color-surface-2, #12121c)', padding: '3.5rem 0' }}>
          <div className="container">
            <div className="section__header">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Flame className="w-6 h-6 text-red-500" />
                  <h2 id="deals-title" className="section__title" style={{ margin: 0 }}>
                    Today's Hot Deals
                  </h2>
                </div>
                <p className="section__subtitle">Limited-time flash discounts on high-demand items</p>
                <div className="deals-header-timer">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Ends in: {formatDealsTimer(dealsTimeLeft)}</span>
                </div>
              </div>
              <Link to="/products" className="section__link">
                View all deals →
              </Link>
            </div>

            <div className="product-grid">
              {dealsProducts.map((product) => (
                <div key={product.id} style={{ position: 'relative' }}>
                  <span className="deal-card__badge">{product.discount}% OFF</span>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════
          5. FEATURED PRODUCTS SECTION
      ══════════════════════════════════════════════ */}
      <section className="section" aria-labelledby="featured-title">
        <div className="container">
          <div className="section__header">
            <div>
              <h2 id="featured-title" className="section__title">Featured Products</h2>
              <p className="section__subtitle">Hand-picked favourites selected for top performance</p>
            </div>
            <Link to="/products?featured=1" className="section__link">
              View all
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                strokeLinejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>

          {featuredError ? (
            <div className="empty-state">
              <span className="empty-state__icon">⚠️</span>
              <p className="empty-state__title">Failed to load featured products</p>
              <p className="empty-state__desc">{featuredError}</p>
              <button 
                className="product-card__btn" 
                style={{ marginTop: '1rem' }} 
                onClick={loadData}
              >
                Retry
              </button>
            </div>
          ) : (
            <ProductGrid
              products={featured}
              loading={loading}
              skeletonCount={4}
              emptyTitle="No featured products yet"
              emptyDesc="Check back soon for our handpicked selections."
            />
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          6. BEST SELLERS
      ══════════════════════════════════════════════ */}
      {bestSellers.length > 0 && (
        <section className="section" aria-labelledby="bestsellers-title" style={{ paddingTop: 0 }}>
          <div className="container">
            <div className="section__header">
              <div>
                <h2 id="bestsellers-title" className="section__title">Best Sellers</h2>
                <p className="section__subtitle">Most popular products loved by thousands of customers</p>
              </div>
              <Link to="/products" className="section__link">
                View all →
              </Link>
            </div>

            <ProductGrid
              products={bestSellers}
              loading={loading}
              skeletonCount={4}
            />
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════
          7. NEW ARRIVALS
      ══════════════════════════════════════════════ */}
      {newArrivals.length > 0 && (
        <section className="section" aria-labelledby="newarrivals-title" style={{ paddingTop: 0 }}>
          <div className="container">
            <div className="section__header">
              <div>
                <h2 id="newarrivals-title" className="section__title">New Arrivals</h2>
                <p className="section__subtitle">Fresh additions added to our store this week</p>
              </div>
              <Link to="/products" className="section__link">
                Explore all →
              </Link>
            </div>

            <ProductGrid
              products={newArrivals}
              loading={loading}
              skeletonCount={4}
            />
          </div>
        </section>
      )}

      {/* Dynamic Recommendation Sections */}
      <BestSellerSection />
      <TrendingSection />
      <RecentlyViewed />

      {/* ══════════════════════════════════════════════
          8. POPULAR BRANDS
      ══════════════════════════════════════════════ */}
      <section className="section" aria-labelledby="brands-title" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section__header">
            <div>
              <h2 id="brands-title" className="section__title">Popular Brands</h2>
              <p className="section__subtitle">Top global manufacturers and official brand partners</p>
            </div>
          </div>

          <div className="brands-grid">
            {POPULAR_BRANDS.map((brand, idx) => (
              <button
                key={idx}
                type="button"
                className="brand-pill"
                onClick={() => navigate(`/products?search=${brand}`)}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          9. NEWSLETTER SUBSCRIPTION
      ══════════════════════════════════════════════ */}
      <section className="section container">
        <div className="newsletter-card">
          <h2 className="newsletter-card__title">Stay Ahead of the Trends</h2>
          <p className="newsletter-card__desc">
            Subscribe to receive exclusive deals, secret coupons, and new launch updates directly in your inbox.
          </p>

          <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
            <input
              type="email"
              placeholder="Enter your email address…"
              className="newsletter-input"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              required
            />
            <button type="submit" className="newsletter-btn">
              Subscribe Now
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default HomePage;
