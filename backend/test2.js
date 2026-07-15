import pool from './config/db.js';

async function checkMissing() {
  try {
    const [rows] = await pool.query('SELECT name, slug, image_url FROM products');
    const missingOrBad = rows.filter(r => !r.image_url || r.image_url.includes('unsplash') || r.image_url.includes('loremflickr') || r.image_url.includes('placehold'));
    console.log('Bad or missing images:', JSON.stringify(missingOrBad, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
checkMissing();
