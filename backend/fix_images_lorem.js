import pool from './config/db.js';

const imagesToUpdates = {
  // Electronics
  'quantum-noise-cancelling-headphones': 'https://loremflickr.com/600/450/headphones?lock=1',
  'ultrahd-4k-action-camera': 'https://loremflickr.com/600/450/camera?lock=2',
  'ergonomic-wireless-mouse': 'https://loremflickr.com/600/450/mouse,computer?lock=3',
  'mechanical-rgb-keyboard': 'https://loremflickr.com/600/450/keyboard?lock=4',
  'smart-home-hub': 'https://loremflickr.com/600/450/smarthome?lock=5',
  'portable-1tb-ssd': 'https://loremflickr.com/600/450/harddrive?lock=6',
  'curved-gaming-monitor': 'https://loremflickr.com/600/450/monitor,computer?lock=7',
  'smart-fitness-tracker': 'https://loremflickr.com/600/450/watch,fitness?lock=8',
  
  // Fashion
  'classic-leather-jacket': 'https://loremflickr.com/600/450/jacket,leather?lock=11',
  'minimalist-white-sneakers': 'https://loremflickr.com/600/450/sneakers,white?lock=12',
  'vintage-denim-jeans': 'https://loremflickr.com/600/450/jeans,denim?lock=13',
  'polarized-aviators': 'https://loremflickr.com/600/450/sunglasses?lock=14',
  'cotton-crewneck-sweater': 'https://loremflickr.com/600/450/sweater?lock=15',
  'canvas-tote-bag': 'https://loremflickr.com/600/450/bag,tote?lock=16',
  'waterproof-winter-coat': 'https://loremflickr.com/600/450/coat,winter?lock=17',
  'premium-leather-wallet': 'https://loremflickr.com/600/450/wallet,leather?lock=18',

  // Books
  'pragmatic-programmer-book': 'https://m.media-amazon.com/images/I/71VStSjZmpL._AC_UF1000,1000_QL80_.jpg', // Real cover
  'designing-data-intensive-applications': 'https://loremflickr.com/600/450/book,data?lock=22',
  'you-dont-know-js': 'https://loremflickr.com/600/450/book,javascript?lock=23',
  'clean-code': 'https://m.media-amazon.com/images/I/41xShlnTZTL._AC_UF1000,1000_QL80_.jpg', // Real cover
  'eloquent-javascript': 'https://loremflickr.com/600/450/book,code?lock=25',
  'mindset-book': 'https://loremflickr.com/600/450/book,psychology?lock=26',
  'dune-book': 'https://loremflickr.com/600/450/book,scifi?lock=27',

  // Home & Kitchen
  'ceramic-pour-over': 'https://loremflickr.com/600/450/coffee,maker?lock=31',
  'cast-iron-skillet-12': 'https://loremflickr.com/600/450/skillet,pan?lock=32',
  'bamboo-cutting-board': 'https://loremflickr.com/600/450/cuttingboard,wood?lock=33',
  'stainless-mixing-bowls': 'https://loremflickr.com/600/450/bowl,kitchen?lock=34',
  'air-purifier': 'https://loremflickr.com/600/450/appliance,home?lock=35',
  'cotton-bath-towels': 'https://loremflickr.com/600/450/towels,bath?lock=36',

  // Sports
  'alignment-yoga-mat': 'https://loremflickr.com/600/450/yoga,mat?lock=41',
  'adjustable-dumbbells': 'https://loremflickr.com/600/450/dumbbells?lock=42',
  'resistance-bands-pack': 'https://loremflickr.com/600/450/fitness,bands?lock=43',
  'steel-water-bottle': 'https://loremflickr.com/600/450/waterbottle?lock=44',
  'foam-roller': 'https://loremflickr.com/600/450/foamroller?lock=45',
  'jump-rope': 'https://loremflickr.com/600/450/jumprope?lock=46'
};

async function fixImages() {
  try {
    for (const [slug, url] of Object.entries(imagesToUpdates)) {
      try {
        await pool.query(
          `UPDATE products SET image_url = ? WHERE slug = ?`,
          [url, slug]
        );
        console.log(`Updated ${slug} with a unique suitable image.`);
      } catch (e) {
        console.error(`Failed to update ${slug}: ${e.message}`);
      }
    }
    console.log('Finished fixing all duplicate and mismatched images!');
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
}

fixImages();
