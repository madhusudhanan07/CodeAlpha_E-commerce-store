/**
 * WishlistContext.tsx — Global Wishlist (Favorites) State Management
 *
 * Persists wishlist in MySQL for authenticated users and in localStorage for guest users.
 */

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import axiosInstance from '../services/axiosInstance';
import { useAuth } from './AuthContext';
import type { Product, WishlistState } from '../types';

interface WishlistContextValue extends WishlistState {
  loading: boolean;
  error: string | null;
  fetchWishlist: () => Promise<void>;
  isInWishlist: (productId: number) => boolean;
  toggleWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (productId: number) => Promise<void>;
}

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, loading: authLoading } = useAuth();
  const [state, setState] = useState<WishlistState>({ wishlist: [], count: 0 });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWishlist = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (!currentUser) {
      // Guest mode: load from localStorage
      try {
        const stored = localStorage.getItem('codealpha_guest_wishlist');
        const list: Product[] = stored ? JSON.parse(stored) : [];
        setState({ wishlist: list, count: list.length });
      } catch {
        setState({ wishlist: [], count: 0 });
      }
      setLoading(false);
      return;
    }

    // Logged-in mode: fetch from MySQL
    try {
      const res = await axiosInstance.get('/api/wishlist');
      if (res.data && res.data.data) {
        setState(res.data.data);
      }
    } catch (err: any) {
      console.error('Error fetching wishlist:', err);
      const msg = err.response?.data?.message || err.message || 'Failed to fetch wishlist';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (!authLoading) {
      fetchWishlist();
    }
  }, [currentUser, authLoading, fetchWishlist]);

  const isInWishlist = useCallback(
    (productId: number): boolean => {
      return state.wishlist.some((item) => item.id === productId);
    },
    [state.wishlist],
  );

  const toggleWishlist = async (product: Product) => {
    const isSaved = isInWishlist(product.id);

    if (!currentUser) {
      // Guest mode toggle
      let updated: Product[];
      if (isSaved) {
        updated = state.wishlist.filter((item) => item.id !== product.id);
      } else {
        updated = [...state.wishlist, product];
      }
      localStorage.setItem('codealpha_guest_wishlist', JSON.stringify(updated));
      setState({ wishlist: updated, count: updated.length });
      return;
    }

    // Logged-in mode API toggle
    try {
      if (isSaved) {
        const res = await axiosInstance.delete(`/api/wishlist/${product.id}`);
        if (res.data && res.data.data) {
          setState(res.data.data);
        }
      } else {
        const res = await axiosInstance.post('/api/wishlist', { product_id: product.id });
        if (res.data && res.data.data) {
          setState(res.data.data);
        }
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.message || err.message || 'Failed to update wishlist');
    }
  };

  const removeFromWishlist = async (productId: number) => {
    if (!currentUser) {
      const updated = state.wishlist.filter((item) => item.id !== productId);
      localStorage.setItem('codealpha_guest_wishlist', JSON.stringify(updated));
      setState({ wishlist: updated, count: updated.length });
      return;
    }

    try {
      const res = await axiosInstance.delete(`/api/wishlist/${productId}`);
      if (res.data && res.data.data) {
        setState(res.data.data);
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.message || err.message || 'Failed to remove from wishlist');
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        ...state,
        loading,
        error,
        fetchWishlist,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = (): WishlistContextValue => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
