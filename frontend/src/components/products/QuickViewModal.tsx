/**
 * QuickViewModal.tsx — Quick View Product Preview Modal
 *
 * Renders quick product details overlay with thumbnail gallery, price, stock,
 * rating, Add to Cart, Wishlist, Buy Now, and Share without leaving current page.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import toast from 'react-hot-toast';
import type { Product, ProductGalleryImage } from '../../types';
import { X, ShoppingCart, Zap, Heart, Share2, Star } from 'lucide-react';
import '../../styles/products.css';

interface QuickViewModalProps {
  product: Product;
  onClose: () => void;
}

const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [selectedImage, setSelectedImage] = useState<string>(product.image_url || 'https://placehold.co/600');
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [buying, setBuying] = useState(false);
  const [togglingWish, setTogglingWish] = useState(false);

  const DETAIL_FALLBACK = 'https://placehold.co/600x600/16161e/a78bfa?text=Image+Unavailable';
  const isOutOfStock = product.stock === 0;
  const isSavedInWishlist = isInWishlist(product.id);
  const originalPrice = (Number(product.price) * 1.25).toFixed(2);

  const galleryList: ProductGalleryImage[] = product.gallery && product.gallery.length > 0
    ? product.gallery
    : [{ id: 0, product_id: product.id, image_url: product.image_url || DETAIL_FALLBACK, display_order: 1 }];

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to add items to your cart.');
      navigate('/login');
      return;
    }
    setAdding(true);
    try {
      await addToCart(product.id, quantity);
      toast.success(`${quantity} added to cart!`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to add to cart.');
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to continue.');
      navigate('/login');
      return;
    }
    setBuying(true);
    try {
      await addToCart(product.id, quantity);
      navigate('/checkout');
    } catch (err: any) {
      toast.error(err.message || 'Failed to process.');
      setBuying(false);
    }
  };

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to save items to your wishlist.');
      navigate('/login');
      return;
    }
    setTogglingWish(true);
    try {
      await toggleWishlist(product);
      toast.success(isSavedInWishlist ? 'Removed from wishlist' : 'Saved to wishlist!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update wishlist.');
    } finally {
      setTogglingWish(false);
    }
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/products/${product.slug || product.id}`;
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} on CodeAlpha Store!`,
        url: shareUrl,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast.success('Link Copied!');
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(10, 10, 15, 0.82)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-xl)',
          width: '100%',
          maxWidth: '850px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '2rem',
          boxShadow: 'var(--shadow-xl)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'var(--color-surface-2)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <X className="w-5 h-5" />
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

          {/* Left: Gallery preview */}
          <div>
            <div style={{ aspectRatio: '1', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--color-border)', marginBottom: '1rem' }}>
              <img
                src={selectedImage}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.3s ease' }}
              />
            </div>
            {galleryList.length > 1 && (
              <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
                {galleryList.map((gImg) => (
                  <button
                    key={gImg.id || gImg.image_url}
                    type="button"
                    onClick={() => setSelectedImage(gImg.image_url)}
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                      border: selectedImage === gImg.image_url ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                      cursor: 'pointer',
                    }}
                  >
                    <img src={gImg.image_url} alt="Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info panel */}
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-primary-light)' }}>
              {product.category_name}
            </span>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-text)', margin: '0.25rem 0 0.5rem 0' }}>
              {product.name}
            </h2>

            {/* Stars rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', color: '#f59e0b' }}>
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.round(product.average_rating || 5) ? 'fill-amber-400 stroke-amber-400' : 'text-gray-600'}`} />
                ))}
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text)' }}>{product.average_rating || 4.8}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>({product.review_count || 12} reviews)</span>
            </div>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-text)' }}>${Number(product.price).toFixed(2)}</span>
              <span style={{ textDecoration: 'line-through', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>${originalPrice}</span>
              <span className="deal-card__badge" style={{ position: 'static' }}>20% OFF</span>
            </div>

            <p style={{ fontSize: '0.85rem', lineHeight: 1.6, color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
              {product.description || 'High-grade precision engineered product built for maximum performance and everyday reliability.'}
            </p>

            {/* Quantity Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Qty:</span>
              <div className="product-details__qty-ctrl">
                <button className="product-details__qty-btn" onClick={() => setQuantity((q) => Math.max(1, q - 1))} type="button">−</button>
                <span className="product-details__qty-value">{quantity}</span>
                <button className="product-details__qty-btn" onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))} type="button">+</button>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              <button
                type="button"
                className="hero__btn--primary"
                onClick={handleAddToCart}
                disabled={isOutOfStock || adding}
                style={{ flex: '1 1 140px', fontSize: '0.85rem' }}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                {adding ? 'Adding…' : 'Add to Cart'}
              </button>

              <button
                type="button"
                className="product-details__buy-btn"
                onClick={handleBuyNow}
                disabled={isOutOfStock || buying}
                style={{ flex: '1 1 140px', fontSize: '0.85rem' }}
              >
                <Zap className="w-4 h-4 mr-2" />
                {buying ? 'Processing…' : 'Buy Now'}
              </button>

              <button
                type="button"
                className={`wishlist-heart-btn ${isSavedInWishlist ? 'wishlist-heart-btn--active' : ''}`}
                onClick={handleWishlistToggle}
                disabled={togglingWish}
                style={{ position: 'static', width: '42px', height: '42px' }}
              >
                <Heart className="w-5 h-5" fill={isSavedInWishlist ? '#ef4444' : 'none'} stroke={isSavedInWishlist ? '#ef4444' : 'currentColor'} />
              </button>

              <button
                type="button"
                className="wishlist-heart-btn"
                onClick={handleShare}
                style={{ position: 'static', width: '42px', height: '42px' }}
                title="Share product"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
