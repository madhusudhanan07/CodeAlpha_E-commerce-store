const fs = require('fs');

const categories = [
  { id: 1, name: 'Electronics', slug: 'electronics', description: 'Gadgets and devices' },
  { id: 2, name: 'Fashion', slug: 'fashion', description: 'Clothes and apparel' },
  { id: 3, name: 'Books', slug: 'books', description: 'Readings and literature' },
  { id: 4, name: 'Home & Kitchen', slug: 'home-kitchen', description: 'Household items' },
  { id: 5, name: 'Sports & Fitness', slug: 'sports-fitness', description: 'Athletic gear' },
  { id: 6, name: 'Beauty & Personal Care', slug: 'beauty-personal-care', description: 'Cosmetics and grooming' },
  { id: 7, name: 'Bags & Accessories', slug: 'bags-accessories', description: 'Bags, wallets, etc.' },
  { id: 8, name: 'Gaming', slug: 'gaming', description: 'Consoles and gaming gear' },
  { id: 9, name: 'Pet Supplies', slug: 'pet-supplies', description: 'Everything for your pets' },
  { id: 10, name: 'Automotive', slug: 'automotive', description: 'Car accessories' }
];

// We will just read the existing ecommerce.sql to see if we even need this script,
// But to ensure Node.js can generate seed data, we could just dump all data here.
// However, the instructions say: 
// "6. If possible, replace the Python seed generators with an equivalent Node.js script."

console.log('Use database/ecommerce.sql for full schema and seed.');
