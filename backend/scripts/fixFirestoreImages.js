import 'dotenv/config';
import db from '../config/db.js';

const urlCache = {
  // Electronics
  headphones: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
  camera: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=600&fit=crop',
  mouse: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&h=600&fit=crop',
  keyboard: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&h=600&fit=crop',
  smart_home: 'https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=600&h=600&fit=crop',
  ssd: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=600&fit=crop',
  monitor: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&h=600&fit=crop',
  fitness_tracker: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&h=600&fit=crop',

  // Fashion
  leather_jacket: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=600&fit=crop',
  sneakers: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=600&fit=crop',
  jeans: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=600&fit=crop',
  sunglasses: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&h=600&fit=crop',
  sweater: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&h=600&fit=crop',
  tote_bag: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&h=600&fit=crop',
  winter_coat: 'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=600&h=600&fit=crop',
  wallet: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&h=600&fit=crop',

  // Books
  book_pragmatic: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop',
  book_data: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop',
  book_js: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=600&h=600&fit=crop',
  book_clean: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=600&fit=crop',
  book_eloquent: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&h=600&fit=crop',
  book_mindset: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&h=600&fit=crop',
  book_dune: 'https://images.unsplash.com/photo-1531988042231-d39a9cc12a9a?w=600&h=600&fit=crop',

  // Home & Kitchen
  coffee_maker: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=600&fit=crop',
  skillet: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=600&h=600&fit=crop',
  cutting_board: 'https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?w=600&h=600&fit=crop',
  mixing_bowls: 'https://images.unsplash.com/photo-1581600140682-d4e68c8c5048?w=600&h=600&fit=crop',
  air_purifier: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=600&h=600&fit=crop',
  bath_towels: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=600&h=600&fit=crop',

  // Sports & Fitness
  yoga_mat: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&h=600&fit=crop',
  dumbbells: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=600&fit=crop',
  resistance_bands: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&h=600&fit=crop',
  water_bottle: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&h=600&fit=crop',
  foam_roller: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=600&fit=crop',
  jump_rope: 'https://images.unsplash.com/photo-1580261450046-d0a30080dc9b?w=600&h=600&fit=crop',

  // Beauty & Personal Care
  vitamin_c: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=600&fit=crop',
  hyaluronic: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600&h=600&fit=crop',
  face_mask: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=600&fit=crop',
  facial_brush: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=600&fit=crop',

  // Bags & Accessories
  backpack: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop',
  crossbody_bag: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=600&fit=crop',
  suitcase: 'https://images.unsplash.com/photo-1581553680321-4fffae59fccd?w=600&h=600&fit=crop',
  card_holder: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&h=600&fit=crop',

  // Gaming
  gaming_mouse: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&h=600&fit=crop',
  gaming_keyboard: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=600&h=600&fit=crop',
  gaming_headset: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
  gaming_chair: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=600&h=600&fit=crop',
  mousepad: 'https://images.unsplash.com/photo-1593640495253-23196b27a87f?w=600&h=600&fit=crop'
};

const findImage = (slug, category_id) => {
  const s = slug.toLowerCase();
  
  if (s.includes('headphone') || s.includes('headset')) return urlCache.headphones;
  if (s.includes('camera')) return urlCache.camera;
  if (s.includes('mouse') && s.includes('gaming')) return urlCache.gaming_mouse;
  if (s.includes('mouse')) return urlCache.mouse;
  if (s.includes('keyboard') && s.includes('gaming')) return urlCache.gaming_keyboard;
  if (s.includes('keyboard')) return urlCache.keyboard;
  if (s.includes('smart-home') || s.includes('hub')) return urlCache.smart_home;
  if (s.includes('ssd')) return urlCache.ssd;
  if (s.includes('monitor')) return urlCache.monitor;
  if (s.includes('tracker') || s.includes('watch')) return urlCache.fitness_tracker;

  if (s.includes('jacket') || s.includes('coat')) return urlCache.leather_jacket;
  if (s.includes('sneaker')) return urlCache.sneakers;
  if (s.includes('jean')) return urlCache.jeans;
  if (s.includes('sunglass') || s.includes('aviator')) return urlCache.sunglasses;
  if (s.includes('sweater')) return urlCache.sweater;
  if (s.includes('tote') || s.includes('bag') && s.includes('canvas')) return urlCache.tote_bag;
  if (s.includes('winter') || s.includes('coat')) return urlCache.winter_coat;
  if (s.includes('wallet') && s.includes('leather')) return urlCache.wallet;

  if (s.includes('pragmatic')) return urlCache.book_pragmatic;
  if (s.includes('intensive') || s.includes('data')) return urlCache.book_data;
  if (s.includes('know-js')) return urlCache.book_js;
  if (s.includes('clean-code')) return urlCache.book_clean;
  if (s.includes('eloquent')) return urlCache.book_eloquent;
  if (s.includes('mindset')) return urlCache.book_mindset;
  if (s.includes('dune')) return urlCache.book_dune;

  if (s.includes('pour-over') || s.includes('coffee')) return urlCache.coffee_maker;
  if (s.includes('skillet') || s.includes('pan')) return urlCache.skillet;
  if (s.includes('cutting-board') || s.includes('bamboo')) return urlCache.cutting_board;
  if (s.includes('bowl')) return urlCache.mixing_bowls;
  if (s.includes('purifier')) return urlCache.air_purifier;
  if (s.includes('towel')) return urlCache.bath_towels;

  if (s.includes('yoga') || s.includes('mat')) return urlCache.yoga_mat;
  if (s.includes('dumbbell')) return urlCache.dumbbells;
  if (s.includes('band')) return urlCache.resistance_bands;
  if (s.includes('bottle')) return urlCache.water_bottle;
  if (s.includes('roller')) return urlCache.foam_roller;
  if (s.includes('rope')) return urlCache.jump_rope;

  if (s.includes('vitamin') || s.includes('serum')) return urlCache.vitamin_c;
  if (s.includes('hyaluronic') || s.includes('moisturizer')) return urlCache.hyaluronic;
  if (s.includes('charcoal') || s.includes('mask')) return urlCache.face_mask;
  if (s.includes('brush') || s.includes('facial')) return urlCache.facial_brush;

  if (s.includes('backpack')) return urlCache.backpack;
  if (s.includes('crossbody')) return urlCache.crossbody_bag;
  if (s.includes('suitcase') || s.includes('carry-on')) return urlCache.suitcase;
  if (s.includes('card-holder') || s.includes('wallet')) return urlCache.card_holder;

  if (s.includes('chair')) return urlCache.gaming_chair;
  if (s.includes('mousepad')) return urlCache.mousepad;

  // Generic category fallbacks
  const cat = String(category_id);
  if (cat === '1') return urlCache.headphones;
  if (cat === '2') return urlCache.tshirt;
  if (cat === '3') return urlCache.book_pragmatic;
  if (cat === '4') return urlCache.coffee_maker;
  if (cat === '5') return urlCache.dumbbells;
  if (cat === '6') return urlCache.vitamin_c;
  if (cat === '7') return urlCache.backpack;
  if (cat === '8') return urlCache.gaming_mouse;

  return urlCache.headphones;
};

async function run() {
  console.log('Fetching products from Firestore...');
  const snap = await db.collection('products').get();
  console.log(`Found ${snap.size} products. Updating image URLs...`);
  
  const batch = db.batch();
  let updatedCount = 0;

  snap.forEach((doc) => {
    const data = doc.data();
    const matchedUrl = findImage(data.slug || '', data.category_id);
    
    batch.update(doc.ref, {
      image_url: matchedUrl,
      images: [{ image_url: matchedUrl, display_order: 0 }]
    });
    
    updatedCount++;
    console.log(`  Mapped "${data.name}" -> ${matchedUrl}`);
  });

  await batch.commit();
  console.log(`\n🎉 Success! Updated ${updatedCount} products in Firestore.`);
  process.exit(0);
}

run().catch((err) => {
  console.error('Error fixing Firestore images:', err);
  process.exit(1);
});
