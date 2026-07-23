/**
 * BestSellerSection.tsx — Top Best Selling Products Grid
 *
 * Displays products sorted by sales volume and popularity metrics from MySQL.
 */

import { useEffect, useState } from 'react';
import axiosInstance from '../../services/axiosInstance';
import ProductGrid from '../products/ProductGrid';
import type { Product } from '../../types';
import '../../styles/products.css';

const BestSellerSection: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get('/api/products/best-sellers')
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
    <section className="section container" aria-labelledby="bestseller-title">
      <div className="section__header">
        <div>
          <h2 id="bestseller-title" className="section__title">Best Sellers</h2>
          <p className="section__subtitle">Top customer favorites ordered by total sales volume</p>
        </div>
      </div>

      <ProductGrid products={products} loading={loading} skeletonCount={4} />
    </section>
  );
};

export default BestSellerSection;
