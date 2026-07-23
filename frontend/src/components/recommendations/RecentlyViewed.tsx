/**
 * RecentlyViewed.tsx — Recently Viewed Products Strip
 *
 * Stores and renders up to 10 recently viewed products.
 * Uses localStorage for guests and syncs with MySQL for signed-in users.
 */

import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../services/axiosInstance';
import ProductCard from '../products/ProductCard';
import ProductCardSkeleton from '../products/ProductCardSkeleton';
import type { Product } from '../../types';
import '../../styles/products.css';

interface RecentlyViewedProps {
  currentProductId?: number;
}

const RecentlyViewed: React.FC<RecentlyViewedProps> = ({ currentProductId }) => {
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Record view on mount if currentProductId is passed
  useEffect(() => {
    if (!currentProductId) return;

    // Record in local storage for guest
    try {
      const stored = localStorage.getItem('codealpha_recently_viewed');
      let list: number[] = stored ? JSON.parse(stored) : [];
      list = [currentProductId, ...list.filter((id) => id !== currentProductId)].slice(0, 10);
      localStorage.setItem('codealpha_recently_viewed', JSON.stringify(list));
    } catch {
      // ignore storage errors
    }

    // Record in backend API
    const sessionId = localStorage.getItem('codealpha_session_id') || `guest-${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem('codealpha_session_id', sessionId);

    axiosInstance
      .post('/api/products/recently-viewed', {
        product_id: currentProductId,
        session_id: sessionId,
      })
      .catch(console.error);
  }, [currentProductId]);

  // Fetch recently viewed history
  useEffect(() => {
    setLoading(true);
    const sessionId = localStorage.getItem('codealpha_session_id') || '';

    axiosInstance
      .get(`/api/products/recently-viewed?session_id=${sessionId}`)
      .then((res) => {
        if (res.data?.data?.products) {
          const list: Product[] = res.data.data.products;
          // Filter out current product if on details page
          const filtered = currentProductId ? list.filter((p) => p.id !== currentProductId) : list;
          setProducts(filtered);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [isAuthenticated, currentProductId]);

  if (!loading && products.length === 0) return null;

  return (
    <section className="section container" aria-labelledby="recently-title">
      <div className="section__header">
        <div>
          <h2 id="recently-title" className="section__title">Recently Viewed</h2>
          <p className="section__subtitle">Pick up right where you left off</p>
        </div>
      </div>

      {loading ? (
        <div className="product-grid">
          {Array.from({ length: 4 }, (_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};

export default RecentlyViewed;
