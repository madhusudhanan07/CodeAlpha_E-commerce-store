/**
 * ProductDetailsPage.tsx — Full Product Detail View
 *
 * Features:
 *  - Fetches product by numeric ID from URL params
 *  - Full image, name, price, stock indicator, description
 *  - Quantity picker (1 → stock)
 *  - "Add to Cart" button (wired to future CartContext)
 *  - Featured badge
 *  - Breadcrumb navigation
 *  - Loading skeleton + 404/error states
 */

import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchProductById } from '../services/productService';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import type { Product } from '../types';
import '../styles/products.css';

// ── Skeleton for the details layout ──────────────────────────────────────────
const DetailSkeleton: React.FC = () => (
  <div className="product-details__grid" aria-busy="true" aria-label="Loading product">
    {/* Image skeleton */}
    <div className="product-details__img-panel">
      <div className="product-details__img-wrap skeleton" style={{ aspectRatio: '1' }} />
    </div>

    {/* Info skeleton */}
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

// ── Stock indicator helper ─────────────────────────────────────────────────────
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

// ── Main component ─────────────────────────────────────────────────────────────
const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart: addToCartContext } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addedFeedback, setAddedFeedback] = useState(false);

  const [cartError, setCartError] = useState<string | null>(null);

  useEffect(() => {
    const numId = Number(id);
    if (!id || isNaN(numId) || numId < 1) {
      setError('Invalid product ID.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setCartError(null);
    setQuantity(1);
    setAddedFeedback(false);

    fetchProductById(numId)
      .then(setProduct)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDecrement = () => setQuantity((q) => Math.max(1, q - 1));
  const handleIncrement = () =>
    setQuantity((q) => Math.min(product?.stock ?? 1, q + 1));

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setCartError(null);
    try {
      await addToCartContext(product!.id, quantity);
      setAddedFeedback(true);
      setTimeout(() => setAddedFeedback(false), 2000);
    } catch (err: any) {
      setCartError(err.message || 'Failed to add to cart.');
    }
  };

  // ── Error / Not Found ──────────────────────────────────────────────────────
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

  const imageSrc =
    product?.image_url ??
    'https://placehold.co/600x600/1a1a24/6c63ff?text=No+Image';
  const isOutOfStock = (product?.stock ?? 0) === 0;

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

      {/* Content */}
      {loading ? (
        <DetailSkeleton />
      ) : (
        product && (
          <div className="product-details__grid">

            {/* ── Left: Image Panel ──────────────────────────────── */}
            <div className="product-details__img-panel">
              <div className="product-details__img-wrap">
                {imageSrc ? (
                  <img src={imageSrc} alt={product.name} />
                ) : (
                  <div className="product-details__img-placeholder" aria-hidden="true">
                    🛒
                  </div>
                )}
              </div>
            </div>

            {/* ── Right: Info Panel ──────────────────────────────── */}
            <div className="product-details__info">

              {/* Category + Featured badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <p className="product-details__category">{product.category_name}</p>
                {product.is_featured === 1 && (
                  <span className="product-details__badge-featured">
                    ★ Featured
                  </span>
                )}
              </div>

              {/* Name */}
              <h1 className="product-details__name">{product.name}</h1>

              {/* Price */}
              <div className="product-details__price-row">
                <span className="product-details__price-currency">$</span>
                <span className="product-details__price">
                  {Number(product.price).toFixed(2)}
                </span>
              </div>

              <hr className="product-details__divider" />

              {/* Description */}
              {product.description && (
                <div>
                  <p className="product-details__desc-label">Description</p>
                  <p className="product-details__desc">{product.description}</p>
                </div>
              )}

              {/* Stock */}
              <StockIndicator stock={product.stock} />

              <hr className="product-details__divider" />

              {/* Actions */}
              <div className="product-details__actions">
                {/* Quantity picker */}
                <div className="product-details__qty-row">
                  <span className="product-details__qty-label">Qty</span>
                  <div className="product-details__qty-ctrl" role="group" aria-label="Quantity">
                    <button
                      className="product-details__qty-btn"
                      onClick={handleDecrement}
                      disabled={quantity <= 1 || isOutOfStock}
                      aria-label="Decrease quantity"
                      type="button"
                    >
                      −
                    </button>
                    <span
                      className="product-details__qty-value"
                      aria-live="polite"
                      aria-label={`Quantity: ${quantity}`}
                    >
                      {quantity}
                    </span>
                    <button
                      className="product-details__qty-btn"
                      onClick={handleIncrement}
                      disabled={quantity >= product.stock || isOutOfStock}
                      aria-label="Increase quantity"
                      type="button"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Buttons Layout */}
                <div className="product-details__buttons-row">
                  {/* Add to Cart */}
                  <button
                    id={`add-to-cart-detail-${product.id}`}
                    className="product-details__add-btn"
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    type="button"
                    aria-label={isOutOfStock ? 'Out of stock' : `Add ${quantity} to cart`}
                  >
                    {isOutOfStock ? (
                      'Out of Stock'
                    ) : addedFeedback ? (
                      <>✓ Added</>
                    ) : (
                      <>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                          strokeLinejoin="round" aria-hidden="true">
                          <circle cx="9" cy="21" r="1" />
                          <circle cx="20" cy="21" r="1" />
                          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                        </svg>
                        Add to Cart
                      </>
                    )}
                  </button>

                  {/* Buy Now */}
                  <button
                    id={`buy-now-detail-${product.id}`}
                    className="product-details__buy-btn"
                    onClick={() => {}}
                    disabled={isOutOfStock}
                    type="button"
                    aria-label={isOutOfStock ? 'Out of stock' : `Buy ${product.name} now`}
                  >
                    Buy Now
                  </button>
                </div>
                
                {cartError && (
                  <p style={{ color: 'var(--color-danger)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                    {cartError}
                  </p>
                )}

                {/* Back link */}
                <Link to="/products" className="product-details__back-btn">
                  ← Back to Products
                </Link>
              </div>
            </div>
          </div>
        )
      )}
    </main>
  );
};

export default ProductDetailsPage;
