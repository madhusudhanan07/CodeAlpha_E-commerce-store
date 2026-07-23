/**
 * CategoriesSection.tsx — 10 Top Product Categories Grid
 *
 * Light-theme category grid with Lucide SVG icons matching the reference design mockup image:
 * Electronics, Fashion, Home & Living, Beauty, Sports, Books, Automotive, Gaming, Accessories, Furniture.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  Laptop,
  Shirt,
  Home,
  Sparkles,
  Dumbbell,
  BookOpen,
  Car,
  Gamepad2,
  ShoppingBag,
  Armchair,
} from 'lucide-react';
import CategoryCard, { type CategoryItem } from './CategoryCard';

const CATEGORIES: CategoryItem[] = [
  {
    slug: 'electronics',
    name: 'Electronics',
    icon: Laptop,
    iconBg: '#eff6ff',
    iconColor: '#2563eb',
  },
  {
    slug: 'fashion',
    name: 'Fashion',
    icon: Shirt,
    iconBg: '#fef2f2',
    iconColor: '#dc2626',
  },
  {
    slug: 'home-kitchen',
    name: 'Home & Living',
    icon: Home,
    iconBg: '#ecfdf5',
    iconColor: '#059669',
  },
  {
    slug: 'beauty-personal-care',
    name: 'Beauty',
    icon: Sparkles,
    iconBg: '#fdf2f8',
    iconColor: '#db2777',
  },
  {
    slug: 'sports-fitness',
    name: 'Sports',
    icon: Dumbbell,
    iconBg: '#fffbe8',
    iconColor: '#d97706',
  },
  {
    slug: 'books',
    name: 'Books',
    icon: BookOpen,
    iconColor: '#7c3aed',
    iconBg: '#f5f3ff',
  },
  {
    slug: 'automotive',
    name: 'Automotive',
    icon: Car,
    iconBg: '#f0f9ff',
    iconColor: '#0284c7',
  },
  {
    slug: 'gaming',
    name: 'Gaming',
    icon: Gamepad2,
    iconBg: '#faf5ff',
    iconColor: '#9333ea',
  },
  {
    slug: 'bags-accessories',
    name: 'Accessories',
    icon: ShoppingBag,
    iconBg: '#ffedd5',
    iconColor: '#ea580c',
  },
  {
    slug: 'furniture',
    name: 'Furniture',
    icon: Armchair,
    iconBg: '#f0fdf4',
    iconColor: '#16a34a',
  },
];

export const CategoriesSection: React.FC = () => {
  return (
    <section className="category-section-light" aria-labelledby="categories-heading">
      <div className="container">
        <div className="section__header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div className="section-icon-pill">
                <Layers className="w-5 h-5 text-blue-600" />
              </div>
              <h2 id="categories-heading" className="section__title" style={{ margin: 0 }}>
                Explore Categories
              </h2>
            </div>
            <p className="section__subtitle">
              Browse thousands of premium products across 10 top taxonomy collections
            </p>
          </div>
          <Link to="/products" className="section__link">
            View All Catalogue →
          </Link>
        </div>

        {/* 10 Category Cards Grid */}
        <div className="category-grid-5cols">
          {CATEGORIES.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
