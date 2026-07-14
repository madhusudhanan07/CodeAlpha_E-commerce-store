/**
 * ProductsPage.tsx — Full Product Catalogue
 *
 * Features:
 *  - Debounced search input
 *  - Category filter chips (derived from loaded products)
 *  - Result count label
 *  - URL sync: reads ?search= and ?category= from query params on mount
 */

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { fetchProducts } from '../services/productService';
import ProductGrid from '../components/products/ProductGrid';
import SearchBar from '../components/products/SearchBar';
import ProductFilters from '../components/products/ProductFilters';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import type { Product } from '../types';
import '../styles/products.css';

// ── Debounce helper ───────────────────────────────────────────────────────────
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

// ── Component ─────────────────────────────────────────────────────────────────
const ProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();

  // ── State ──────────────────────────────────────────────────────────────────
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchInput, setSearchInput] = useState(searchParams.get('search') ?? '');
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') ?? '');

  const debouncedSearch = useDebounce(searchInput, 350);

  // ── Load all products on mount ─────────────────────────────────────────────
  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchProducts()
      .then((res) => setAllProducts(res.products))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // ── Sync filters → URL ─────────────────────────────────────────────────────
  useEffect(() => {
    const params: Record<string, string> = {};
    if (debouncedSearch) params.search = debouncedSearch;
    if (activeCategory) params.category = activeCategory;
    setSearchParams(params, { replace: true });
  }, [debouncedSearch, activeCategory, setSearchParams]);

  // ── Derived categories list (unique, from loaded data) ────────────────────
  const categories = useMemo(() => {
    const seen = new Map<string, string>();
    allProducts.forEach((p) => seen.set(p.category_slug, p.category_name));
    return Array.from(seen, ([slug, name]) => ({ slug, name }));
  }, [allProducts]);

  // ── Filtered products ──────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = allProducts;

    if (activeCategory) {
      list = list.filter((p) => p.category_slug === activeCategory);
    }

    if (debouncedSearch.trim()) {
      const term = debouncedSearch.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          (p.description ?? '').toLowerCase().includes(term),
      );
    }

    return list;
  }, [allProducts, activeCategory, debouncedSearch]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleCategoryChange = useCallback((slug: string) => {
    setActiveCategory(slug);
    setSearchInput('');
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchInput(value);
    if (value) setActiveCategory('');
  }, []);

  const handleAddToCart = useCallback(async (product: Product) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to add items to your cart.');
      navigate('/login');
      return;
    }
    try {
      await addToCart(product.id, 1);
      toast.success(`"${product.name}" added to cart!`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to add to cart.');
    }
  }, [isAuthenticated, navigate, addToCart]);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <main className="products-page container" aria-label="Product catalogue">
      {/* Page heading */}
      <header className="products-page__header">
        <h1 className="products-page__title">Our Products</h1>
        <p className="products-page__subtitle">
          Discover {allProducts.length > 0 ? `${allProducts.length}+` : ''} carefully
          curated items across electronics, fashion, books and more.
        </p>
      </header>

      {/* Controls row */}
      <div className="products-page__controls">
        <SearchBar
          value={searchInput}
          onChange={handleSearchChange}
          placeholder="Search products…"
        />
        <ProductFilters
          categories={categories}
          active={activeCategory}
          onChange={handleCategoryChange}
        />
      </div>

      {/* Result count */}
      {!loading && !error && (
        <p className="products-page__count">
          Showing <strong>{filtered.length}</strong>{' '}
          {filtered.length === 1 ? 'product' : 'products'}
          {activeCategory && ` in "${categories.find((c) => c.slug === activeCategory)?.name ?? activeCategory}"`}
          {debouncedSearch && ` matching "${debouncedSearch}"`}
        </p>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="empty-state">
          <span className="empty-state__icon">⚠️</span>
          <p className="empty-state__title">Failed to load products</p>
          <p className="empty-state__desc">{error}</p>
        </div>
      )}

      {/* Grid */}
      {!error && (
        <ProductGrid
          products={filtered}
          loading={loading}
          skeletonCount={8}
          emptyTitle="No products found"
          emptyDesc="Try clearing your filters or searching with a different term."
          onAddToCart={handleAddToCart}
        />
      )}
    </main>
  );
};

export default ProductsPage;
