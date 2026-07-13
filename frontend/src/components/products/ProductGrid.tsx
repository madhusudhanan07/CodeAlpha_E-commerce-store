/**
 * ProductGrid.tsx — Responsive grid of ProductCard components
 *
 * Handles three states:
 *  1. Loading → renders N skeleton cards
 *  2. Empty   → shows an empty-state message
 *  3. Data    → renders ProductCard for each product
 */

import ProductCard from './ProductCard';
import ProductCardSkeleton from './ProductCardSkeleton';
import type { Product } from '../../types';

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  skeletonCount?: number;
  emptyTitle?: string;
  emptyDesc?: string;
  onAddToCart?: (product: Product) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  loading = false,
  skeletonCount = 8,
  emptyTitle = 'No products found',
  emptyDesc = 'Try adjusting your search or filter criteria.',
  onAddToCart,
}) => {
  if (loading) {
    return (
      <div className="product-grid" aria-busy="true" aria-label="Loading products">
        {Array.from({ length: skeletonCount }, (_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-state__icon" aria-hidden="true">🔍</span>
        <p className="empty-state__title">{emptyTitle}</p>
        <p className="empty-state__desc">{emptyDesc}</p>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
