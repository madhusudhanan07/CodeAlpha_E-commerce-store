/**
 * seedProductDetails.js — Category-Matched Seeder for Product Details
 *
 * Populates 8-12 category-matched technical specifications and
 * 5 realistic customer reviews per product in MySQL.
 */

import pool from '../config/db.js';
import * as ProductGalleryModel from '../models/ProductGallery.js';
import * as ProductSpecificationModel from '../models/ProductSpecification.js';
import * as ProductReviewModel from '../models/ProductReview.js';

const CATEGORY_SPECS = {
  1: [ // Electronics / Laptop / Phone
    { spec_key: 'Processor / Chipset', spec_value: 'Apple M3 / Snapdragon 8 Gen 3 / Intel Core i7' },
    { spec_key: 'RAM Memory',          spec_value: '16GB LPDDR5 High-Speed' },
    { spec_key: 'Internal Storage',    spec_value: '512GB NVMe PCIe 4.0 SSD' },
    { spec_key: 'Display Technology',  spec_value: '6.7-inch Super Retina XDR OLED (120Hz)' },
    { spec_key: 'Graphics Card',       spec_value: 'Integrated 10-Core Ultra GPU' },
    { spec_key: 'Battery Life',        spec_value: 'Up to 22 Hours Continuous Video Playback' },
    { spec_key: 'Charging Speed',      spec_value: '67W Fast Charging (50% in 25 mins)' },
    { spec_key: 'Operating System',    spec_value: 'macOS Sonoma / iOS 17 / Windows 11 Pro' },
    { spec_key: 'Wireless Connectivity', spec_value: 'Wi-Fi 6E, Bluetooth 5.3, 5G Dual SIM' },
    { spec_key: 'Device Weight',       spec_value: '1.24 kg (2.73 lbs)' },
    { spec_key: 'Manufacturer Warranty', spec_value: '1 Year Limited Global Warranty' },
  ],

  2: [ // Fashion & Apparel
    { spec_key: 'Fabric Material',     spec_value: '100% Organic Egyptian Cotton' },
    { spec_key: 'Garment Fit',         spec_value: 'Tailored Slim Fit' },
    { spec_key: 'Sleeve Length',       spec_value: 'Full Sleeves / Classic Short' },
    { spec_key: 'Wash Care Instructions', spec_value: 'Machine Wash Cold, Tumble Dry Low' },
    { spec_key: 'Occasion',            spec_value: 'Casual, Streetwear, Everyday Wear' },
    { spec_key: 'Country of Origin',   spec_value: 'Portugal' },
    { spec_key: 'Pattern Type',        spec_value: 'Solid Matte Finish' },
    { spec_key: 'Closure Type',        spec_value: 'Button-Down / Premium Zipper' },
    { spec_key: 'Breathability Rating', spec_value: 'High Airflow Weave' },
    { spec_key: 'Warranty',            spec_value: '6 Months Stitching Guarantee' },
  ],

  3: [ // Books
    { spec_key: 'Author',              spec_value: 'Renowned Bestselling Author' },
    { spec_key: 'Publisher',           spec_value: 'Penguin Random House / HarperCollins' },
    { spec_key: 'Language',            spec_value: 'English (Original Unabridged)' },
    { spec_key: 'Page Count',          spec_value: '384 Pages' },
    { spec_key: 'ISBN-13 Number',      spec_value: '978-0143127741' },
    { spec_key: 'Edition Type',        spec_value: 'Collector Hardcover Edition' },
    { spec_key: 'Book Format',         spec_value: 'Hardcover with Dust Jacket' },
    { spec_key: 'Genre / Topic',       spec_value: 'Self-Improvement & Productivity' },
    { spec_key: 'Item Weight',         spec_value: '480 grams' },
    { spec_key: 'Dimensions',          spec_value: '6.2 x 1.1 x 9.3 inches' },
  ],

  4: [ // Home & Kitchen
    { spec_key: 'Body Material',       spec_value: 'Brushed 18/10 Stainless Steel & BPA-Free Polymer' },
    { spec_key: 'Total Capacity',      spec_value: '1.8 Liters / 12 Cups' },
    { spec_key: 'Product Dimensions',   spec_value: '14.2 x 9.8 x 15.1 inches' },
    { spec_key: 'Power Consumption',   spec_value: '1500 Watts High Efficiency' },
    { spec_key: 'Voltage',             spec_value: '120V / 60Hz' },
    { spec_key: 'Color Finish',        spec_value: 'Matte Obsidian Black & Chrome' },
    { spec_key: 'Net Weight',          spec_value: '4.5 kg (9.9 lbs)' },
    { spec_key: 'Safety Features',     spec_value: 'Auto Shut-Off, Overheat Protection' },
    { spec_key: 'Cleaning Method',     spec_value: 'Dishwasher Safe Detachable Components' },
    { spec_key: 'Manufacturer Warranty', spec_value: '2 Year Full Replacement Warranty' },
  ],

  5: [ // Sports & Fitness
    { spec_key: 'Construction Material', spec_value: 'Aircraft Grade Aluminum & Composite Rubber' },
    { spec_key: 'Unit Weight',         spec_value: '2.5 kg' },
    { spec_key: 'Suitable For',        spec_value: 'Intermediate & Professional Athletes' },
    { spec_key: 'Grip Style',          spec_value: 'Non-Slip Ergonomic Textured Foam' },
    { spec_key: 'Durability Rating',   spec_value: 'Commercial Gym Grade' },
    { spec_key: 'Water Resistance',    spec_value: 'Sweat Resistant & Weatherproof' },
    { spec_key: 'Adjustability',       spec_value: 'Multi-Position Quick Adjustment' },
    { spec_key: 'Brand Origin',        spec_value: 'USA / Germany' },
    { spec_key: 'Product Dimensions',  spec_value: '42 x 12 x 8 cm' },
    { spec_key: 'Warranty',            spec_value: '3 Year Frame & Structural Guarantee' },
  ],

  6: [ // Beauty & Personal Care
    { spec_key: 'Target Skin / Hair',  spec_value: 'All Skin Types / Sensitive Formulation' },
    { spec_key: 'Net Volume',          spec_value: '100ml / 3.4 fl oz' },
    { spec_key: 'Key Ingredients',     spec_value: 'Hyaluronic Acid, Vitamin C & Botanical Extracts' },
    { spec_key: 'Formulation',         spec_value: 'Dermatologically Tested Serum' },
    { spec_key: 'Application Method',  spec_value: 'Apply 2-3 drops morning and night' },
    { spec_key: 'Gender Compatibility', spec_value: 'Unisex' },
    { spec_key: 'Cruelty-Free Status', spec_value: '100% Vegan & Paraben-Free' },
    { spec_key: 'Shelf Life',          spec_value: '24 Months from Manufacture Date' },
    { spec_key: 'Country of Origin',   spec_value: 'France' },
  ],

  7: [ // Bags & Accessories
    { spec_key: 'Outer Material',      spec_value: 'Full-Grain Italian Leather' },
    { spec_key: 'Inner Lining',        spec_value: 'Soft Microfiber Velvet Lining' },
    { spec_key: 'Compartments',        spec_value: '1 Padded Laptop Sleeve + 4 Quick-Access Pockets' },
    { spec_key: 'Zipper & Hardware',   spec_value: 'YKK Japanese Brass Zippers' },
    { spec_key: 'Water Resistance',    spec_value: 'Water-Repellent Coating' },
    { spec_key: 'Strap Adjustment',    spec_value: 'Padded Adjustable Shoulder Straps' },
    { spec_key: 'Product Dimensions',  spec_value: '18 x 12 x 6 inches' },
    { spec_key: 'Capacity Volume',     spec_value: '24 Liters' },
    { spec_key: 'Warranty',            spec_value: 'Lifetime Craftsmanship Guarantee' },
  ],

  8: [ // Gaming
    { spec_key: 'Platform Compatibility', spec_value: 'PC, PlayStation 5, Xbox Series X, Nintendo Switch' },
    { spec_key: 'Connectivity',        spec_value: '2.4GHz Ultra-Low Latency Wireless + Bluetooth' },
    { spec_key: 'Sensor Type',         spec_value: 'HERO 25K High Precision Optical Sensor' },
    { spec_key: 'DPI Resolution',      spec_value: '100 - 25,600 DPI Customizable' },
    { spec_key: 'RGB Lighting',        spec_value: '16.8M Color Lightsync Per-Key RGB' },
    { spec_key: 'Switch Type',         spec_value: 'Tactile Mechanical Switches (80M Clicks)' },
    { spec_key: 'Battery Duration',    spec_value: 'Up to 90 Hours Continuous Gameplay' },
    { spec_key: 'Polling Rate',        spec_value: '1000Hz (1ms Response Rate)' },
    { spec_key: 'Item Weight',         spec_value: '63 grams Ultra-Lightweight' },
    { spec_key: 'Warranty',            spec_value: '2 Year Gaming Replacement Warranty' },
  ],
};

const SAMPLE_REVIEWS = [
  { name: 'Marcus Vance',    rating: 5, comment: 'Outstanding performance and premium feel! Worth every dollar spent.' },
  { name: 'Sarah Chen',      rating: 5, comment: 'Sleek design, works flawlessly as advertised. Delivery was fast too.' },
  { name: 'David Miller',    rating: 4, comment: 'Very high quality product. Fits great and handles heavy daily use easily.' },
  { name: 'Elena Rostova',   rating: 5, comment: 'Five stars! Exceeded my expectations in every aspect.' },
  { name: 'James Patterson', rating: 5, comment: 'Top tier build and packaging. Extremely satisfied with this purchase!' },
];

export const seedProductDetails = async () => {
  try {
    const [products] = await pool.query('SELECT id, name, slug, price, category_id FROM products');
    if (!products || products.length === 0) return;

    for (const product of products) {
      const catId = product.category_id || 1;
      const targetSpecs = CATEGORY_SPECS[catId] || CATEGORY_SPECS[1];

      // Check current specs count
      const existingSpecs = await ProductSpecificationModel.findByProductId(product.id);
      if (existingSpecs.length < 8) {
        // Clear old sparse specs and insert full 8-12 spec list
        await pool.query('DELETE FROM product_specifications WHERE product_id = ?', [product.id]);
        await ProductSpecificationModel.bulkCreate(product.id, targetSpecs);
      }

      // Check reviews count
      const existingReviews = await ProductReviewModel.findByProductId(product.id);
      if (existingReviews.length < 5) {
        await pool.query('DELETE FROM product_reviews WHERE product_id = ?', [product.id]);
        const reviewsToInsert = SAMPLE_REVIEWS.map((rev) => ({
          user_name: rev.name,
          user_avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(rev.name)}&background=6c63ff&color=fff`,
          rating: rev.rating,
          review: rev.comment,
          verified_purchase: true,
        }));
        await ProductReviewModel.bulkCreate(product.id, reviewsToInsert);
      }
    }
  } catch (err) {
    console.error('Error seeding product details:', err.message);
  }
};

seedProductDetails();
