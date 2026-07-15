import pool from './config/db.js';

const productsToInsert = [
  // Electronics
  { name: 'Quantum Noise-Cancelling Headphones', slug: 'quantum-noise-cancelling-headphones', catIndex: 0, price: 299.99, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=contain&w=600&q=80', stock: 15 },
  { name: 'UltraHD 4K Action Camera', slug: 'ultrahd-4k-action-camera', catIndex: 0, price: 199.50, image: 'https://images.unsplash.com/photo-1512753360435-329c4535a9a7?auto=format&fit=contain&w=600&q=80', stock: 40 },
  { name: 'Ergonomic Wireless Mouse', slug: 'ergonomic-wireless-mouse', catIndex: 0, price: 45.00, image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=contain&w=600&q=80', stock: 120 },
  { name: 'Mechanical RGB Keyboard', slug: 'mechanical-rgb-keyboard', catIndex: 0, price: 130.00, image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=contain&w=600&q=80', stock: 65 },
  { name: 'Smart Home Hub 2.0', slug: 'smart-home-hub', catIndex: 0, price: 99.99, image: 'https://images.unsplash.com/photo-1558089687-f282ffcbc126?auto=format&fit=contain&w=600&q=80', stock: 85 },
  { name: 'Portable 1TB SSD', slug: 'portable-1tb-ssd', catIndex: 0, price: 115.50, image: 'https://images.unsplash.com/photo-1597872253142-0f2c4cb71c77?auto=format&fit=contain&w=600&q=80', stock: 50 },
  { name: '27-inch Curved Gaming Monitor', slug: 'curved-gaming-monitor', catIndex: 0, price: 349.99, image: 'https://images.unsplash.com/photo-1527443154391-42861a55b0a3?auto=format&fit=contain&w=600&q=80', stock: 20 },
  
  // Fashion
  { name: 'Classic Leather Jacket', slug: 'classic-leather-jacket', catIndex: 1, price: 180.00, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=contain&w=600&q=80', stock: 35 },
  { name: 'Minimalist White Sneakers', slug: 'minimalist-white-sneakers', catIndex: 1, price: 85.00, image: 'https://images.unsplash.com/photo-1600181516264-3ea807fe3772?auto=format&fit=contain&w=600&q=80', stock: 150 },
  { name: 'Vintage Denim Jeans', slug: 'vintage-denim-jeans', catIndex: 1, price: 65.00, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=contain&w=600&q=80', stock: 90 },
  { name: 'Polarized Aviator Sunglasses', slug: 'polarized-aviators', catIndex: 1, price: 45.00, image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=contain&w=600&q=80', stock: 200 },
  { name: 'Cotton Crewneck Sweater', slug: 'cotton-crewneck-sweater', catIndex: 1, price: 55.00, image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=contain&w=600&q=80', stock: 110 },
  { name: 'Canvas Tote Bag', slug: 'canvas-tote-bag', catIndex: 1, price: 25.00, image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=contain&w=600&q=80', stock: 300 },
  { name: 'Waterproof Winter Coat', slug: 'waterproof-winter-coat', catIndex: 1, price: 140.00, image: 'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?auto=format&fit=contain&w=600&q=80', stock: 45 },

  // Books
  { name: 'The Pragmatic Programmer', slug: 'pragmatic-programmer-book', catIndex: 2, price: 42.00, image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=contain&w=600&q=80', stock: 75 },
  { name: 'Designing Data-Intensive Applications', slug: 'designing-data-intensive-applications', catIndex: 2, price: 38.50, image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=contain&w=600&q=80', stock: 60 },
  { name: 'You Don\'t Know JS Yet', slug: 'you-dont-know-js', catIndex: 2, price: 29.99, image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=contain&w=600&q=80', stock: 80 },
  { name: 'Clean Code: A Handbook', slug: 'clean-code', catIndex: 2, price: 45.00, image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=contain&w=600&q=80', stock: 110 },
  { name: 'Eloquent JavaScript', slug: 'eloquent-javascript', catIndex: 2, price: 35.00, image: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=contain&w=600&q=80', stock: 65 },
  { name: 'Mindset: The New Psychology', slug: 'mindset-book', catIndex: 2, price: 18.00, image: 'https://images.unsplash.com/photo-1589998059171-989d887dda6e?auto=format&fit=contain&w=600&q=80', stock: 150 },
  { name: 'Dune - Hardcover Edition', slug: 'dune-book', catIndex: 2, price: 25.00, image: 'https://images.unsplash.com/photo-1614113489855-66422ad300a4?auto=format&fit=contain&w=600&q=80', stock: 120 },

  // Home & Kitchen
  { name: 'Ceramic Pour-Over Coffee Maker', slug: 'ceramic-pour-over', catIndex: 3, price: 35.50, image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=contain&w=600&q=80', stock: 95 },
  { name: 'Cast Iron Skillet (12-inch)', slug: 'cast-iron-skillet-12', catIndex: 3, price: 49.99, image: 'https://images.unsplash.com/photo-1585675549007-9b25134106bb?auto=format&fit=contain&w=600&q=80', stock: 55 },
  { name: 'Bamboo Cutting Board Set', slug: 'bamboo-cutting-board', catIndex: 3, price: 24.00, image: 'https://images.unsplash.com/photo-1576020739985-055a43292434?auto=format&fit=contain&w=600&q=80', stock: 130 },
  { name: 'Stainless Steel Mixing Bowls', slug: 'stainless-mixing-bowls', catIndex: 3, price: 29.99, image: 'https://images.unsplash.com/photo-1601646279140-5aa56396f927?auto=format&fit=contain&w=600&q=80', stock: 40 },
  { name: 'Air Purifier for Bedroom', slug: 'air-purifier', catIndex: 3, price: 110.00, image: 'https://images.unsplash.com/photo-1584269600519-112d071b65e6?auto=format&fit=contain&w=600&q=80', stock: 65 },
  { name: 'Luxury Cotton Bath Towels', slug: 'cotton-bath-towels', catIndex: 3, price: 40.00, image: 'https://images.unsplash.com/photo-1583335513577-224a1795c479?auto=format&fit=contain&w=600&q=80', stock: 180 },

  // Sports
  { name: 'Yoga Mat with Alignment Lines', slug: 'alignment-yoga-mat', catIndex: 4, price: 32.00, image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=contain&w=600&q=80', stock: 200 },
  { name: 'Adjustable Dumbbell Set', slug: 'adjustable-dumbbells', catIndex: 4, price: 150.00, image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=contain&w=600&q=80', stock: 35 },
  { name: 'Resistance Band Pack', slug: 'resistance-bands-pack', catIndex: 4, price: 15.99, image: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?auto=format&fit=contain&w=600&q=80', stock: 300 },
  { name: 'Insulated Stainless Steel Water Bottle', slug: 'steel-water-bottle', catIndex: 4, price: 25.00, image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=contain&w=600&q=80', stock: 250 },
  { name: 'Foam Roller for Muscle Massage', slug: 'foam-roller', catIndex: 4, price: 20.00, image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=contain&w=600&q=80', stock: 120 },
  { name: 'High-Speed Jump Rope', slug: 'jump-rope', catIndex: 4, price: 12.50, image: 'https://images.unsplash.com/photo-1580261450046-d0a30080dc9b?auto=format&fit=contain&w=600&q=80', stock: 400 },
  
  // Extra featured mixed
  { name: 'Premium Leather Wallet', slug: 'premium-leather-wallet', catIndex: 1, price: 45.00, image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=contain&w=600&q=80', stock: 90 },
  { name: 'Smart Fitness Tracker Watch', slug: 'smart-fitness-tracker', catIndex: 0, price: 89.99, image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b2?auto=format&fit=contain&w=600&q=80', stock: 110 }
];

async function seed() {
  try {
    const [categories] = await pool.query('SELECT id, slug FROM categories');
    if (categories.length === 0) {
      console.log('No categories found. Run base seed first.');
      process.exit(1);
    }
    
    // Sort categories or map them correctly (usually 1: electronics, 2: fashion...)
    // Let's just create an array of category IDs
    const categoryIds = categories.map(c => c.id);

    for (const p of productsToInsert) {
      const catId = categoryIds[p.catIndex] || categoryIds[0];
      const desc = `Experience the amazing quality of ${p.name}. Built with top-tier materials to last and impress. Perfect for your daily needs!`;
      
      try {
        await pool.query(
          `INSERT INTO products (category_id, name, slug, description, price, stock, image_url, is_featured) 
           VALUES (?, ?, ?, ?, ?, ?, ?, 0) 
           ON DUPLICATE KEY UPDATE stock = values(stock)`,
          [catId, p.name, p.slug, desc, p.price, p.stock, p.image]
        );
        console.log(`Inserted ${p.name}`);
      } catch (e) {
        console.log(`Failed to insert ${p.name}: ${e.message}`);
      }
    }
    
    // Let's make some of the new products featured
    await pool.query('UPDATE products SET is_featured=1 WHERE slug IN ("quantum-noise-cancelling-headphones", "classic-leather-jacket", "adjustable-dumbbells")');
    
    console.log('Finished inserting extra products to reach 50+!');
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
}

seed();
