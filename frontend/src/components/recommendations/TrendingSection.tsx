/**
 * TrendingSection.tsx — Trending Now Products Section
 *
 * Displays highly viewed, wishlisted, and top-rated products with 🔥 Trending badges.
 */

import { useEffect, useState } from 'react';
import axiosInstance from '../../services/axiosInstance';
import ProductGrid from '../products/ProductGrid';
import type { Product } from '../../types';
import '../../styles/products.css';

const TrendingSection: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get('/api/products/trending')
      .then((res) => {
        if (res.data?.data?.products) {
          setProducts(res.data.data.products);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (!loading && products.length === 0) return null;

  return (
    <section className="section container" aria-labelledby="trending-title">
      <div className="section__header">
        <div>
          <h2 id="trending-title" className="section__title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Trending Now 🔥
          </h2>
          <p className="section__subtitle">Hottest items with peak customer engagement this week</p>
        </div>
      </div>

      <ProductGrid products={products} loading={loading} skeletonCount={4} />
    </section>
  );
};

export default TrendingSection;
