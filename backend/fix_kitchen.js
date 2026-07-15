import pool from './config/db.js';

const kitchenFixes = {
  // Directly using clean, professional product images for Home & Kitchen
  'cotton-bath-towels': 'https://m.media-amazon.com/images/I/81xXj114HlL._AC_SX679_.jpg',
  'air-purifier': 'https://m.media-amazon.com/images/I/71r5EOfyKDL._AC_SX679_.jpg',
  'stainless-mixing-bowls': 'https://m.media-amazon.com/images/I/71i-HLEi7xL._AC_SX679_.jpg',
  'bamboo-cutting-board': 'https://m.media-amazon.com/images/I/81FkVbdnQXL._AC_SX679_.jpg',
  'cast-iron-skillet-12': 'https://m.media-amazon.com/images/I/81F5SGBxllL._AC_SX679_.jpg',
  'ceramic-pour-over': 'https://m.media-amazon.com/images/I/61e053k7TNL._AC_SX679_.jpg'
};

async function fixKitchen() {
  try {
    for (const [slug, url] of Object.entries(kitchenFixes)) {
      try {
        await pool.query(
          `UPDATE products SET image_url = ? WHERE slug = ?`,
          [url, slug]
        );
        console.log(`Updated ${slug} with a clean professional image.`);
      } catch (e) {
        console.error(`Failed to update ${slug}: ${e.message}`);
      }
    }
    console.log('Finished updating Home & Kitchen images!');
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
}

fixKitchen();
