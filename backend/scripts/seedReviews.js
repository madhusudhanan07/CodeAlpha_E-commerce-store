/**
 * seedReviews.js — MySQL Seeder for Product Reviews & Ratings
 *
 * Populates 5 to 12 realistic demo reviews per product for all products in the database.
 * Ensures demo users and purchase order records exist so verification checks pass cleanly.
 */

import pool from '../config/db.js';

const DEMO_USERS = [
  { name: 'Alex Johnson',    email: 'alex.j@example.com',    uid: 'demo_user_alex' },
  { name: 'Sophia Martinez', email: 'sophia.m@example.com',  uid: 'demo_user_sophia' },
  { name: 'Marcus Vance',    email: 'marcus.v@example.com',  uid: 'demo_user_marcus' },
  { name: 'Emily Chen',      email: 'emily.c@example.com',   uid: 'demo_user_emily' },
  { name: 'David Miller',    email: 'david.m@example.com',   uid: 'demo_user_david' },
  { name: 'Elena Rostova',   email: 'elena.r@example.com',   uid: 'demo_user_elena' },
  { name: 'James Patterson', email: 'james.p@example.com',   uid: 'demo_user_james' },
  { name: 'Chloe Dubois',    email: 'chloe.d@example.com',   uid: 'demo_user_chloe' },
  { name: 'Liam O\'Connor',  email: 'liam.o@example.com',    uid: 'demo_user_liam' },
  { name: 'Aarav Sharma',    email: 'aarav.s@example.com',   uid: 'demo_user_aarav' },
  { name: 'Hannah Wright',   email: 'hannah.w@example.com',  uid: 'demo_user_hannah' },
  { name: 'Benjamin Scott',  email: 'benjamin.s@example.com',uid: 'demo_user_ben' },
  { name: 'Mia Tanaka',      email: 'mia.t@example.com',     uid: 'demo_user_mia' },
  { name: 'Lucas Rossi',     email: 'lucas.r@example.com',   uid: 'demo_user_lucas' },
  { name: 'Zara Al-Mansoor', email: 'zara.a@example.com',    uid: 'demo_user_zara' },
];

const REVIEW_TEMPLATES = [
  {
    rating: 5,
    title: 'Absolute perfection! Exceeded all expectations.',
    review: 'This product is built like a premium tank. The quality and performance are top tier. Couldn’t be happier with this purchase, arrived super fast as well!',
  },
  {
    rating: 5,
    title: 'Worth every single penny',
    review: 'I was hesitant at first due to the price point, but after using it daily for a few weeks, I can safely say it is one of the best investments I have made recently.',
  },
  {
    rating: 5,
    title: 'Sleek design & effortless performance',
    review: 'Super intuitive and well-crafted. The fit and finish are exceptional. Highly recommend to anyone looking for premium reliability.',
  },
  {
    rating: 5,
    title: 'Fantastic value for money!',
    review: 'Works exactly as described. Packaging was very neat and secure. Will definitely buy again from CodeAlpha Store.',
  },
  {
    rating: 4,
    title: 'Great overall quality, minor quirks',
    review: 'Really solid build quality and design. My only small nitpick is the manual instructions could be slightly clearer, but overall fantastic product.',
  },
  {
    rating: 4,
    title: 'Very satisfied with performance',
    review: 'Delivers on all its promises. High durability and smooth operation. Would rate 4.5 stars if possible!',
  },
  {
    rating: 4,
    title: 'Solid purchase!',
    review: 'Meets all expectations. Good materials, clean design, and reliable performance.',
  },
  {
    rating: 3,
    title: 'Decent product, average experience',
    review: 'It gets the job done as advertised, but nothing mind-blowing. Average build quality for the price.',
  },
  {
    rating: 3,
    title: 'Okay for daily use',
    review: 'Fair value overall. Works well enough, but keep your expectations realistic.',
  },
  {
    rating: 2,
    title: 'Could be better',
    review: 'Not quite up to par with expectations. Materials feel a bit cheaper than shown in pictures.',
  },
  {
    rating: 1,
    title: 'Disappointed with build quality',
    review: 'Expected much higher quality for this brand. Customer service was responsive, but product fell short for me.',
  },
];

export const seedReviews = async () => {
  try {
    console.log('🌱 Starting Reviews & Ratings Seeding...');

    // 1. Ensure demo users exist
    const userIds = [];
    for (const u of DEMO_USERS) {
      const [existing] = await pool.query('SELECT id FROM users WHERE email = ? LIMIT 1', [u.email]);
      if (existing.length > 0) {
        userIds.push(existing[0].id);
      } else {
        const [res] = await pool.query(
          'INSERT INTO users (firebase_uid, full_name, email) VALUES (?, ?, ?)',
          [u.uid, u.name, u.email],
        );
        userIds.push(res.insertId);
      }
    }

    // Drop table to ensure clean schema with user_id and title
    await pool.query('SET FOREIGN_KEY_CHECKS = 0');
    await pool.query('DROP TABLE IF EXISTS product_reviews');
    await pool.query('SET FOREIGN_KEY_CHECKS = 1');

    await pool.query(`
      CREATE TABLE product_reviews (
        id                BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        product_id         BIGINT UNSIGNED NOT NULL,
        user_id            BIGINT UNSIGNED NOT NULL,
        rating            INT             NOT NULL DEFAULT 5,
        title             VARCHAR(255)    NOT NULL,
        review            TEXT            NOT NULL,
        verified_purchase TINYINT(1)      NOT NULL DEFAULT 1,
        created_at         DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at         DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY uq_reviews_product_user (product_id, user_id),
        INDEX idx_reviews_product_id (product_id),
        INDEX idx_reviews_user_id (user_id),
        CONSTRAINT fk_reviews_product FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE,
        CONSTRAINT fk_reviews_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 2. Fetch all products
    const [products] = await pool.query('SELECT id, name FROM products');
    if (!products || products.length === 0) {
      console.log('⚠️ No products found in database to seed reviews for.');
      return;
    }

    console.log(`📦 Found ${products.length} products. Seeding 5–12 reviews per product...`);

    let totalReviewsInserted = 0;

    for (const product of products) {
      // Clear existing reviews to seed with user_id and title
      await pool.query('DELETE FROM product_reviews WHERE product_id = ?', [product.id]);

      // Seed 5 to 12 reviews
      const reviewTargetCount = 5 + (product.id % 8); // 5 to 12 reviews
      
      // Shuffle users copy to pick distinct user per review
      const availableUserIds = [...userIds].sort(() => 0.5 - Math.random());
      const selectedUsers = availableUserIds.slice(0, reviewTargetCount);

      for (let i = 0; i < selectedUsers.length; i++) {
        const userId = selectedUsers[i];
        
        // Pick template based on index and product ID for realistic variation
        const templateIndex = (product.id * 3 + i * 2) % REVIEW_TEMPLATES.length;
        const template = REVIEW_TEMPLATES[templateIndex];

        // Seed an order entry for this user so purchase verification passes
        const [ordRows] = await pool.query(
          `SELECT o.id FROM orders o 
           INNER JOIN order_items oi ON oi.order_id = o.id 
           WHERE o.user_id = ? AND oi.product_id = ? LIMIT 1`,
          [userId, product.id],
        );

        if (ordRows.length === 0) {
          const [ordRes] = await pool.query(
            `INSERT INTO orders (user_id, total_amount, order_status, payment_status, payment_method, shipping_address)
             VALUES (?, ?, 'Delivered', 'Paid', 'Credit/Debit Card', ?)`,
            [
              userId,
              99.99,
              JSON.stringify({ full_name: 'Verified Customer', address: '123 Main St', city: 'Metropolis' }),
            ],
          );
          await pool.query(
            'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, 1, 99.99)',
            [ordRes.insertId, product.id],
          );
        }

        // Generate date within past 60 days
        const daysAgo = Math.floor(Math.random() * 60);
        const createdAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)
          .toISOString()
          .slice(0, 19)
          .replace('T', ' ');

        const verifiedPurchase = Math.random() > 0.15 ? 1 : 0; // 85% verified

        await pool.query(
          `INSERT INTO product_reviews (product_id, user_id, rating, title, review, verified_purchase, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [product.id, userId, template.rating, template.title, template.review, verifiedPurchase, createdAt],
        );

        totalReviewsInserted++;
      }
    }

    console.log(`✅ Reviews seeding complete! Successfully inserted/verified ${totalReviewsInserted} reviews across ${products.length} products.`);
  } catch (err) {
    console.error('❌ Error seeding reviews:', err.message);
  }
};

// Run seeder
seedReviews()
  .then(() => {
    console.log('Done!');
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

