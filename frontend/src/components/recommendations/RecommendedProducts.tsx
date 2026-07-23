/**
 * RecommendedProducts.tsx — "You May Also Like" Mixed Category Recommendations
 *
 * Fetches 8 mixed-category product recommendations from backend API.
 */

import { useEffect, useState } from 'react';
import axiosInstance from '../../services/axiosInstance';
import ProductGrid from '../products/ProductGrid';
import type { Product } from '../../types';
import '../../styles/products.css';

interface RecommendedProductsProps {
  currentProductId?: number;
}

const RecommendedProducts: React.FC<RecommendedProductsProps> = ({ currentProductId }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get('/api/products/recommended')
      .then((res) => {
        if (res.data?.data?.products) {
          const list: Product[] = res.data.data.products;
          const filtered = currentProductId ? list.filter((p) => p.id !== currentProductId) : list;
          setProducts(filtered.slice(0, 8));
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [currentProductId]);

  if (!loading && products.length === 0) return null;

  return (
    <section className="section container" aria-labelledby="rec-title">
      <div className="section__header">
        <div>
          <h2 id="rec-title" className="section__title">You May Also Like</h2>
          <p className="section__subtitle">Handpicked recommendations based on popular browsing trends</p>
        </div>
      </div>

      <ProductGrid products={products} loading={loading} skeletonCount={4} />
    </section>
  );
};

export default RecommendedProducts;
