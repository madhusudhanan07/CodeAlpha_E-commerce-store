/**
 * FrequentlyBought.tsx — Frequently Bought Together Accessory Bundles
 *
 * Displays main product with complementary accessories, checkboxes,
 * live subtotal calculation, and instant "Add Selected to Cart" CTA.
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../services/axiosInstance';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import type { Product } from '../../types';
import { Plus, ShoppingCart } from 'lucide-react';
import '../../styles/products.css';

interface FrequentlyBoughtProps {
  productId: number;
  mainProduct: Product;
}

const FrequentlyBought: React.FC<FrequentlyBoughtProps> = ({ productId, mainProduct }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();

  const [accessories, setAccessories] = useState<Product[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingBundle, setAddingBundle] = useState(false);

  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get(`/api/products/${productId}/frequently-bought`)
      .then((res) => {
        if (res.data?.data?.accessories) {
          const items: Product[] = res.data.data.accessories;
          setAccessories(items);
          setSelectedIds([mainProduct.id, ...items.map((i) => i.id)]);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [productId, mainProduct.id]);

  if (loading || accessories.length === 0) return null;

  const allItems = [mainProduct, ...accessories];
  const checkedItems = allItems.filter((item) => selectedIds.includes(item.id));
  const subtotal = checkedItems.reduce((acc, item) => acc + Number(item.price), 0);
  const bundleDiscount = 15;
  const bundleTotal = Number((subtotal * (1 - bundleDiscount / 100)).toFixed(2));

  const toggleSelect = (id: number) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length === 1) return; // Must keep at least 1 checked
      setSelectedIds((prev) => prev.filter((i) => i !== id));
    } else {
      setSelectedIds((prev) => [...prev, id]);
    }
  };

  const handleAddBundleToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to add items to your cart.');
      navigate('/login');
      return;
    }

    setAddingBundle(true);
    try {
      for (const item of checkedItems) {
        await addToCart(item.id, 1);
      }
      toast.success(`Added ${checkedItems.length} bundle items to cart!`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to add bundle to cart.');
    } finally {
      setAddingBundle(false);
    }
  };

  return (
    <section className="section container" aria-labelledby="freq-title" style={{ paddingTop: '2rem' }}>
      <div className="section__header">
        <div>
          <h2 id="freq-title" className="section__title">Frequently Bought Together</h2>
          <p className="section__subtitle">Bundle & Save {bundleDiscount}% on recommended accessories</p>
        </div>
      </div>

      <div
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.5rem',
          display: 'grid',
          gridTemplateColumns: '1fr 260px',
          gap: '2rem',
        }}
      >
        {/* Bundle Items List */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            {allItems.map((item, idx) => (
              <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ position: 'relative', width: '90px', height: '90px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                  <img src={item.image_url || 'https://placehold.co/100'} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(item.id)}
                    onChange={() => toggleSelect(item.id)}
                    style={{ position: 'absolute', top: '6px', left: '6px', width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                </div>
                {idx < allItems.length - 1 && <Plus className="w-5 h-5 text-gray-500" />}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {allItems.map((item) => (
              <label key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={selectedIds.includes(item.id)} onChange={() => toggleSelect(item.id)} />
                <span style={{ color: selectedIds.includes(item.id) ? 'var(--color-text)' : 'var(--color-text-muted)' }}>
                  <strong>{item.id === mainProduct.id ? 'This Item: ' : ''}</strong>
                  {item.name} — <span style={{ color: 'var(--color-primary-light)', fontWeight: 700 }}>${Number(item.price).toFixed(2)}</span>
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Bundle Total & CTA Panel */}
        <div style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Total Bundle Price:</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text)' }}>${bundleTotal.toFixed(2)}</span>
            <span style={{ textDecoration: 'line-through', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>${subtotal.toFixed(2)}</span>
          </div>

          <button
            type="button"
            className="hero__btn--primary"
            onClick={handleAddBundleToCart}
            disabled={addingBundle || checkedItems.length === 0}
            style={{ width: '100%', fontSize: '0.85rem' }}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {addingBundle ? 'Adding Bundle…' : `Add ${checkedItems.length} Items to Cart`}
          </button>
        </div>
      </div>
    </section>
  );
};

export default FrequentlyBought;
