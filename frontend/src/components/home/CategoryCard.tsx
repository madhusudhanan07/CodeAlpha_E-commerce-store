/**
 * CategoryCard.tsx — Reusable Light Theme Category Card Component
 *
 * Crisp white card featuring a rounded icon box with Lucide React SVG icon,
 * category title, and "Explore Collection →" CTA link with smooth hover lift & glow.
 */

import React, { type ComponentType } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export interface CategoryItem {
  slug: string;
  name: string;
  icon: ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
}

interface CategoryCardProps {
  category: CategoryItem;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const IconComponent = category.icon;

  return (
    <Link
      to={`/products?category=${category.slug}`}
      className="category-card-light"
    >
      <div className="cat-card-header">
        <div
          className="cat-icon-container"
          style={{
            background: category.iconBg,
            color: category.iconColor,
          }}
        >
          <IconComponent className="w-8 h-8 transition-transform duration-300 group-hover:scale-110" />
        </div>
      </div>

      <div className="cat-card-body">
        <h3 className="cat-title-text">{category.name}</h3>
        <span className="cat-cta-link">
          Explore Collection
          <ArrowRight className="cat-cta-arrow w-3.5 h-3.5" />
        </span>
      </div>
    </Link>
  );
};

export default CategoryCard;
