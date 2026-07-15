import pool from './config/db.js';

const productImages = {
  // Fashion
  'classic-leather-jacket': 'https://m.media-amazon.com/images/I/71R2o5jJ6hL._AC_SX679_.jpg',
  'minimalist-white-sneakers': 'https://m.media-amazon.com/images/I/516m18zYq9L._AC_SY695_.jpg',
  'vintage-denim-jeans': 'https://m.media-amazon.com/images/I/81I2cQJbC-L._AC_SX679_.jpg',
  'polarized-aviators': 'https://m.media-amazon.com/images/I/51s7V2Z+Y5L._AC_SX679_.jpg',
  'cotton-crewneck-sweater': 'https://m.media-amazon.com/images/I/81nC-f7LwWL._AC_SX679_.jpg',
  'canvas-tote-bag': 'https://m.media-amazon.com/images/I/71XmZ7n5Z3L._AC_SX679_.jpg',
  'waterproof-winter-coat': 'https://m.media-amazon.com/images/I/61KxG8J3hBL._AC_SX679_.jpg',
  'premium-leather-wallet': 'https://m.media-amazon.com/images/I/81xH6m0+qOL._AC_SX679_.jpg',

  // Electronics
  'quantum-noise-cancelling-headphones': 'https://m.media-amazon.com/images/I/61vJtKoiMGL._AC_SX679_.jpg',
  'ultrahd-4k-action-camera': 'https://m.media-amazon.com/images/I/71F7g2sZpYL._AC_SX679_.jpg',
  'ergonomic-wireless-mouse': 'https://m.media-amazon.com/images/I/61UxfXTUyvL._AC_SX679_.jpg',
  'mechanical-rgb-keyboard': 'https://m.media-amazon.com/images/I/71cngLX2xaL._AC_SX679_.jpg',
  'smart-home-hub': 'https://m.media-amazon.com/images/I/5162Y9KDEpL._AC_SX679_.jpg',
  'portable-1tb-ssd': 'https://m.media-amazon.com/images/I/81nj7bC2a7L._AC_SX679_.jpg',
  'curved-gaming-monitor': 'https://m.media-amazon.com/images/I/81Zt42DRZpL._AC_SX679_.jpg',
  'smart-fitness-tracker': 'https://m.media-amazon.com/images/I/61I2d4H+J8L._AC_SX679_.jpg',

  // Sports
  'alignment-yoga-mat': 'https://m.media-amazon.com/images/I/61O2fM0A3KL._AC_SX679_.jpg',
  'adjustable-dumbbells': 'https://m.media-amazon.com/images/I/71+pOdQ7iQL._AC_SX679_.jpg',
  'resistance-bands-pack': 'https://m.media-amazon.com/images/I/81k3y2cM+BL._AC_SX679_.jpg',
  'steel-water-bottle': 'https://m.media-amazon.com/images/I/61P1YfOqYmL._AC_SX679_.jpg',
  'foam-roller': 'https://m.media-amazon.com/images/I/71tQpD0D9fL._AC_SX679_.jpg',
  'jump-rope': 'https://m.media-amazon.com/images/I/71J15X1Q9vL._AC_SX679_.jpg',

  // Books
  'designing-data-intensive-applications': 'https://m.media-amazon.com/images/I/81k1bEa-HRL._AC_UF1000,1000_QL80_.jpg',
  'you-dont-know-js': 'https://m.media-amazon.com/images/I/71mKvD89fEL._AC_UF1000,1000_QL80_.jpg',
  'eloquent-javascript': 'https://m.media-amazon.com/images/I/81HqVRRwp3L._AC_UF1000,1000_QL80_.jpg',
  'mindset-book': 'https://m.media-amazon.com/images/I/611Zhw-Q3kL._AC_UF1000,1000_QL80_.jpg',
  'dune-book': 'https://m.media-amazon.com/images/I/81ym3QUd3KL._AC_UF1000,1000_QL80_.jpg'
};

async function fixAll() {
  try {
    for (const [slug, url] of Object.entries(productImages)) {
      try {
        await pool.query(
          `UPDATE products SET image_url = ? WHERE slug = ?`,
          [url, slug]
        );
        console.log(`Updated ${slug} with reliable Amazon media url.`);
      } catch (e) {
        console.error(`Failed to update ${slug}: ${e.message}`);
      }
    }
    console.log('Finished updating all remaining unpredictable images!');
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
}

fixAll();
