/**
 * ComparePage.tsx — Side-by-Side Product Comparison View
 *
 * Compares up to 4 selected products side-by-side: Image, Name, Price, Category, Rating,
 * Stock Status, and Technical Specifications matrix.
 */

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCompare } from '../context/CompareContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../services/axiosInstance';
import toast from 'react-hot-toast';
import type { Product } from '../types';
import { Scale, ShoppingCart, Trash2, ArrowLeft, Star } from 'lucide-react';
import '../styles/products.css';

const ComparePage: React.FC = () => {
  const navigate = useNavigate();
  const { compareList, removeFromCompare, clearCompare } = useCompare();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (compareList.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const idsParam = compareList.map((p) => p.id).join(',');
    axiosInstance
      .get(`/api/products/compare?ids=${idsParam}`)
      .then((res) => {
        if (res.data?.data?.products) {
          setProducts(res.data.data.products);
        }
      })
      .catch(() => setProducts(compareList))
      .finally(() => setLoading(false));
  }, [compareList]);

  const handleAddToCart = async (product: Product) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to add items to your cart.');
      navigate('/login');
      return;
    }
    try {
      await addToCart(product.id, 1);
      toast.success(`"${product.name}" added to cart!`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to add item to cart.');
    }
  };

  if (!loading && products.length === 0) {
    return (
      <main className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <div className="empty-state">
          <Scale className="w-16 h-16 text-indigo-400" style={{ margin: '0 auto 1rem' }} />
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text)' }}>No Products Selected for Comparison</h1>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>Select up to 4 products from the catalogue to compare side-by-side.</p>
          <Link to="/products" className="hero__btn--primary">Browse Products</Link>
        </div>
      </main>
    );
  }

  // Find lowest price among compared products for highlighting
  const minPrice = Math.min(...products.map((p) => Number(p.price)));

  // Collect all unique specification keys across all compared products
  const allSpecKeys = Array.from(
    new Set(
      products.flatMap((p) => p.specifications?.map((s) => s.spec_key) || []),
    ),
  );

  return (
    <main className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <button type="button" onClick={() => navigate(-1)} className="product-details__back-btn" style={{ marginBottom: '0.5rem' }}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </button>
          <h1 className="section__title" style={{ fontSize: '1.8rem' }}>Product Comparison</h1>
          <p className="section__subtitle">Comparing {products.length} products</p>
        </div>

        <button type="button" onClick={clearCompare} className="hero__btn--ghost" style={{ fontSize: '0.85rem' }}>
          <Trash2 className="w-4 h-4 mr-2 text-red-400" /> Clear Comparison
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="specs-table" style={{ width: '100%', minWidth: '700px', borderCollapse: 'separate', borderSpacing: '0' }}>
          <thead>
            <tr>
              <th style={{ width: '200px', background: 'var(--color-surface-2)', verticalAlign: 'bottom' }}>Product Info</th>
              {products.map((product) => (
                <th key={product.id} style={{ width: `${80 / products.length}%`, textTransform: 'none', verticalAlign: 'top', background: 'var(--color-surface)' }}>
                  <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '0.75rem' }}>
                    <button
                      type="button"
                      onClick={() => removeFromCompare(product.id)}
                      style={{ position: 'absolute', top: 0, right: 0, background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4 hover:text-red-400" />
                    </button>

                    <div style={{ width: '120px', height: '120px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                      <img src={product.image_url || 'https://placehold.co/120'} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>

                    <Link to={`/products/${product.id}`} style={{ textDecoration: 'none', fontWeight: 700, color: 'var(--color-text)', fontSize: '0.95rem' }}>
                      {product.name}
                    </Link>

                    <button
                      type="button"
                      className="hero__btn--primary"
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0}
                      style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem', width: '100%' }}
                    >
                      <ShoppingCart className="w-3.5 h-3.5 mr-1" /> Add to Cart
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Price Row */}
            <tr>
              <td style={{ fontWeight: 700 }}>Price</td>
              {products.map((p) => {
                const isBestPrice = Number(p.price) === minPrice;
                return (
                  <td key={p.id} style={{ color: isBestPrice ? '#4ade80' : 'var(--color-text)', fontWeight: 800, fontSize: '1.1rem' }}>
                    ${Number(p.price).toFixed(2)}
                    {isBestPrice && <span style={{ fontSize: '10px', background: 'rgba(74,222,128,0.15)', color: '#4ade80', marginLeft: '0.5rem', padding: '2px 6px', borderRadius: '4px' }}>Lowest</span>}
                  </td>
                );
              })}
            </tr>

            {/* Category Row */}
            <tr>
              <td style={{ fontWeight: 700 }}>Category</td>
              {products.map((p) => (
                <td key={p.id}>{p.category_name}</td>
              ))}
            </tr>

            {/* Rating Row */}
            <tr>
              <td style={{ fontWeight: 700 }}>Rating</td>
              {products.map((p) => (
                <td key={p.id}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Star className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                    <strong>{p.average_rating || 4.8}</strong> ({p.review_count || 12})
                  </div>
                </td>
              ))}
            </tr>

            {/* Stock Status Row */}
            <tr>
              <td style={{ fontWeight: 700 }}>Stock Availability</td>
              {products.map((p) => (
                <td key={p.id}>
                  {p.stock > 0 ? (
                    <span style={{ color: '#4ade80', fontWeight: 600 }}>In Stock ({p.stock} units)</span>
                  ) : (
                    <span style={{ color: '#ef4444', fontWeight: 600 }}>Out of Stock</span>
                  )}
                </td>
              ))}
            </tr>

            {/* Dynamic Specifications Matrix Rows */}
            {allSpecKeys.map((specKey) => (
              <tr key={specKey}>
                <td style={{ fontWeight: 700 }}>{specKey}</td>
                {products.map((p) => {
                  const match = p.specifications?.find((s) => s.spec_key === specKey);
                  return <td key={p.id}>{match ? match.spec_value : '—'}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default ComparePage;
