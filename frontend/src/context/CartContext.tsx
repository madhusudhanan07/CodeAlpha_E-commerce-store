/**
 * CartContext.tsx — Global Shopping Cart State Management
 *
 * Provides functions to interact with the backend API and
 * distributes the active cart state (items, total, count) to components.
 */

import { createContext, useContext, useEffect, useState } from 'react';
import axiosInstance from '../services/axiosInstance';
import { useAuth } from './AuthContext';
import type { CartState } from '../types';

interface CartContextValue extends CartState {
  loading: boolean;
  error: string | null;
  fetchCart: () => Promise<void>;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, loading: authLoading } = useAuth();
  const [state, setState] = useState<CartState>({ cart: [], count: 0, total_price: 0 });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = async () => {
    if (!currentUser) {
      setState({ cart: [], count: 0, total_price: 0 });
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get('/api/cart');
      if (res.data && res.data.data) {
        setState(res.data.data);
      }
    } catch (err: any) {
      console.error('Error fetching cart:', err);
      // Ignore 404 for missing cart; otherwise log
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchCart();
    }
  }, [currentUser, authLoading]);

  const addToCart = async (productId: number, quantity = 1) => {
    try {
      const res = await axiosInstance.post('/api/cart', { product_id: productId, quantity });
      if (res.data && res.data.data) {
        setState(res.data.data);
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to add item to cart');
    }
  };

  const updateQuantity = async (productId: number, quantity: number) => {
    try {
      const res = await axiosInstance.put(`/api/cart/${productId}`, { quantity });
      if (res.data && res.data.data) {
        setState(res.data.data);
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to update quantity');
    }
  };

  const removeFromCart = async (productId: number) => {
    try {
      const res = await axiosInstance.delete(`/api/cart/${productId}`);
      if (res.data && res.data.data) {
        setState(res.data.data);
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to remove item');
    }
  };

  const clearCart = async () => {
    try {
      const res = await axiosInstance.delete('/api/cart/clear');
      if (res.data && res.data.data) {
        setState(res.data.data);
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to clear cart');
    }
  };

  return (
    <CartContext.Provider
      value={{
        ...state,
        loading,
        error,
        fetchCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextValue => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
