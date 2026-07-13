/**
 * ProductCard.tsx — Individual product display card
 *
 * Shows: image, category badge, name, price, stock status.
 * Clicking the card or the "View" button navigates to /products/:id.
 * "Add to Cart" button is wired to onClick prop (cart module — future phase).
 */

import { Link } from 'react-router-dom';
import type { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

const PLACEHOLDER =
  'https://placehold.co/600x400/1a1a24/6c63ff?text=No+Image';

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const imageUrl = product.image_url || PLACEHOLDER;
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 10;

  return (
    <article className="product-card">
      {/* ── Image ───────────────────────────────── */}
      <Link
        to={`/products/${product.id}`}
        className="product-card__img-wrap"
        aria-label={`View ${product.name}`}
        tabIndex={-1}
      >
        <img src={imageUrl} alt={product.name} loading="lazy" />
        {isOutOfStock && (
          <div className="product-card__oos-badge" aria-label="Out of stock">
            Out of Stock
          </div>
        )}
        {product.is_featured === 1 && !isOutOfStock && (
          <span className="product-card__featured-badge" aria-label="Featured product">
            ★ Featured
          </span>
        )}
      </Link>

      {/* ── Body ────────────────────────────────── */}
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
            <p className="product-card__price">${product.price.toFixed(2)}</p>
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
            disabled={isOutOfStock}
            onClick={() => onAddToCart?.(product)}
            aria-label={`Add ${product.name} to cart`}
          >
            {isOutOfStock ? 'Sold Out' : 'Add'}
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
