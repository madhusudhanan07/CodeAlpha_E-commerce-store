/**
 * CompareContext.tsx — Global Product Comparison Context
 *
 * Manages list of up to 4 selected products for side-by-side comparison.
 * Persists selected comparison list in localStorage.
 */

import { createContext, useContext, useState, useEffect } from 'react';
import type { Product } from '../types';
import toast from 'react-hot-toast';

interface CompareContextType {
  compareList: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: number) => void;
  isInCompare: (productId: number) => boolean;
  clearCompare: () => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const CompareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [compareList, setCompareList] = useState<Product[]>(() => {
    try {
      const stored = localStorage.getItem('codealpha_compare_list');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('codealpha_compare_list', JSON.stringify(compareList));
    } catch {
      // ignore storage errors
    }
  }, [compareList]);

  const addToCompare = (product: Product) => {
    if (compareList.some((p) => p.id === product.id)) {
      toast.error(`"${product.name}" is already in comparison.`);
      return;
    }
    if (compareList.length >= 4) {
      toast.error('You can compare a maximum of 4 products at a time.');
      return;
    }
    setCompareList((prev) => [...prev, product]);
    toast.success(`Added "${product.name}" to comparison!`);
  };

  const removeFromCompare = (productId: number) => {
    setCompareList((prev) => prev.filter((p) => p.id !== productId));
  };

  const isInCompare = (productId: number) => {
    return compareList.some((p) => p.id === productId);
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  return (
    <CompareContext.Provider
      value={{ compareList, addToCompare, removeFromCompare, isInCompare, clearCompare }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error('useCompare must be used within CompareProvider');
  return ctx;
};
