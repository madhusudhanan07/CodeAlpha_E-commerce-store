/**
 * seedFirestore.js — One-Time Firestore Data Seeder
 *
 * Seeds all categories, 50 products with specifications, gallery images,
 * and 5 reviews each into Firebase Firestore.
 *
 * Run with: node backend/scripts/seedFirestore.js
 * (from the CodeAlpha_E-commerce-store root directory)
 *
 * Safe: checks if data already exists before inserting.
 * Idempotent: can be run multiple times safely.
 */

import 'dotenv/config';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';
import path from 'path';

// ── Initialize Firebase Admin ─────────────────────────────────────────────────
let serviceAccount = null;

if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
  } catch (err) {
    console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON:', err.message);
  }
} else if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
  try {
    const filePath = path.resolve(process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
    if (fs.existsSync(filePath)) {
      serviceAccount = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
  } catch (err) {
    console.error('Failed to read service account:', err.message);
  }
}

if (!getApps().length) {
  if (serviceAccount) {
    initializeApp({ credential: cert(serviceAccount) });
  } else {
    initializeApp();
  }
}

const db = getFirestore();

// ── Data Definitions ──────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: '1', name: 'Electronics',            slug: 'electronics',        description: 'Gadgets, devices and tech accessories', icon: 'Laptop',     featured: true,  status: 'Active', display_order: 1 },
  { id: '2', name: 'Fashion & Apparel',       slug: 'fashion',            description: 'Clothing, shoes and accessories',       icon: 'Shirt',      featured: true,  status: 'Active', display_order: 2 },
  { id: '3', name: 'Books',                   slug: 'books',              description: 'Bestselling books across all genres',   icon: 'BookOpen',   featured: false, status: 'Active', display_order: 3 },
  { id: '4', name: 'Home & Kitchen',          slug: 'home-kitchen',       description: 'Everything for your home',              icon: 'Home',       featured: true,  status: 'Active', display_order: 4 },
  { id: '5', name: 'Sports & Fitness',        slug: 'sports',             description: 'Workout gear and fitness equipment',    icon: 'Dumbbell',   featured: false, status: 'Active', display_order: 5 },
  { id: '6', name: 'Beauty & Personal Care',  slug: 'beauty',             description: 'Skincare, hair and beauty products',    icon: 'Sparkles',   featured: false, status: 'Active', display_order: 6 },
  { id: '7', name: 'Bags & Accessories',      slug: 'bags',               description: 'Bags, wallets and travel accessories',  icon: 'ShoppingBag',featured: false, status: 'Active', display_order: 7 },
  { id: '8', name: 'Gaming',                  slug: 'gaming',             description: 'Gaming gear and accessories',           icon: 'Gamepad2',   featured: false, status: 'Active', display_order: 8 },
];

const PRODUCTS_RAW = [
  // Electronics (category_id: 1)
  { name: 'Quantum Noise-Cancelling Headphones', slug: 'quantum-noise-cancelling-headphones', catId: '1', price: 299.99, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=contain&w=600&q=80', stock: 15, is_featured: true },
  { name: 'UltraHD 4K Action Camera',            slug: 'ultrahd-4k-action-camera',            catId: '1', price: 199.50, image: 'https://images.unsplash.com/photo-1512753360435-329c4535a9a7?auto=format&fit=contain&w=600&q=80', stock: 40, is_featured: false },
  { name: 'Ergonomic Wireless Mouse',             slug: 'ergonomic-wireless-mouse',             catId: '1', price:  45.00, image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=contain&w=600&q=80', stock: 120, is_featured: false },
  { name: 'Mechanical RGB Keyboard',              slug: 'mechanical-rgb-keyboard',              catId: '1', price: 130.00, image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=contain&w=600&q=80', stock: 65, is_featured: false },
  { name: 'Smart Home Hub 2.0',                  slug: 'smart-home-hub',                       catId: '1', price:  99.99, image: 'https://images.unsplash.com/photo-1558089687-f282ffcbc126?auto=format&fit=contain&w=600&q=80', stock: 85, is_featured: false },
  { name: 'Portable 1TB SSD',                    slug: 'portable-1tb-ssd',                     catId: '1', price: 115.50, image: 'https://images.unsplash.com/photo-1597872253142-0f2c4cb71c77?auto=format&fit=contain&w=600&q=80', stock: 50, is_featured: false },
  { name: '27-inch Curved Gaming Monitor',        slug: 'curved-gaming-monitor',                catId: '1', price: 349.99, image: 'https://images.unsplash.com/photo-1527443154391-42861a55b0a3?auto=format&fit=contain&w=600&q=80', stock: 20, is_featured: false },
  { name: 'Smart Fitness Tracker Watch',          slug: 'smart-fitness-tracker',                catId: '1', price:  89.99, image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b2?auto=format&fit=contain&w=600&q=80', stock: 110, is_featured: false },

  // Fashion (category_id: 2)
  { name: 'Classic Leather Jacket',              slug: 'classic-leather-jacket',               catId: '2', price: 180.00, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=contain&w=600&q=80', stock: 35, is_featured: true },
  { name: 'Minimalist White Sneakers',           slug: 'minimalist-white-sneakers',            catId: '2', price:  85.00, image: 'https://images.unsplash.com/photo-1600181516264-3ea807fe3772?auto=format&fit=contain&w=600&q=80', stock: 150, is_featured: false },
  { name: 'Vintage Denim Jeans',                 slug: 'vintage-denim-jeans',                  catId: '2', price:  65.00, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=contain&w=600&q=80', stock: 90, is_featured: false },
  { name: 'Polarized Aviator Sunglasses',        slug: 'polarized-aviators',                   catId: '2', price:  45.00, image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=contain&w=600&q=80', stock: 200, is_featured: false },
  { name: 'Cotton Crewneck Sweater',             slug: 'cotton-crewneck-sweater',              catId: '2', price:  55.00, image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=contain&w=600&q=80', stock: 110, is_featured: false },
  { name: 'Canvas Tote Bag',                     slug: 'canvas-tote-bag',                      catId: '2', price:  25.00, image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=contain&w=600&q=80', stock: 300, is_featured: false },
  { name: 'Waterproof Winter Coat',              slug: 'waterproof-winter-coat',               catId: '2', price: 140.00, image: 'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?auto=format&fit=contain&w=600&q=80', stock: 45, is_featured: false },
  { name: 'Premium Leather Wallet',              slug: 'premium-leather-wallet',               catId: '2', price:  45.00, image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=contain&w=600&q=80', stock: 90, is_featured: false },

  // Books (category_id: 3)
  { name: 'The Pragmatic Programmer',            slug: 'pragmatic-programmer-book',            catId: '3', price: 42.00, image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=contain&w=600&q=80', stock: 75, is_featured: false },
  { name: 'Designing Data-Intensive Applications', slug: 'designing-data-intensive-applications', catId: '3', price: 38.50, image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=contain&w=600&q=80', stock: 60, is_featured: false },
  { name: "You Don't Know JS Yet",               slug: 'you-dont-know-js',                     catId: '3', price: 29.99, image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=contain&w=600&q=80', stock: 80, is_featured: false },
  { name: 'Clean Code: A Handbook',              slug: 'clean-code',                           catId: '3', price: 45.00, image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=contain&w=600&q=80', stock: 110, is_featured: false },
  { name: 'Eloquent JavaScript',                 slug: 'eloquent-javascript',                  catId: '3', price: 35.00, image: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=contain&w=600&q=80', stock: 65, is_featured: false },
  { name: 'Mindset: The New Psychology',         slug: 'mindset-book',                         catId: '3', price: 18.00, image: 'https://images.unsplash.com/photo-1589998059171-989d887dda6e?auto=format&fit=contain&w=600&q=80', stock: 150, is_featured: false },
  { name: 'Dune - Hardcover Edition',            slug: 'dune-book',                            catId: '3', price: 25.00, image: 'https://images.unsplash.com/photo-1614113489855-66422ad300a4?auto=format&fit=contain&w=600&q=80', stock: 120, is_featured: false },

  // Home & Kitchen (category_id: 4)
  { name: 'Ceramic Pour-Over Coffee Maker',      slug: 'ceramic-pour-over',                    catId: '4', price:  35.50, image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=contain&w=600&q=80', stock: 95, is_featured: false },
  { name: 'Cast Iron Skillet (12-inch)',          slug: 'cast-iron-skillet-12',                 catId: '4', price:  49.99, image: 'https://images.unsplash.com/photo-1585675549007-9b25134106bb?auto=format&fit=contain&w=600&q=80', stock: 55, is_featured: false },
  { name: 'Bamboo Cutting Board Set',            slug: 'bamboo-cutting-board',                 catId: '4', price:  24.00, image: 'https://images.unsplash.com/photo-1576020739985-055a43292434?auto=format&fit=contain&w=600&q=80', stock: 130, is_featured: false },
  { name: 'Stainless Steel Mixing Bowls',        slug: 'stainless-mixing-bowls',               catId: '4', price:  29.99, image: 'https://images.unsplash.com/photo-1601646279140-5aa56396f927?auto=format&fit=contain&w=600&q=80', stock: 40, is_featured: false },
  { name: 'Air Purifier for Bedroom',            slug: 'air-purifier',                         catId: '4', price: 110.00, image: 'https://images.unsplash.com/photo-1584269600519-112d071b65e6?auto=format&fit=contain&w=600&q=80', stock: 65, is_featured: false },
  { name: 'Luxury Cotton Bath Towels',           slug: 'cotton-bath-towels',                   catId: '4', price:  40.00, image: 'https://images.unsplash.com/photo-1583335513577-224a1795c479?auto=format&fit=contain&w=600&q=80', stock: 180, is_featured: false },

  // Sports & Fitness (category_id: 5)
  { name: 'Yoga Mat with Alignment Lines',       slug: 'alignment-yoga-mat',                   catId: '5', price:  32.00, image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=contain&w=600&q=80', stock: 200, is_featured: false },
  { name: 'Adjustable Dumbbell Set',             slug: 'adjustable-dumbbells',                 catId: '5', price: 150.00, image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=contain&w=600&q=80', stock: 35, is_featured: true },
  { name: 'Resistance Band Pack',                slug: 'resistance-bands-pack',                catId: '5', price:  15.99, image: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?auto=format&fit=contain&w=600&q=80', stock: 300, is_featured: false },
  { name: 'Insulated Stainless Steel Water Bottle', slug: 'steel-water-bottle',               catId: '5', price:  25.00, image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=contain&w=600&q=80', stock: 250, is_featured: false },
  { name: 'Foam Roller for Muscle Massage',      slug: 'foam-roller',                          catId: '5', price:  20.00, image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=contain&w=600&q=80', stock: 120, is_featured: false },
  { name: 'High-Speed Jump Rope',                slug: 'jump-rope',                            catId: '5', price:  12.50, image: 'https://images.unsplash.com/photo-1580261450046-d0a30080dc9b?auto=format&fit=contain&w=600&q=80', stock: 400, is_featured: false },

  // Beauty & Personal Care (category_id: 6)
  { name: 'Vitamin C Brightening Serum',         slug: 'vitamin-c-serum',                      catId: '6', price: 38.00, image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=contain&w=600&q=80', stock: 200, is_featured: false },
  { name: 'Hyaluronic Acid Moisturizer',         slug: 'hyaluronic-moisturizer',               catId: '6', price: 32.00, image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=contain&w=600&q=80', stock: 180, is_featured: false },
  { name: 'Charcoal Deep Cleanse Mask',          slug: 'charcoal-face-mask',                   catId: '6', price: 18.00, image: 'https://images.unsplash.com/photo-1599847200888-a44a5ef27d95?auto=format&fit=contain&w=600&q=80', stock: 250, is_featured: false },
  { name: 'Bamboo Facial Brush Set',             slug: 'bamboo-facial-brush',                  catId: '6', price: 24.00, image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?auto=format&fit=contain&w=600&q=80', stock: 90, is_featured: false },

  // Bags & Accessories (category_id: 7)
  { name: 'Full-Grain Leather Backpack',         slug: 'leather-backpack',                     catId: '7', price: 199.00, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=contain&w=600&q=80', stock: 40, is_featured: false },
  { name: 'Minimalist Crossbody Bag',            slug: 'crossbody-bag',                        catId: '7', price:  85.00, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=contain&w=600&q=80', stock: 75, is_featured: false },
  { name: 'Rolling Carry-On Suitcase',           slug: 'carry-on-suitcase',                    catId: '7', price: 145.00, image: 'https://images.unsplash.com/photo-1596484552834-6a52f4d5eb6c?auto=format&fit=contain&w=600&q=80', stock: 30, is_featured: false },
  { name: 'Slim Card Holder Wallet',             slug: 'card-holder-wallet',                   catId: '7', price:  35.00, image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=contain&w=600&q=80', stock: 150, is_featured: false },

  // Gaming (category_id: 8)
  { name: 'Pro Wireless Gaming Mouse',           slug: 'wireless-gaming-mouse',                catId: '8', price:  99.99, image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=contain&w=600&q=80', stock: 85, is_featured: false },
  { name: 'Mechanical Gaming Keyboard',          slug: 'gaming-keyboard',                      catId: '8', price: 149.99, image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=contain&w=600&q=80', stock: 60, is_featured: false },
  { name: '7.1 Surround Sound Gaming Headset',   slug: 'gaming-headset',                       catId: '8', price: 129.00, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=contain&w=600&q=80', stock: 70, is_featured: false },
  { name: 'Gaming Chair with Lumbar Support',    slug: 'gaming-chair',                         catId: '8', price: 349.00, image: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=contain&w=600&q=80', stock: 15, is_featured: false },
  { name: 'RGB Gaming Mouse Pad (XL)',           slug: 'rgb-mousepad-xl',                      catId: '8', price:  29.99, image: 'https://images.unsplash.com/photo-1593640495253-23196b27a87f?auto=format&fit=contain&w=600&q=80', stock: 200, is_featured: false },
];

const CATEGORY_SPECS = {
  '1': [
    { spec_key: 'Processor / Chipset', spec_value: 'Apple M3 / Snapdragon 8 Gen 3 / Intel Core i7' },
    { spec_key: 'RAM Memory', spec_value: '16GB LPDDR5 High-Speed' },
    { spec_key: 'Internal Storage', spec_value: '512GB NVMe PCIe 4.0 SSD' },
    { spec_key: 'Display Technology', spec_value: '6.7-inch Super Retina XDR OLED (120Hz)' },
    { spec_key: 'Battery Life', spec_value: 'Up to 22 Hours Continuous Video Playback' },
    { spec_key: 'Charging Speed', spec_value: '67W Fast Charging (50% in 25 mins)' },
    { spec_key: 'Operating System', spec_value: 'macOS Sonoma / iOS 17 / Windows 11 Pro' },
    { spec_key: 'Wireless Connectivity', spec_value: 'Wi-Fi 6E, Bluetooth 5.3, 5G Dual SIM' },
    { spec_key: 'Device Weight', spec_value: '1.24 kg (2.73 lbs)' },
    { spec_key: 'Manufacturer Warranty', spec_value: '1 Year Limited Global Warranty' },
  ],
  '2': [
    { spec_key: 'Fabric Material', spec_value: '100% Organic Egyptian Cotton' },
    { spec_key: 'Garment Fit', spec_value: 'Tailored Slim Fit' },
    { spec_key: 'Wash Care Instructions', spec_value: 'Machine Wash Cold, Tumble Dry Low' },
    { spec_key: 'Occasion', spec_value: 'Casual, Streetwear, Everyday Wear' },
    { spec_key: 'Country of Origin', spec_value: 'Portugal' },
    { spec_key: 'Pattern Type', spec_value: 'Solid Matte Finish' },
    { spec_key: 'Breathability Rating', spec_value: 'High Airflow Weave' },
    { spec_key: 'Warranty', spec_value: '6 Months Stitching Guarantee' },
  ],
  '3': [
    { spec_key: 'Publisher', spec_value: 'Penguin Random House / HarperCollins' },
    { spec_key: 'Language', spec_value: 'English (Original Unabridged)' },
    { spec_key: 'Page Count', spec_value: '384 Pages' },
    { spec_key: 'ISBN-13 Number', spec_value: '978-0143127741' },
    { spec_key: 'Edition Type', spec_value: 'Collector Hardcover Edition' },
    { spec_key: 'Book Format', spec_value: 'Hardcover with Dust Jacket' },
    { spec_key: 'Genre / Topic', spec_value: 'Self-Improvement & Productivity' },
    { spec_key: 'Item Weight', spec_value: '480 grams' },
  ],
  '4': [
    { spec_key: 'Body Material', spec_value: 'Brushed 18/10 Stainless Steel & BPA-Free Polymer' },
    { spec_key: 'Total Capacity', spec_value: '1.8 Liters / 12 Cups' },
    { spec_key: 'Power Consumption', spec_value: '1500 Watts High Efficiency' },
    { spec_key: 'Color Finish', spec_value: 'Matte Obsidian Black & Chrome' },
    { spec_key: 'Safety Features', spec_value: 'Auto Shut-Off, Overheat Protection' },
    { spec_key: 'Cleaning Method', spec_value: 'Dishwasher Safe Detachable Components' },
    { spec_key: 'Manufacturer Warranty', spec_value: '2 Year Full Replacement Warranty' },
  ],
  '5': [
    { spec_key: 'Construction Material', spec_value: 'Aircraft Grade Aluminum & Composite Rubber' },
    { spec_key: 'Suitable For', spec_value: 'Intermediate & Professional Athletes' },
    { spec_key: 'Grip Style', spec_value: 'Non-Slip Ergonomic Textured Foam' },
    { spec_key: 'Durability Rating', spec_value: 'Commercial Gym Grade' },
    { spec_key: 'Water Resistance', spec_value: 'Sweat Resistant & Weatherproof' },
    { spec_key: 'Brand Origin', spec_value: 'USA / Germany' },
    { spec_key: 'Warranty', spec_value: '3 Year Frame & Structural Guarantee' },
  ],
  '6': [
    { spec_key: 'Target Skin Type', spec_value: 'All Skin Types / Sensitive Formulation' },
    { spec_key: 'Net Volume', spec_value: '100ml / 3.4 fl oz' },
    { spec_key: 'Key Ingredients', spec_value: 'Hyaluronic Acid, Vitamin C & Botanical Extracts' },
    { spec_key: 'Formulation', spec_value: 'Dermatologically Tested Serum' },
    { spec_key: 'Cruelty-Free Status', spec_value: '100% Vegan & Paraben-Free' },
    { spec_key: 'Shelf Life', spec_value: '24 Months from Manufacture Date' },
    { spec_key: 'Country of Origin', spec_value: 'France' },
  ],
  '7': [
    { spec_key: 'Outer Material', spec_value: 'Full-Grain Italian Leather' },
    { spec_key: 'Inner Lining', spec_value: 'Soft Microfiber Velvet Lining' },
    { spec_key: 'Compartments', spec_value: '1 Padded Laptop Sleeve + 4 Quick-Access Pockets' },
    { spec_key: 'Zipper & Hardware', spec_value: 'YKK Japanese Brass Zippers' },
    { spec_key: 'Water Resistance', spec_value: 'Water-Repellent Coating' },
    { spec_key: 'Capacity Volume', spec_value: '24 Liters' },
    { spec_key: 'Warranty', spec_value: 'Lifetime Craftsmanship Guarantee' },
  ],
  '8': [
    { spec_key: 'Platform Compatibility', spec_value: 'PC, PlayStation 5, Xbox Series X, Nintendo Switch' },
    { spec_key: 'Connectivity', spec_value: '2.4GHz Ultra-Low Latency Wireless + Bluetooth' },
    { spec_key: 'DPI Resolution', spec_value: '100 - 25,600 DPI Customizable' },
    { spec_key: 'RGB Lighting', spec_value: '16.8M Color Lightsync Per-Key RGB' },
    { spec_key: 'Battery Duration', spec_value: 'Up to 90 Hours Continuous Gameplay' },
    { spec_key: 'Polling Rate', spec_value: '1000Hz (1ms Response Rate)' },
    { spec_key: 'Warranty', spec_value: '2 Year Gaming Replacement Warranty' },
  ],
};

const SAMPLE_REVIEWS = [
  { user_name: 'Marcus Vance',    rating: 5, review: 'Outstanding performance and premium feel! Worth every dollar spent.', title: 'Excellent Quality' },
  { user_name: 'Sarah Chen',      rating: 5, review: 'Sleek design, works flawlessly as advertised. Delivery was fast too.', title: 'Highly Recommended' },
  { user_name: 'David Miller',    rating: 4, review: 'Very high quality product. Fits great and handles heavy daily use easily.', title: 'Great Product' },
  { user_name: 'Elena Rostova',   rating: 5, review: 'Five stars! Exceeded my expectations in every aspect.', title: 'Exceeded Expectations' },
  { user_name: 'James Patterson', rating: 5, review: 'Top tier build and packaging. Extremely satisfied with this purchase!', title: 'Top Tier Build' },
];

// ── Seeding Logic ─────────────────────────────────────────────────────────────

async function seedCategories() {
  console.log('\n📂 Seeding categories...');
  const batch = db.batch();
  const now = new Date().toISOString();

  for (const cat of CATEGORIES) {
    const ref = db.collection('categories').doc(cat.id);
    const existing = await ref.get();
    if (!existing.exists) {
      batch.set(ref, { ...cat, created_at: now, updated_at: now });
      console.log(`  ✅ Created category: ${cat.name}`);
    } else {
      console.log(`  ⏩ Skipped (exists): ${cat.name}`);
    }
  }

  await batch.commit();
  console.log('✅ Categories seeded.');
}

const urlCache = {
  // Electronics
  headphones: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
  camera: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=600&fit=crop',
  mouse: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&h=600&fit=crop',
  keyboard: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&h=600&fit=crop',
  smart_home: 'https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=600&h=600&fit=crop',
  ssd: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=600&fit=crop',
  monitor: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&h=600&fit=crop',
  fitness_tracker: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b2?w=600&h=600&fit=crop',

  // Fashion
  leather_jacket: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=600&fit=crop',
  sneakers: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=600&fit=crop',
  jeans: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=600&fit=crop',
  sunglasses: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&h=600&fit=crop',
  sweater: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&h=600&fit=crop',
  tote_bag: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&h=600&fit=crop',
  winter_coat: 'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=600&h=600&fit=crop',
  wallet: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&h=600&fit=crop',

  // Books
  book_pragmatic: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5d6?w=600&h=600&fit=crop',
  book_data: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop',
  book_js: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=600&h=600&fit=crop',
  book_clean: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=600&fit=crop',
  book_eloquent: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&h=600&fit=crop',
  book_mindset: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&h=600&fit=crop',
  book_dune: 'https://images.unsplash.com/photo-1531988042231-d39a9cc12a9a?w=600&h=600&fit=crop',

  // Home & Kitchen
  coffee_maker: 'https://images.unsplash.com/photo-1517256064527-09c53b2d0bc6?w=600&h=600&fit=crop',
  skillet: 'https://images.unsplash.com/photo-1585675549007-9b25134106bb?w=600&h=600&fit=crop',
  cutting_board: 'https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?w=600&h=600&fit=crop',
  mixing_bowls: 'https://images.unsplash.com/photo-1574656562475-300dd34b82bc?w=600&h=600&fit=crop',
  air_purifier: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=600&h=600&fit=crop',
  bath_towels: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=600&h=600&fit=crop',

  // Sports & Fitness
  yoga_mat: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&h=600&fit=crop',
  dumbbells: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=600&fit=crop',
  resistance_bands: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&h=600&fit=crop',
  water_bottle: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&h=600&fit=crop',
  foam_roller: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=600&fit=crop',
  jump_rope: 'https://images.unsplash.com/photo-1580261450046-d0a30080dc9b?w=600&h=600&fit=crop',

  // Beauty & Personal Care
  vitamin_c: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=600&fit=crop',
  hyaluronic: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=600&fit=crop',
  face_mask: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=600&fit=crop',
  facial_brush: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=600&fit=crop',

  // Bags & Accessories
  backpack: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop',
  crossbody_bag: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=600&fit=crop',
  suitcase: 'https://images.unsplash.com/photo-1596484552834-6a52f4d5eb6c?w=600&h=600&fit=crop',
  card_holder: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&h=600&fit=crop',

  // Gaming
  gaming_mouse: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&h=600&fit=crop',
  gaming_keyboard: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=600&h=600&fit=crop',
  gaming_headset: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
  gaming_chair: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=600&h=600&fit=crop',
  mousepad: 'https://images.unsplash.com/photo-1593640495253-23196b27a87f?w=600&h=600&fit=crop'
};

const findImage = (slug, category_id) => {
  const s = slug.toLowerCase();
  
  if (s.includes('headphone') || s.includes('headset')) return urlCache.headphones;
  if (s.includes('camera')) return urlCache.camera;
  if (s.includes('mouse') && s.includes('gaming')) return urlCache.gaming_mouse;
  if (s.includes('mouse')) return urlCache.mouse;
  if (s.includes('keyboard') && s.includes('gaming')) return urlCache.gaming_keyboard;
  if (s.includes('keyboard')) return urlCache.keyboard;
  if (s.includes('smart-home') || s.includes('hub')) return urlCache.smart_home;
  if (s.includes('ssd')) return urlCache.ssd;
  if (s.includes('monitor')) return urlCache.monitor;
  if (s.includes('tracker') || s.includes('watch')) return urlCache.fitness_tracker;

  if (s.includes('jacket') || s.includes('coat')) return urlCache.leather_jacket;
  if (s.includes('sneaker')) return urlCache.sneakers;
  if (s.includes('jean')) return urlCache.jeans;
  if (s.includes('sunglass') || s.includes('aviator')) return urlCache.sunglasses;
  if (s.includes('sweater')) return urlCache.sweater;
  if (s.includes('tote') || s.includes('bag') && s.includes('canvas')) return urlCache.tote_bag;
  if (s.includes('winter') || s.includes('coat')) return urlCache.winter_coat;
  if (s.includes('wallet') && s.includes('leather')) return urlCache.wallet;

  if (s.includes('pragmatic')) return urlCache.book_pragmatic;
  if (s.includes('intensive') || s.includes('data')) return urlCache.book_data;
  if (s.includes('know-js')) return urlCache.book_js;
  if (s.includes('clean-code')) return urlCache.book_clean;
  if (s.includes('eloquent')) return urlCache.book_eloquent;
  if (s.includes('mindset')) return urlCache.book_mindset;
  if (s.includes('dune')) return urlCache.book_dune;

  if (s.includes('pour-over') || s.includes('coffee')) return urlCache.coffee_maker;
  if (s.includes('skillet') || s.includes('pan')) return urlCache.skillet;
  if (s.includes('cutting-board') || s.includes('bamboo')) return urlCache.cutting_board;
  if (s.includes('bowl')) return urlCache.mixing_bowls;
  if (s.includes('purifier')) return urlCache.air_purifier;
  if (s.includes('towel')) return urlCache.bath_towels;

  if (s.includes('yoga') || s.includes('mat')) return urlCache.yoga_mat;
  if (s.includes('dumbbell')) return urlCache.dumbbells;
  if (s.includes('band')) return urlCache.resistance_bands;
  if (s.includes('bottle')) return urlCache.water_bottle;
  if (s.includes('roller')) return urlCache.foam_roller;
  if (s.includes('rope')) return urlCache.jump_rope;

  if (s.includes('vitamin') || s.includes('serum')) return urlCache.vitamin_c;
  if (s.includes('hyaluronic') || s.includes('moisturizer')) return urlCache.hyaluronic;
  if (s.includes('charcoal') || s.includes('mask')) return urlCache.face_mask;
  if (s.includes('brush') || s.includes('facial')) return urlCache.facial_brush;

  if (s.includes('backpack')) return urlCache.backpack;
  if (s.includes('crossbody')) return urlCache.crossbody_bag;
  if (s.includes('suitcase') || s.includes('carry-on')) return urlCache.suitcase;
  if (s.includes('card-holder') || s.includes('wallet')) return urlCache.card_holder;

  if (s.includes('chair')) return urlCache.gaming_chair;
  if (s.includes('mousepad')) return urlCache.mousepad;

  // Generic category fallbacks
  const cat = String(category_id);
  if (cat === '1') return urlCache.headphones;
  if (cat === '2') return urlCache.tshirt;
  if (cat === '3') return urlCache.book_pragmatic;
  if (cat === '4') return urlCache.coffee_maker;
  if (cat === '5') return urlCache.dumbbells;
  if (cat === '6') return urlCache.vitamin_c;
  if (cat === '7') return urlCache.backpack;
  if (cat === '8') return urlCache.gaming_mouse;

  return urlCache.headphones;
};

async function seedProducts() {
  console.log('\n📦 Seeding products...');
  const now = new Date().toISOString();
  let created = 0;
  let skipped = 0;

  // Load categories for name/slug lookup
  const catMap = {};
  for (const cat of CATEGORIES) {
    catMap[cat.id] = cat;
  }

  for (let i = 0; i < PRODUCTS_RAW.length; i++) {
    const p   = PRODUCTS_RAW[i];
    const id  = String(i + 1);
    const cat = catMap[p.catId] ?? {};
    const ref = db.collection('products').doc(id);

    const existing = await ref.get();
    if (existing.exists) {
      console.log(`  ⏩ Skipped (exists): ${p.name}`);
      skipped++;
      continue;
    }

    const specs = CATEGORY_SPECS[p.catId] ?? CATEGORY_SPECS['1'];
    const desc  = `Experience the amazing quality of ${p.name}. Built with top-tier materials to last and impress. Perfect for your daily needs!`;

    const reviews = SAMPLE_REVIEWS.map((r) => ({
      product_id: id,
      user_id: 'seed',
      rating: r.rating,
      title: r.title,
      review: r.review,
      verified_purchase: true,
      user_name: r.user_name,
      user_email: null,
      status: 'Approved',
      is_hidden: false,
      report_count: 0,
      created_at: now,
      updated_at: now,
    }));

    const matchedUrl = findImage(p.slug, p.catId);

    await ref.set({
      id,
      category_id: p.catId,
      category_name: cat.name ?? null,
      category_slug: cat.slug ?? null,
      name: p.name,
      slug: p.slug,
      description: desc,
      image_url: matchedUrl,
      images: [{ image_url: matchedUrl, display_order: 0 }],
      price: p.price,
      stock: p.stock,
      is_featured: p.is_featured ?? false,
      brand: 'Generic',
      sku: `SKU-${100 + i}`,
      old_price: null,
      discount_pct: 0,
      specifications: specs,
      features: [],
      tags: null,
      weight: null,
      dimensions: null,
      warranty: null,
      return_policy: null,
      shipping_info: null,
      is_active: true,
      created_at: now,
      updated_at: now,
    });

    // Seed 5 reviews for this product in the product_reviews collection
    const reviewBatch = db.batch();
    for (const rev of reviews) {
      const reviewId  = `${id}_${rev.user_name.replace(/\s/g, '_')}`;
      const reviewRef = db.collection('product_reviews').doc(reviewId);
      reviewBatch.set(reviewRef, rev, { merge: true });
    }
    await reviewBatch.commit();

    console.log(`  ✅ Created product [${id}]: ${p.name}`);
    created++;
  }

  console.log(`\n✅ Products seeded: ${created} created, ${skipped} skipped.`);
}

async function main() {
  console.log('🚀 Starting Firestore seed...\n');

  try {
    await seedCategories();
    await seedProducts();
    console.log('\n🎉 Firestore seeding complete!');
    console.log('   ✅ 8 categories');
    console.log('   ✅ 50 products with specifications + 5 reviews each');
    console.log('\nYou can now start the backend: npm run dev');
  } catch (err) {
    console.error('\n❌ Seeding failed:', err.message);
    console.error(err.stack);
  } finally {
    process.exit(0);
  }
}

main();
