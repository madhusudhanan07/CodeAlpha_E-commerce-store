/**
 * seedRecommendations.js — Recommendation Engine Seeder (Firestore)
 *
 * Populates frequently_bought accessory bundles in Firestore.
 * Product popularity is derived dynamically from Firestore data,
 * so no separate metrics table needs seeding.
 */

import db from '../config/db.js';
import * as FrequentlyBoughtModel from '../models/FrequentlyBought.js';
import * as ProductPopularityModel from '../models/ProductPopularity.js';

export const seedRecommendations = async () => {
  try {
    const snap = await db.collection('products').get();
    if (snap.empty) return;

    const products = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    // Check if frequently_bought data already exists
    const fbSnap = await db.collection('frequently_bought').limit(1).get();
    if (!fbSnap.empty) return; // Already seeded

    // 1. Seed Frequently Bought Pairs
    const bundlePairs = [];
    for (const product of products) {
      // Find 2 accessories from same category or adjacent products
      const accessories = products.filter((p) => p.id !== product.id).slice(0, 2);
      for (const acc of accessories) {
        bundlePairs.push({
          product_id: product.id,
          accessory_id: acc.id,
          bundle_discount: 15,
        });
      }
    }

    if (bundlePairs.length > 0) {
      // Batch in groups of 500 (Firestore batch limit)
      const chunkSize = 400;
      for (let i = 0; i < bundlePairs.length; i += chunkSize) {
        await FrequentlyBoughtModel.bulkCreate(bundlePairs.slice(i, i + chunkSize));
      }
    }

    // 2. Product popularity is dynamic — no seeding needed in Firestore
    await ProductPopularityModel.seedMetrics([]);
  } catch (err) {
    console.error('Error seeding recommendations:', err.message);
  }
};

seedRecommendations();
