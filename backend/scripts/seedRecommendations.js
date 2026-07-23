/**
 * seedRecommendations.js — Automated Recommendation Engine Seeder
 *
 * Populates frequently_bought accessory bundles and product_popularity metrics in MySQL.
 */

import pool from '../config/db.js';
import * as FrequentlyBoughtModel from '../models/FrequentlyBought.js';
import * as ProductPopularityModel from '../models/ProductPopularity.js';

export const seedRecommendations = async () => {
  try {
    const [products] = await pool.query('SELECT id, name, category_id FROM products');
    if (!products || products.length === 0) return;

    // 1. Seed Frequently Bought Pairs
    const bundlePairs = [];
    for (const product of products) {
      // Find 2-3 potential accessories from same or complementary category
      const accessories = products.filter((p) => p.id !== product.id).slice(0, 3);
      for (const acc of accessories) {
        bundlePairs.push({
          product_id: product.id,
          accessory_id: acc.id,
          bundle_discount: 15,
        });
      }
    }
    if (bundlePairs.length > 0) {
      await FrequentlyBoughtModel.bulkCreate(bundlePairs);
    }

    // 2. Seed Product Popularity Metrics
    const metrics = products.map((p, idx) => {
      const soldCount = Math.floor(Math.random() * 300) + 50;
      const viewCount = Math.floor(Math.random() * 2000) + 500;
      const wishlistCount = Math.floor(Math.random() * 150) + 20;
      const popularityScore = soldCount * 3 + wishlistCount * 2 + Math.floor(viewCount / 10);
      return {
        product_id: p.id,
        sold_count: soldCount,
        view_count: viewCount,
        wishlist_count: wishlistCount,
        popularity_score: popularityScore,
      };
    });

    await ProductPopularityModel.seedMetrics(metrics);
  } catch (err) {
    console.error('Error seeding recommendations:', err.message);
  }
};

seedRecommendations();
