/**
 * WishlistPage.tsx — Customer Favorites / Wishlist View
 *
 * Displays saved items with real-time toggle, direct "Move to Cart" action, and remove buttons.
 * Supports both authenticated users (MySQL) and guest users (localStorage).
 */

import { Link, useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import type { Product } from '../types';
import { ShoppingCart, Trash2, Heart, ArrowRight } from 'lucide-react';
import '../styles/products.css';

const WishlistPage: React.FC = () => {
  const { wishlist, count, loading, error, removeFromWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleMoveToCart = async (product: Product) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to add items to your cart.');
      navigate('/login');
      return;
    }

    try {
      await addToCart(product.id, 1);
      await removeFromWishlist(product.id);
      toast.success(`Moved "${product.name}" to cart!`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to move item to cart.');
    }
  };

  const handleRemove = async (product: Product) => {
    try {
      await removeFromWishlist(product.id);
      toast.success(`Removed "${product.name}" from wishlist.`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to remove item.');
    }
  };

  return (
    <main className="products-page container" aria-label="My Wishlist" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <header className="products-page__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="products-page__title">My Wishlist</h1>
          <p className="products-page__subtitle">
            Saved favorites ({count} {count === 1 ? 'item' : 'items'}).
          </p>
        </div>
        <Link to="/products" className="section__link">
          Continue Shopping <ArrowRight className="w-4 h-4 ml-1 inline" />
        </Link>
      </header>

      {/* Error State */}
      {error && !loading && (
        <div className="empty-state">
          <span className="empty-state__icon">⚠️</span>
          <p className="empty-state__title">Failed to load wishlist</p>
          <p className="empty-state__desc">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && wishlist.length === 0 && (
        <div className="empty-state" style={{ padding: '4rem 1rem' }}>
          <Heart className="w-16 h-16 text-red-500" style={{ margin: '0 auto 1rem', fill: 'rgba(239,68,68,0.2)' }} />
          <h1 className="empty-state__title">Your Wishlist is Empty</h1>
          <p className="empty-state__desc">Explore our catalog and click the heart icon on any product to save it here.</p>
          <Link to="/products" className="hero__btn--primary" style={{ marginTop: '1.5rem', display: 'inline-block' }}>
            Browse Catalogue
          </Link>
        </div>
      )}

      {/* Saved Products List */}
      {!loading && !error && wishlist.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
          {wishlist.map((product) => {
            const originalPrice = (Number(product.price) * 1.25).toFixed(2);
            return (
              <div
                key={product.id}
                style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-xl)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
                  <Link to={`/products/${product.id}`}>
                    <img
                      src={product.image_url || 'https://placehold.co/400'}
                      alt={product.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleRemove(product)}
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: 'rgba(22,22,30,0.85)',
                      border: '1px solid var(--color-border)',
                      color: '#ef4444',
                      borderRadius: '50%',
                      width: '36px',
                      height: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-primary-light)', fontWeight: 700, textTransform: 'uppercase' }}>
                      {product.category_name}
                    </span>
                    <Link to={`/products/${product.id}`} style={{ textDecoration: 'none' }}>
                      <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text)', margin: '0.25rem 0 0.5rem 0' }}>
                        {product.name}
                      </h2>
                    </Link>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text)' }}>${Number(product.price).toFixed(2)}</span>
                      <span style={{ textDecoration: 'line-through', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>${originalPrice}</span>
                      <span className="deal-card__badge" style={{ position: 'static' }}>20% OFF</span>
                    </div>

                    <div style={{ fontSize: '0.8rem', color: product.stock > 0 ? '#4ade80' : '#ef4444', fontWeight: 600, marginBottom: '1rem' }}>
                      {product.stock > 0 ? `In Stock (${product.stock} units)` : 'Out of Stock'}
                    </div>
                  </div>

                  <button
                    type="button"
                    className="hero__btn--primary"
                    onClick={() => handleMoveToCart(product)}
                    disabled={product.stock === 0}
                    style={{ width: '100%', fontSize: '0.85rem' }}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" /> Move to Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
};

export default WishlistPage;
