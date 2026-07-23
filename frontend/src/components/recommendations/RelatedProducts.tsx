/**
 * RelatedProducts.tsx — Related Products Component
 *
 * Fetches 4-6 category-matched items (shuffled on refresh, excluding current product)
 * from backend API GET /api/products/:id/related.
 */

import { useEffect, useState } from 'react';
import axiosInstance from '../../services/axiosInstance';
import ProductGrid from '../products/ProductGrid';
import type { Product } from '../../types';
import '../../styles/products.css';

interface RelatedProductsProps {
  productId: number;
  categoryName?: string;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ productId, categoryName }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get(`/api/products/${productId}/related`)
      .then((res) => {
        if (res.data?.data?.products) {
          setProducts(res.data.data.products);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [productId]);

  if (!loading && products.length === 0) return null;

  return (
    <section className="section container" aria-labelledby="related-section-title" style={{ marginTop: '3rem' }}>
      <div className="section__header">
        <div>
          <h2 id="related-section-title" className="section__title">Related Products</h2>
          <p className="section__subtitle">More carefully selected items from {categoryName || 'this category'}</p>
        </div>
      </div>

      <ProductGrid products={products} loading={loading} skeletonCount={4} />
    </section>
  );
};

export default RelatedProducts;
