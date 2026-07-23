/**
 * ProductDetailsPage.tsx — Fully Dynamic MySQL-Driven Product Detail View
 *
 * Rendered with dynamic gallery images, 8-12 technical specifications,
 * customer reviews, rating summaries, review submission modal, and category-matched related items.
 */

import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchProductById, fetchProductBySlug } from '../services/productService';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import toast from 'react-hot-toast';
import type { Product, ProductReview, ProductSpecification, ProductGalleryImage } from '../types';
import { ShieldCheck, Truck, RefreshCw, Heart, ShoppingCart, Zap, Star, Share2 } from 'lucide-react';
import FrequentlyBought from '../components/recommendations/FrequentlyBought';
import RelatedProducts from '../components/recommendations/RelatedProducts';
import RecommendedProducts from '../components/recommendations/RecommendedProducts';
import RecentlyViewed from '../components/recommendations/RecentlyViewed';
import ProductReviewsSection from '../components/reviews/ProductReviewsSection';
import '../styles/products.css';
import '../styles/reviews.css';

// ── Skeleton Loader ───────────────────────────────────────────────────────────
const DetailSkeleton: React.FC = () => (
  <div className="product-details__grid" aria-busy="true" aria-label="Loading product">
    <div className="product-details__img-panel">
      <div className="product-details__img-wrap skeleton" style={{ aspectRatio: '1' }} />
    </div>
    <div className="product-details__info">
      <span className="skeleton-line skeleton-line--sm" />
      <span className="skeleton-line skeleton-line--lg" style={{ height: '36px', marginTop: '0.5rem' }} />
      <span className="skeleton-line skeleton-line--md" />
      <span className="skeleton-line skeleton-line--xl" style={{ height: '48px', marginTop: '1rem' }} />
      <span className="skeleton-line skeleton-line--lg" style={{ marginTop: '0.5rem' }} />
      <span className="skeleton-line skeleton-line--lg" />
      <span className="skeleton-line skeleton-line--md" />
    </div>
  </div>
);

// ── Stock Indicator Helper ───────────────────────────────────────────────────
const StockIndicator: React.FC<{ stock: number }> = ({ stock }) => {
  if (stock === 0)
    return (
      <div className="product-details__stock">
        <span className="product-details__stock-dot product-details__stock-dot--out" />
        <span className="product-details__stock-text">Out of stock</span>
      </div>
    );

  if (stock <= 10)
    return (
      <div className="product-details__stock">
        <span className="product-details__stock-dot product-details__stock-dot--low" />
        <span className="product-details__stock-text">Only {stock} left — order soon</span>
      </div>
    );

  return (
    <div className="product-details__stock">
      <span className="product-details__stock-dot product-details__stock-dot--in" />
      <span className="product-details__stock-text">In stock ({stock} units)</span>
    </div>
  );
};

const ProductDetailsPage: React.FC = () => {
  const { id, slug } = useParams<{ id?: string; slug?: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart: addToCartContext } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [buyingNow, setBuyingNow] = useState(false);
  const [togglingWishlist, setTogglingWishlist] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'reviews'>('description');

  // Zoom lens hover state
  const [zoomPos, setZoomPos] = useState<{ x: number; y: number; isHovered: boolean }>({ x: 50, y: 50, isHovered: false });

  const identifier = slug || id;

  const loadProductData = () => {
    if (!identifier) {
      setError('Product not found.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setQuantity(1);

    const isNumeric = /^\d+$/.test(identifier);
    const fetchPromise = isNumeric
      ? fetchProductById(Number(identifier))
      : fetchProductBySlug(identifier);

    fetchPromise
      .then((data) => {
        setProduct(data);
        setSelectedImage(data.image_url);
      })
      .catch((err: Error) => setError(err.message || 'Product not found.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProductData();
  }, [identifier]);

  const handleDecrement = () => setQuantity((q) => Math.max(1, q - 1));
  const handleIncrement = () =>
    setQuantity((q) => Math.min(product?.stock ?? 1, q + 1));

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to add items to your cart.');
      navigate('/login');
      return;
    }
    try {
      await addToCartContext(product!.id, quantity);
      toast.success(`${quantity} ${quantity > 1 ? 'items' : 'item'} added to cart!`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to add to cart.');
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to continue.');
      navigate('/login');
      return;
    }
    setBuyingNow(true);
    try {
      await addToCartContext(product!.id, quantity);
      navigate('/checkout');
    } catch (err: any) {
      toast.error(err.message || 'Failed to process. Please try again.');
      setBuyingNow(false);
    }
  };

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to save items to your wishlist.');
      navigate('/login');
      return;
    }
    if (!product) return;

    setTogglingWishlist(true);
    try {
      await toggleWishlist(product);
      toast.success(
        isInWishlist(product.id)
          ? `Removed "${product.name}" from wishlist.`
          : `Saved "${product.name}" to wishlist!`,
      );
    } catch (err: any) {
      toast.error(err.message || 'Failed to update wishlist.');
    } finally {
      setTogglingWishlist(false);
    }
  };

  // Image mouse zoom handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y, isHovered: true });
  };

  const handleMouseLeave = () => {
    setZoomPos((prev) => ({ ...prev, isHovered: false }));
  };

  if (!loading && (error || !product)) {
    return (
      <main className="product-details-page container">
        <div className="product-details__error">
          <span className="product-details__error-icon">🔍</span>
          <h1 className="product-details__error-title">Product Not Found</h1>
          <p className="product-details__error-msg">
            {error ?? "The product you're looking for doesn't exist or has been removed."}
          </p>
          <button
            className="product-details__back-btn"
            onClick={() => navigate(-1)}
          >
            ← Go Back
          </button>
        </div>
      </main>
    );
  }

  const DETAIL_FALLBACK = 'https://placehold.co/800x800/16161e/a78bfa?text=Image+Unavailable';
  const mainImageSrc = selectedImage || product?.image_url || DETAIL_FALLBACK;
  const isOutOfStock = (product?.stock ?? 0) === 0;
  const isSavedInWishlist = product ? isInWishlist(product.id) : false;

  const originalPrice = product ? (Number(product.price) * 1.25).toFixed(2) : '0.00';

  const galleryList: ProductGalleryImage[] = product?.gallery && product.gallery.length > 0
    ? product.gallery
    : [{ id: 0, product_id: product?.id || 0, image_url: product?.image_url || DETAIL_FALLBACK, display_order: 1 }];

  const specsList: ProductSpecification[] = product?.specifications || [];
  const reviewsList: ProductReview[] = product?.reviews || [];
  const avgRating = product?.average_rating ?? 5.0;
  const reviewCount = product?.review_count ?? reviewsList.length;

  return (
    <main className="product-details-page container">

      {/* Breadcrumb */}
      <nav className="product-details__breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span className="product-details__breadcrumb-sep" aria-hidden="true">›</span>
        <Link to="/products">Products</Link>
        {product && (
          <>
            <span className="product-details__breadcrumb-sep" aria-hidden="true">›</span>
            <Link to={`/products?category=${product.category_slug}`}>
              {product.category_name}
            </Link>
            <span className="product-details__breadcrumb-sep" aria-hidden="true">›</span>
            <span aria-current="page">{product.name}</span>
          </>
        )}
      </nav>

      {loading && <DetailSkeleton />}

      {!loading && product && (
        <>
            <div className="product-details__grid">

              {/* ── LEFT SIDE: Image Gallery Panel ────────────────── */}
              <div className="product-details__img-panel">
                <div
                  className="product-details__img-wrap"
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  style={{ cursor: 'zoom-in', overflow: 'hidden' }}
                >
                  <img
                    src={mainImageSrc}
                    alt={product.name}
                    style={{
                      transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                      transform: zoomPos.isHovered ? 'scale(1.45)' : 'scale(1)',
                      transition: zoomPos.isHovered ? 'none' : 'transform 0.3s ease-out',
                    }}
                    onError={(e) => {
                      const t = e.currentTarget;
                      if (t.src !== DETAIL_FALLBACK) t.src = DETAIL_FALLBACK;
                    }}
                  />
                </div>

                {/* Gallery Thumbnails */}
                <div className="product-details__gallery-thumbs" aria-label="Product image gallery">
                  {galleryList.map((gImg) => (
                    <button
                      key={gImg.id || gImg.image_url}
                      className={`gallery-thumb ${gImg.image_url === mainImageSrc ? 'gallery-thumb--active' : ''}`}
                      onClick={() => setSelectedImage(gImg.image_url)}
                      type="button"
                      aria-label="View gallery preview"
                    >
                      <img src={gImg.image_url} alt={`${product.name} thumbnail`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* ── RIGHT SIDE: Product Info Panel ───────────────── */}
              <div className="product-details__info">

                {/* Category + Featured + SKU */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <p className="product-details__category">{product.category_name}</p>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', background: 'var(--color-surface-2)', padding: '2px 8px', borderRadius: '4px' }}>
                    SKU: CA-PROD-00{product.id}
                  </span>
                  {product.is_featured === 1 && (
                    <span className="product-card__featured-badge">Featured</span>
                  )}
                </div>

                {/* Product Title */}
                <h1 className="product-details__name">{product.name}</h1>

                {/* Rating & Review Summary */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', color: '#f59e0b' }}>
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < Math.round(avgRating) ? 'fill-amber-400 stroke-amber-400' : 'text-gray-600'}`} />
                    ))}
                  </div>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text)' }}>{avgRating}</span>
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>({reviewCount} verified reviews)</span>
                </div>

                {/* Price & Discount Row */}
                <div className="product-details__price-row" style={{ alignItems: 'baseline', gap: '0.75rem' }}>
                  <span className="product-details__price-currency">$</span>
                  <span className="product-details__price">
                    {Number(product.price).toFixed(2)}
                  </span>
                  <span className="deal-price-old">${originalPrice}</span>
                  <span className="deal-card__badge" style={{ position: 'static' }}>20% OFF</span>
                </div>

                <hr className="product-details__divider" />

                {/* Product Description */}
                {product.description && (
                  <div>
                    <p className="product-details__desc-label">Product Overview</p>
                    <p className="product-details__desc">{product.description}</p>
                  </div>
                )}

                {/* Stock Indicator */}
                <StockIndicator stock={product.stock} />

                <hr className="product-details__divider" />

                {/* Actions & Buttons */}
                <div className="product-details__actions">
                  <div className="product-details__qty-row">
                    <span className="product-details__qty-label">Qty</span>
                    <div className="product-details__qty-ctrl" role="group" aria-label="Quantity">
                      <button
                        className="product-details__qty-btn"
                        onClick={handleDecrement}
                        disabled={quantity <= 1 || isOutOfStock}
                        type="button"
                      >
                        −
                      </button>
                      <span className="product-details__qty-value">{quantity}</span>
                      <button
                        className="product-details__qty-btn"
                        onClick={handleIncrement}
                        disabled={quantity >= product.stock || isOutOfStock}
                        type="button"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Buttons Grid */}
                  <div className="product-details__buttons-row" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <button
                      id={`add-to-cart-detail-${product.id}`}
                      className="product-details__add-btn"
                      onClick={handleAddToCart}
                      disabled={isOutOfStock}
                      type="button"
                      style={{ flex: '1 1 180px' }}
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Add to Cart
                    </button>

                    <button
                      id={`buy-now-detail-${product.id}`}
                      className="product-details__buy-btn"
                      onClick={handleBuyNow}
                      disabled={isOutOfStock || buyingNow}
                      type="button"
                      style={{ flex: '1 1 180px' }}
                    >
                      <Zap className="w-5 h-5 mr-2" />
                      {buyingNow ? 'Processing…' : 'Buy Now'}
                    </button>

                    <button
                      type="button"
                      className={`wishlist-heart-btn ${isSavedInWishlist ? 'wishlist-heart-btn--active' : ''}`}
                      onClick={handleWishlistToggle}
                      disabled={togglingWishlist}
                      style={{ position: 'static', width: '48px', height: '48px' }}
                      title={isSavedInWishlist ? 'Remove from wishlist' : 'Save to wishlist'}
                    >
                      <Heart
                        className="w-5 h-5"
                        fill={isSavedInWishlist ? '#ef4444' : 'none'}
                        stroke={isSavedInWishlist ? '#ef4444' : 'currentColor'}
                      />
                    </button>

                    <button
                      type="button"
                      className="wishlist-heart-btn"
                      onClick={() => {
                        const shareUrl = window.location.href;
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
                      }}
                      style={{ position: 'static', width: '48px', height: '48px' }}
                      title="Share product"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Trust Badges Strip */}
                  <div className="trust-badges-strip">
                    <div className="trust-badge-item">
                      <ShieldCheck className="w-5 h-5 text-indigo-400" />
                      <div>
                        <strong>Secure Payment</strong>
                        <span>256-Bit SSL Encrypted</span>
                      </div>
                    </div>
                    <div className="trust-badge-item">
                      <Truck className="w-5 h-5 text-emerald-400" />
                      <div>
                        <strong>Free Delivery</strong>
                        <span>Orders over $50</span>
                      </div>
                    </div>
                    <div className="trust-badge-item">
                      <RefreshCw className="w-5 h-5 text-blue-400" />
                      <div>
                        <strong>Easy Returns</strong>
                        <span>30-Day Money Back</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* ── TABBED SECTION: Description / Specifications / Reviews ──── */}
            <section className="section" style={{ paddingTop: '2rem' }}>
              <div className="details-tabs-nav">
                <button
                  type="button"
                  className={`details-tab-btn ${activeTab === 'description' ? 'details-tab-btn--active' : ''}`}
                  onClick={() => setActiveTab('description')}
                >
                  Description
                </button>
                <button
                  type="button"
                  className={`details-tab-btn ${activeTab === 'specifications' ? 'details-tab-btn--active' : ''}`}
                  onClick={() => setActiveTab('specifications')}
                >
                  Specifications ({specsList.length})
                </button>
                <button
                  type="button"
                  className={`details-tab-btn ${activeTab === 'reviews' ? 'details-tab-btn--active' : ''}`}
                  onClick={() => setActiveTab('reviews')}
                >
                  Customer Reviews ({reviewCount})
                </button>
              </div>

              <div className="details-tab-content">
                {/* Description Tab */}
                {activeTab === 'description' && (
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-text)' }}>
                      About {product.name}
                    </h3>
                    <p style={{ lineHeight: 1.7, color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
                      {product.description || 'Designed with precision engineering and high-grade materials, this product offers unmatched reliability, performance, and style.'}
                    </p>
                  </div>
                )}

                {/* Specifications Tab — 8 to 12 Specs from MySQL */}
                {activeTab === 'specifications' && (
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-text)' }}>
                      Technical Specifications
                    </h3>
                    {specsList.length > 0 ? (
                      <table className="specs-table">
                        <tbody>
                          {specsList.map((spec) => (
                            <tr key={spec.id || spec.spec_key}>
                              <td>{spec.spec_key}</td>
                              <td>{spec.spec_value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p style={{ color: 'var(--color-text-muted)' }}>No specifications provided for this product.</p>
                    )}
                  </div>
                )}

                {/* Reviews Tab — Amazon / Flipkart Style Reviews & Ratings System */}
                {activeTab === 'reviews' && (
                  <ProductReviewsSection productId={product.id} productName={product.name} />
                )}
              </div>
            </section>

            {/* ── RECOMMENDATION ENGINE SECTIONS ─────────────────────────── */}
            <FrequentlyBought productId={product.id} mainProduct={product} />
            <RelatedProducts productId={product.id} categoryName={product.category_name} />
            <RecommendedProducts currentProductId={product.id} />
            <RecentlyViewed currentProductId={product.id} />
          </>
      )}
    </main>
  );
};

export default ProductDetailsPage;
