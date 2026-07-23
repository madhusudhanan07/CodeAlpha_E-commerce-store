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
const ITEMS_PER_PAGE = 12;

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';

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
  const [sortBy, setSortBy] = useState<SortOption>((searchParams.get('sort') as SortOption) || 'default');
  const [currentPage, setCurrentPage] = useState<number>(Number(searchParams.get('page')) || 1);

  const debouncedSearch = useDebounce(searchInput, 350);

  // ── Load all products ──────────────────────────────────────────────────────
  const loadProducts = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchProducts()
      .then((res) => setAllProducts(res.products))
      .catch((err: Error) => setError(err.message || 'Failed to load products.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // ── Sync filters → URL ─────────────────────────────────────────────────────
  useEffect(() => {
    const params: Record<string, string> = {};
    if (debouncedSearch) params.search = debouncedSearch;
    if (activeCategory) params.category = activeCategory;
    if (sortBy !== 'default') params.sort = sortBy;
    if (currentPage > 1) params.page = String(currentPage);
    setSearchParams(params, { replace: true });
  }, [debouncedSearch, activeCategory, sortBy, currentPage, setSearchParams]);

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, activeCategory, sortBy]);

  // ── Derived categories list ───────────────────────────────────────────────
  const categories = useMemo(() => {
    const seen = new Map<string, string>();
    allProducts.forEach((p) => seen.set(p.category_slug, p.category_name));
    return Array.from(seen, ([slug, name]) => ({ slug, name }));
  }, [allProducts]);

  // ── Filtered & Sorted products ─────────────────────────────────────────────
  const sortedProducts = useMemo(() => {
    let list = [...allProducts];

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

    switch (sortBy) {
      case 'price-asc':
        return list.sort((a, b) => Number(a.price) - Number(b.price));
      case 'price-desc':
        return list.sort((a, b) => Number(b.price) - Number(a.price));
      case 'name-asc':
        return list.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return list.sort((a, b) => b.name.localeCompare(a.name));
      default:
        return list;
    }
  }, [allProducts, activeCategory, debouncedSearch, sortBy]);

  // ── Paginated products ─────────────────────────────────────────────────────
  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedProducts, currentPage]);

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

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', width: '100%', justifyContent: 'space-between' }}>
          <ProductFilters
            categories={categories}
            active={activeCategory}
            onChange={handleCategoryChange}
          />

          {/* Sort Dropdown */}
          <div className="products-page__sort">
            <label htmlFor="price-sort-select" className="products-page__sort-label">Sort by:</label>
            <select
              id="price-sort-select"
              className="products-page__sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
            >
              <option value="default">Featured / Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
            </select>
          </div>
        </div>
      </div>

      {/* Result count */}
      {!loading && !error && (
        <p className="products-page__count">
          Showing <strong>{paginatedProducts.length}</strong> of <strong>{sortedProducts.length}</strong>{' '}
          {sortedProducts.length === 1 ? 'product' : 'products'}
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
          <button
            className="product-card__btn"
            style={{ marginTop: '1rem' }}
            onClick={loadProducts}
          >
            Retry
          </button>
        </div>
      )}

      {/* Grid */}
      {!error && (
        <>
          <ProductGrid
            products={paginatedProducts}
            loading={loading}
            skeletonCount={8}
            emptyTitle="No products found"
            emptyDesc="Try clearing your filters or searching with a different term."
            onAddToCart={handleAddToCart}
          />

          {/* Pagination Controls */}
          {!loading && totalPages > 1 && (
            <nav className="products-page__pagination" aria-label="Pagination Navigation">
              <button
                className="pagination-btn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`pagination-btn ${page === currentPage ? 'pagination-btn--active' : ''}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
              <button
                className="pagination-btn"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </button>
            </nav>
          )}
        </>
      )}
    </main>
  );
};

export default ProductsPage;
