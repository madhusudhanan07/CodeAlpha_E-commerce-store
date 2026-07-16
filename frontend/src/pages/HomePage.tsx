/**
 * HomePage.tsx — Landing Page
 *
 * Sections:
 *  1. Hero — headline, sub-copy, CTA buttons, mini product showcase
 *  2. Featured Products — horizontal scrollable strip (is_featured = 1)
 *  3. Category Cards — quick-navigate to each category
 */

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchFeatured, fetchProducts } from '../services/productService';
import ProductGrid from '../components/products/ProductGrid';
import type { Product } from '../types';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import '../styles/products.css';

const CATEGORIES = [
  { slug: 'electronics',          name: 'Electronics',            icon: '💻', color: 'rgba(108,99,255,0.10)', border: 'rgba(108,99,255,0.35)' },
  { slug: 'fashion',              name: 'Fashion',                 icon: '👗', color: 'rgba(245,158,11,0.10)', border: 'rgba(245,158,11,0.35)' },
  { slug: 'books',                name: 'Books',                   icon: '📚', color: 'rgba(34,197,94,0.10)',  border: 'rgba(34,197,94,0.35)'  },
  { slug: 'home-kitchen',         name: 'Home & Kitchen',          icon: '🏠', color: 'rgba(239,68,68,0.10)',  border: 'rgba(239,68,68,0.35)'  },
  { slug: 'sports-fitness',       name: 'Sports & Fitness',        icon: '⚡', color: 'rgba(165,180,252,0.10)', border: 'rgba(165,180,252,0.35)' },
  { slug: 'beauty-personal-care', name: 'Beauty & Personal Care',  icon: '✨', color: 'rgba(236,72,153,0.10)', border: 'rgba(236,72,153,0.35)' },
  { slug: 'bags-accessories',     name: 'Bags & Accessories',      icon: '👜', color: 'rgba(14,165,233,0.10)', border: 'rgba(14,165,233,0.35)' },
  { slug: 'gaming',               name: 'Gaming',                  icon: '🎮', color: 'rgba(74,222,128,0.10)', border: 'rgba(74,222,128,0.35)' },
];

// ── Hero showcase — 4 product images loaded from the API ─────────────────────
const SHOWCASE_SLUGS = [
  'apple-iphone-15-pro',
  'nike-air-max-270',
  'sony-wh-1000xm5',
  'apple-watch-series-9',
];

// ── Component ─────────────────────────────────────────────────────────────────
const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const [featured, setFeatured] = useState<Product[]>([]);
  const [showcase, setShowcase] = useState<Product[]>([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [loadingShowcase, setLoadingShowcase] = useState(true);

  const handleAddToCart = async (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Please sign in to add items to your cart.');
      navigate('/login');
      return;
    }
    try {
      await addToCart(product.id, 1);
      toast.success(`"${product.name}" added to cart!`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to add to cart.');
    }
  };

  useEffect(() => {
    // Fetch featured products
    setLoadingFeatured(true);
    fetchFeatured()
      .then((res) => setFeatured(res.products))
      .catch(console.error)
      .finally(() => setLoadingFeatured(false));

    // Fetch all products to pick showcase cards
    setLoadingShowcase(true);
    fetchProducts()
      .then((res) => {
        const picks = SHOWCASE_SLUGS.map(
          (slug) => res.products.find((p) => p.slug === slug),
        ).filter((p): p is Product => p !== undefined);
        setShowcase(picks.slice(0, 4));
      })
      .catch(console.error)
      .finally(() => setLoadingShowcase(false));
  }, []);

  return (
    <>
      {/* ══════════════════════════════════════════════
          1. HERO
      ══════════════════════════════════════════════ */}
      <section className="hero" aria-label="Hero banner">
        <div className="hero__bg" aria-hidden="true" />
        <div className="hero__grid-pattern" aria-hidden="true" />

        <div className="hero__content">
          <div className="hero__inner">
            {/* Text block */}
            <div className="hero__text-block">
              <span className="hero__badge">
                <span className="hero__badge-dot" aria-hidden="true" />
                New arrivals weekly
              </span>

              <h1 className="hero__title">
                Shop the{' '}
                <span className="hero__title-gradient">Future</span>
                <br />
                of Retail
              </h1>

              <p className="hero__subtitle">
                Discover premium electronics, fashion, books, and more —
                curated for quality, delivered to your door.
              </p>

              <div className="hero__cta">
                <Link to="/products" className="hero-shop-now-btn">
                  <p>Shop Now</p>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    ></path>
                  </svg>
                </Link>
                <Link to="/register" className="hero__btn--ghost">
                  Create Account
                </Link>
              </div>

              {/* Stats strip */}
              <div className="hero__stats">
                <div>
                  <p className="hero__stat-value">60+</p>
                  <p className="hero__stat-label">Products</p>
                </div>
                <div>
                  <p className="hero__stat-value">8</p>
                  <p className="hero__stat-label">Categories</p>
                </div>
                <div>
                  <p className="hero__stat-value">100%</p>
                  <p className="hero__stat-label">Secure</p>
                </div>
              </div>
            </div>

            {/* Product showcase (hidden on mobile via CSS) */}
            <div className="hero__showcase" aria-hidden="true">
              {loadingShowcase
                ? Array.from({ length: 4 }, (_, i) => (
                    <div key={i} className="hero__showcase-card skeleton" style={{ aspectRatio: '1' }} />
                  ))
                : showcase.map((p) => (
                    <Link to={`/products/${p.id}`} key={p.id} className="hero__showcase-card">
                      <div className="hero__showcase-img-wrap">
                        <img
                          className="hero__showcase-img"
                          src={p.image_url ?? 'https://placehold.co/300x300/1a1a24/6c63ff?text=Product'}
                          alt={p.name}
                          loading="lazy"
                        />
                      </div>
                      <div className="hero__showcase-info">
                        <p className="hero__showcase-name">{p.name}</p>
                        <p className="hero__showcase-price">${Number(p.price).toFixed(2)}</p>
                        <div className="hero__showcase-rating">
                          <span className="hero__showcase-stars">★★★★★</span>
                          <span className="hero__showcase-review-count">(128)</span>
                        </div>
                        <button 
                          className="hero__showcase-cart-btn" 
                          onClick={(e) => handleAddToCart(p, e)}
                          aria-label="Add to Cart"
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </button>
                      </div>
                    </Link>
                  ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          2. CATEGORIES
      ══════════════════════════════════════════════ */}
      <section className="section" aria-labelledby="categories-title">
        <div className="container">
          <div className="section__header">
            <div>
              <h2 id="categories-title" className="section__title">Shop by Category</h2>
              <p className="section__subtitle">Browse our curated collections</p>
            </div>
          </div>

          <div className="categories-strip">
            {CATEGORIES.map(({ slug, name, icon, color, border }) => (
              <Link
                key={slug}
                to={`/products?category=${slug}`}
                className="category-card"
                style={
                  {
                    '--cat-color': color,
                    '--cat-border': border,
                  } as React.CSSProperties
                }
              >
                <span className="category-card__icon" aria-hidden="true">{icon}</span>
                <span className="category-card__name">{name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          3. FEATURED PRODUCTS
      ══════════════════════════════════════════════ */}
      <section className="section" aria-labelledby="featured-title" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section__header">
            <div>
              <h2 id="featured-title" className="section__title">Featured Products</h2>
              <p className="section__subtitle">Hand-picked favourites this week</p>
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

          <ProductGrid
            products={featured}
            loading={loadingFeatured}
            skeletonCount={4}
            emptyTitle="No featured products yet"
            emptyDesc="Check back soon for our handpicked selections."
          />
        </div>
      </section>
    </>
  );
};

export default HomePage;
