import pool from './config/db.js';

async function test() {
  try {
    const [rows] = await pool.query('SELECT slug, name, image_url FROM products WHERE category_id = (SELECT id FROM categories WHERE slug = ?)', ['home-kitchen']);
    console.log(rows);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
test();
