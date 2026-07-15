import pool from './config/db.js';

const baseFixes = {
  // Electronics
  'apple-iphone-15-pro': 'https://m.media-amazon.com/images/I/81Os1SDWpcL._AC_SX679_.jpg',
  'samsung-galaxy-s24-ultra': 'https://m.media-amazon.com/images/I/71WcjptMejL._AC_SX679_.jpg',
  'sony-wh-1000xm5': 'https://m.media-amazon.com/images/I/51aXvjzcukL._AC_SX679_.jpg',
  'apple-macbook-air-m3': 'https://m.media-amazon.com/images/I/71jG+e7roXL._AC_SX679_.jpg',

  // Fashion
  'levis-501-original-jeans': 'https://m.media-amazon.com/images/I/61H+b550jVS._AC_SX679_.jpg',
  'nike-air-max-270': 'https://m.media-amazon.com/images/I/71vUu84XQfL._AC_SY695_.jpg',
  'ray-ban-aviator-classic': 'https://m.media-amazon.com/images/I/51s7V2Z+Y5L._AC_SX679_.jpg',
  'adidas-ultraboost-23': 'https://m.media-amazon.com/images/I/71J15X1Q9vL._AC_SX679_.jpg',

  // Home & Kitchen
  'instant-pot-duo-7-in-1': 'https://m.media-amazon.com/images/I/71WtwEvIGyL._AC_SX679_.jpg',
  'dyson-v15-detect-vacuum': 'https://m.media-amazon.com/images/I/71P7hE0iM-L._AC_SX679_.jpg',
  'ikea-kallax-shelf-unit': 'https://m.media-amazon.com/images/I/71Zp+i1-KLL._AC_SX679_.jpg',
  'nespresso-vertuo-pop': 'https://m.media-amazon.com/images/I/61pD7XkBy9L._AC_SX679_.jpg',

  // Sports
  'peloton-bike-plus': 'https://m.media-amazon.com/images/I/61X-2A4yomL._AC_SX679_.jpg',
  'hydro-flask-32oz': 'https://m.media-amazon.com/images/I/71M3v0vYpIL._AC_SX679_.jpg',
  'yoga-mat-premium-non-slip': 'https://m.media-amazon.com/images/I/61O2fM0A3KL._AC_SX679_.jpg',
  'bowflex-selecttech-552': 'https://m.media-amazon.com/images/I/71+pOdQ7iQL._AC_SX679_.jpg'
};

async function fixBase() {
  try {
    for (const [slug, url] of Object.entries(baseFixes)) {
      try {
        await pool.query(
          `UPDATE products SET image_url = ? WHERE slug = ?`,
          [url, slug]
        );
        console.log(`Updated ${slug} with a final reliable Amazon image.`);
      } catch (e) {
        console.error(`Failed to update ${slug}: ${e.message}`);
      }
    }
    console.log('Finished updating ALL BASE Unsplash images!');
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
}

fixBase();
