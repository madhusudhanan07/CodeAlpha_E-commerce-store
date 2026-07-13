/**
 * ProductCardSkeleton.tsx — Loading placeholder for a product card
 *
 * Animated pulse skeleton shown while product data is being fetched.
 * Matches the visual layout of ProductCard exactly.
 */

const ProductCardSkeleton: React.FC = () => (
  <div className="product-card--skeleton" aria-hidden="true">
    <div className="product-card__img-wrap skeleton" />
    <div className="skeleton-body">
      <span className="skeleton-line skeleton-line--sm" />
      <span className="skeleton-line skeleton-line--lg" />
      <span className="skeleton-line skeleton-line--md" />
      <span className="skeleton-line skeleton-line--md" />
      <span className="skeleton-line skeleton-line--xl" style={{ marginTop: '0.5rem' }} />
    </div>
  </div>
);

export default ProductCardSkeleton;
