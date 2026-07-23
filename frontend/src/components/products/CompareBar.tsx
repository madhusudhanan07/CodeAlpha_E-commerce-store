/**
 * CompareBar.tsx — Floating Product Comparison Bar
 *
 * Appears at the bottom of the viewport when 1-4 products are selected for comparison.
 */

import { Link } from 'react-router-dom';
import { useCompare } from '../../context/CompareContext';
import { Scale, X } from 'lucide-react';
import '../../styles/products.css';

const CompareBar: React.FC = () => {
  const { compareList, removeFromCompare, clearCompare } = useCompare();

  if (compareList.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9990,
        background: 'rgba(22, 22, 30, 0.92)',
        backdropFilter: 'blur(12px)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        padding: '0.75rem 1.25rem',
        boxShadow: 'var(--shadow-xl)',
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
        maxWidth: '90vw',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Scale className="w-5 h-5 text-indigo-400" />
        <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-text)' }}>
          Compare ({compareList.length}/4)
        </span>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        {compareList.map((product) => (
          <div
            key={product.id}
            style={{
              position: 'relative',
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              border: '1px solid var(--color-border)',
            }}
          >
            <img src={product.image_url || 'https://placehold.co/50'} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <button
              type="button"
              onClick={() => removeFromCompare(product.id)}
              style={{
                position: 'absolute',
                top: '2px',
                right: '2px',
                background: 'rgba(0,0,0,0.7)',
                color: '#fff',
                border: 'none',
                borderRadius: '50%',
                width: '16px',
                height: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <Link to="/compare" className="hero__btn--primary" style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}>
          Compare Now
        </Link>
        <button type="button" onClick={clearCompare} className="hero__btn--ghost" style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}>
          Clear
        </button>
      </div>
    </div>
  );
};

export default CompareBar;
