import pool from './config/db.js';

const productsToFix = [
  // Electronics (slug: electronics)
  { slug: 'quantum-noise-cancelling-headphones', catSlug: 'electronics', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&h=450&q=80' },
  { slug: 'ultrahd-4k-action-camera', catSlug: 'electronics', image: 'https://images.unsplash.com/photo-1512753360435-329c4535a9a7?auto=format&fit=crop&w=600&h=450&q=80' },
  { slug: 'ergonomic-wireless-mouse', catSlug: 'electronics', image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=600&h=450&q=80' },
  { slug: 'mechanical-rgb-keyboard', catSlug: 'electronics', image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=600&h=450&q=80' },
  { slug: 'smart-home-hub', catSlug: 'electronics', image: 'https://images.unsplash.com/photo-1558089687-f282ffcbc126?auto=format&fit=crop&w=600&h=450&q=80' },
  { slug: 'portable-1tb-ssd', catSlug: 'electronics', image: 'https://images.unsplash.com/photo-1597872253142-0f2c4cb71c77?auto=format&fit=crop&w=600&h=450&q=80' },
  { slug: 'curved-gaming-monitor', catSlug: 'electronics', image: 'https://images.unsplash.com/photo-1527443154391-42861a55b0a3?auto=format&fit=crop&w=600&h=450&q=80' },
  
  // Fashion (slug: fashion)
  { slug: 'classic-leather-jacket', catSlug: 'fashion', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&h=450&q=80' },
  { slug: 'minimalist-white-sneakers', catSlug: 'fashion', image: 'https://images.unsplash.com/photo-1600181516264-3ea807fe3772?auto=format&fit=crop&w=600&h=450&q=80' },
  { slug: 'vintage-denim-jeans', catSlug: 'fashion', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=600&h=450&q=80' },
  { slug: 'polarized-aviators', catSlug: 'fashion', image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&h=450&q=80' },
  { slug: 'cotton-crewneck-sweater', catSlug: 'fashion', image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=600&h=450&q=80' },
  { slug: 'canvas-tote-bag', catSlug: 'fashion', image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=600&h=450&q=80' },
  { slug: 'waterproof-winter-coat', catSlug: 'fashion', image: 'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?auto=format&fit=crop&w=600&h=450&q=80' },

  // Books (slug: books)
  { slug: 'pragmatic-programmer-book', catSlug: 'books', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&h=450&q=80' },
  { slug: 'designing-data-intensive-applications', catSlug: 'books', image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=600&h=450&q=80' },
  { slug: 'you-dont-know-js', catSlug: 'books', image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=600&h=450&q=80' },
  { slug: 'clean-code', catSlug: 'books', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&h=450&q=80' },
  { slug: 'eloquent-javascript', catSlug: 'books', image: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=600&h=450&q=80' },
  { slug: 'mindset-book', catSlug: 'books', image: 'https://images.unsplash.com/photo-1589998059171-989d887dda6e?auto=format&fit=crop&w=600&h=450&q=80' },
  { slug: 'dune-book', catSlug: 'books', image: 'https://images.unsplash.com/photo-1614113489855-66422ad300a4?auto=format&fit=crop&w=600&h=450&q=80' },

  // Home & Kitchen (slug: home-kitchen)
  { slug: 'ceramic-pour-over', catSlug: 'home-kitchen', image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=600&h=450&q=80' },
  { slug: 'cast-iron-skillet-12', catSlug: 'home-kitchen', image: 'https://images.unsplash.com/photo-1585675549007-9b25134106bb?auto=format&fit=crop&w=600&h=450&q=80' },
  { slug: 'bamboo-cutting-board', catSlug: 'home-kitchen', image: 'https://images.unsplash.com/photo-1576020739985-055a43292434?auto=format&fit=crop&w=600&h=450&q=80' },
  { slug: 'stainless-mixing-bowls', catSlug: 'home-kitchen', image: 'https://images.unsplash.com/photo-1601646279140-5aa56396f927?auto=format&fit=crop&w=600&h=450&q=80' },
  { slug: 'air-purifier', catSlug: 'home-kitchen', image: 'https://images.unsplash.com/photo-1584269600519-112d071b65e6?auto=format&fit=crop&w=600&h=450&q=80' },
  { slug: 'cotton-bath-towels', catSlug: 'home-kitchen', image: 'https://images.unsplash.com/photo-1583335513577-224a1795c479?auto=format&fit=crop&w=600&h=450&q=80' },

  // Sports (slug: sports)
  { slug: 'alignment-yoga-mat', catSlug: 'sports', image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=600&h=450&q=80' },
  { slug: 'adjustable-dumbbells', catSlug: 'sports', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&h=450&q=80' },
  { slug: 'resistance-bands-pack', catSlug: 'sports', image: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?auto=format&fit=crop&w=600&h=450&q=80' },
  { slug: 'steel-water-bottle', catSlug: 'sports', image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&h=450&q=80' },
  { slug: 'foam-roller', catSlug: 'sports', image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&h=450&q=80' },
  { slug: 'jump-rope', catSlug: 'sports', image: 'https://images.unsplash.com/photo-1580261450046-d0a30080dc9b?auto=format&fit=crop&w=600&h=450&q=80' },
  
  // Extra featured mixed
  { slug: 'premium-leather-wallet', catSlug: 'fashion', image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&h=450&q=80' },
  { slug: 'smart-fitness-tracker', catSlug: 'electronics', image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b2?auto=format&fit=crop&w=600&h=450&q=80' }
];

async function runFixes() {
  try {
    const [categories] = await pool.query('SELECT id, slug FROM categories');
    
    // Map category slug to its ID in the database
    const slugToIdMap = {};
    for (const cat of categories) {
      slugToIdMap[cat.slug] = cat.id;
    }

    for (const p of productsToFix) {
      const correctCatId = slugToIdMap[p.catSlug];
      if (!correctCatId) {
        console.warn('Could not find category for ' + p.catSlug);
        continue;
      }
      
      try {
        await pool.query(
          `UPDATE products SET category_id = ?, image_url = ? WHERE slug = ?`,
          [correctCatId, p.image, p.slug]
        );
        console.log(`Updated ${p.slug} with ID ${correctCatId}`);
      } catch (e) {
        console.log(`Failed to update ${p.slug}: ${e.message}`);
      }
    }

    console.log('Finished fixing categories and images!');
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
}

runFixes();
