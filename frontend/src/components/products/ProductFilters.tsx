/**
 * ProductFilters.tsx — Category filter chips
 *
 * Renders a row of clickable category buttons.
 * "All" chip always appears first.
 *
 * Props:
 *  - categories   : list of { slug, name } objects
 *  - active       : the currently selected slug ('' = All)
 *  - onChange     : called with the new slug ('' for All)
 */

interface Category {
  slug: string;
  name: string;
}

interface ProductFiltersProps {
  categories: Category[];
  active: string;
  onChange: (slug: string) => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  categories,
  active,
  onChange,
}) => {
  return (
    <nav className="product-filters" aria-label="Filter by category">
      {/* "All" chip */}
      <button
        id="filter-all"
        className={`product-filters__chip${active === '' ? ' product-filters__chip--active' : ''}`}
        onClick={() => onChange('')}
        aria-pressed={active === ''}
        type="button"
      >
        All
      </button>

      {categories.map(({ slug, name }) => (
        <button
          key={slug}
          id={`filter-${slug}`}
          className={`product-filters__chip${
            active === slug ? ' product-filters__chip--active' : ''
          }`}
          onClick={() => onChange(slug)}
          aria-pressed={active === slug}
          type="button"
        >
          {name}
        </button>
      ))}
    </nav>
  );
};

export default ProductFilters;
