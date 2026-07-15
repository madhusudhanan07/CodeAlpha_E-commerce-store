import pool from './config/db.js';

async function revertProducts() {
  try {
    const slugsToDelete = [
      'quantum-noise-cancelling-headphones', 'ultrahd-4k-action-camera', 'ergonomic-wireless-mouse', 
      'mechanical-rgb-keyboard', 'smart-home-hub', 'portable-1tb-ssd', 'curved-gaming-monitor', 
      'classic-leather-jacket', 'minimalist-white-sneakers', 'vintage-denim-jeans', 'polarized-aviators', 
      'cotton-crewneck-sweater', 'canvas-tote-bag', 'waterproof-winter-coat', 'pragmatic-programmer-book', 
      'designing-data-intensive-applications', 'you-dont-know-js', 'clean-code', 'eloquent-javascript', 
      'mindset-book', 'dune-book', 'ceramic-pour-over', 'cast-iron-skillet-12', 'bamboo-cutting-board', 
      'stainless-mixing-bowls', 'air-purifier', 'cotton-bath-towels', 'alignment-yoga-mat', 
      'adjustable-dumbbells', 'resistance-bands-pack', 'steel-water-bottle', 'foam-roller', 
      'jump-rope', 'premium-leather-wallet', 'smart-fitness-tracker'
    ];
    
    await pool.query('DELETE FROM products WHERE slug IN (?)', [slugsToDelete]);
    console.log('Deleted the 35 inserted products.');

    // Also restore all base 20 original Unsplash images exactly as they were in ecommerce.sql/products_seed_addendum.sql
    const baseUnsplash = {
      'apple-iphone-15-pro': 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&h=600&fit=crop&q=85',
      'samsung-galaxy-s24-ultra': 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&h=600&fit=crop&q=85',
      'sony-wh-1000xm5': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop&q=85',
      'apple-macbook-air-m3': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop&q=85',
      'levis-501-original-jeans': 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=600&h=600&fit=crop&q=85',
      'nike-air-max-270': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop&q=85',
      'ray-ban-aviator-classic': 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=600&fit=crop&q=85',
      'adidas-ultraboost-23': 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&h=600&fit=crop&q=85',
      'instant-pot-duo-7-in-1': 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&h=600&fit=crop&q=85',
      'dyson-v15-detect-vacuum': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop&q=85',
      'ikea-kallax-shelf-unit': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=600&fit=crop&q=85',
      'nespresso-vertuo-pop': 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=600&fit=crop&q=85',
      'peloton-bike-plus': 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&h=600&fit=crop&q=85',
      'hydro-flask-32oz': 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&h=600&fit=crop&q=85',
      'yoga-mat-premium-non-slip': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=600&fit=crop&q=85',
      'bowflex-selecttech-552': 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=600&h=600&fit=crop&q=85'
    };

    for (const [s, u] of Object.entries(baseUnsplash)) {
      await pool.query('UPDATE products SET image_url = ? WHERE slug = ?', [u, s]);
    }
    console.log('Restored base images.');
    
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

revertProducts();
