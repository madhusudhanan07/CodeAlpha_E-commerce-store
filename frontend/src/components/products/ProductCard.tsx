/**
 * ProductCard.tsx — Individual product display card
 *
 * Shows: image, category badge, name, price, stock status, wishlist heart toggle button,
 * and Quick View button.
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import QuickViewModal from './QuickViewModal';
import toast from 'react-hot-toast';
import type { Product } from '../../types';
import { Eye, Heart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

const FALLBACK =
  'https://placehold.co/600x600/16161e/a78bfa?text=Image+Unavailable';

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [imgSrc, setImgSrc] = useState(product.image_url || FALLBACK);
  const [adding, setAdding] = useState(false);
  const [togglingWishlist, setTogglingWishlist] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);

  const isSaved = isInWishlist(product.id);
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 10;

  const handleAdd = async () => {
    if (onAddToCart) {
      onAddToCart(product);
      return;
    }

    if (!isAuthenticated) {
      toast.error('Please sign in to add items to your cart.');
      navigate('/login');
      return;
    }

    setAdding(true);
    try {
      await addToCart(product.id, 1);
      toast.success(`"${product.name}" added to cart!`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to add item to cart.');
    } finally {
      setAdding(false);
    }
  };

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Please sign in to save items to your wishlist.');
      navigate('/login');
      return;
    }

    setTogglingWishlist(true);
    try {
      await toggleWishlist(product);
      toast.success(
        isSaved
          ? `Removed "${product.name}" from wishlist.`
          : `Saved "${product.name}" to wishlist!`,
      );
    } catch (err: any) {
      toast.error(err.message || 'Failed to update wishlist.');
    } finally {
      setTogglingWishlist(false);
    }
  };

  return (
    <>
      <article className="product-card">
        {/* Image Panel & Action Overlay Buttons */}
        <div className="product-card__img-wrap">
          <Link
            to={`/products/${product.id}`}
            aria-label={`View ${product.name}`}
            tabIndex={-1}
            style={{ display: 'block', width: '100%', height: '100%' }}
          >
            <img
              src={imgSrc}
              alt={product.name}
              loading="lazy"
              onError={() => setImgSrc(FALLBACK)}
            />
          </Link>

          {/* Quick View Button */}
          <button
            type="button"
            className="hero__btn--ghost"
            onClick={() => setShowQuickView(true)}
            style={{
              position: 'absolute',
              bottom: '10px',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '0.75rem',
              fontWeight: 600,
              padding: '0.4rem 0.85rem',
              backdropFilter: 'blur(8px)',
              background: 'rgba(15, 23, 42, 0.9)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              borderRadius: '999px',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
            }}
          >
            <Eye className="w-3.5 h-3.5 text-white" />
            <span style={{ color: '#ffffff', fontWeight: 600 }}>Quick View</span>
          </button>

          {/* Wishlist Heart Button */}
          <button
            type="button"
            className={`wishlist-heart-btn ${isSaved ? 'wishlist-heart-btn--active' : ''}`}
            onClick={handleWishlistToggle}
            disabled={togglingWishlist}
            aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
            title={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
          >
            <Heart className="w-5 h-5" fill={isSaved ? '#ef4444' : 'none'} stroke={isSaved ? '#ef4444' : 'currentColor'} />
          </button>

          {isOutOfStock && (
            <div className="product-card__oos-badge" aria-label="Out of stock">
              Out of Stock
            </div>
          )}
        </div>

        {/* Body */}
        <div className="product-card__body">
          <p className="product-card__category">{product.category_name}</p>

          <Link to={`/products/${product.id}`} style={{ textDecoration: 'none' }}>
            <h2 className="product-card__name">{product.name}</h2>
          </Link>

          {product.description && (
            <p className="product-card__desc">{product.description}</p>
          )}

          <div className="product-card__footer">
            <div>
              <p className="product-card__price">${Number(product.price).toFixed(2)}</p>
              <p
                className={`product-card__stock${isLowStock ? ' product-card__stock--low' : ''}`}
              >
                {isOutOfStock
                  ? 'Out of stock'
                  : isLowStock
                    ? `Only ${product.stock} left`
                    : `${product.stock} in stock`}
              </p>
            </div>

            <button
              id={`add-to-cart-${product.id}`}
              className="product-card__btn"
              disabled={isOutOfStock || adding}
              onClick={handleAdd}
              aria-label={`Add ${product.name} to cart`}
            >
              {isOutOfStock ? 'Sold Out' : adding ? 'Adding…' : 'Add'}
            </button>
          </div>
        </div>
      </article>

      {/* Quick View Modal Overlay */}
      {showQuickView && (
        <QuickViewModal product={product} onClose={() => setShowQuickView(false)} />
      )}
    </>
  );
};

export default ProductCard;
