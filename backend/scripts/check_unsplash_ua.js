import 'dotenv/config';

const urlCache = {
  headphones: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
  camera: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=600&fit=crop',
  mouse: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&h=600&fit=crop',
  keyboard: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&h=600&fit=crop',
  smart_home: 'https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=600&h=600&fit=crop',
  ssd: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=600&fit=crop',
  monitor: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&h=600&fit=crop',
  fitness_tracker: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b2?w=600&h=600&fit=crop',
  leather_jacket: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=600&fit=crop',
  sneakers: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=600&fit=crop',
  jeans: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=600&fit=crop',
  sunglasses: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&h=600&fit=crop',
  sweater: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&h=600&fit=crop',
  tote_bag: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&h=600&fit=crop',
  winter_coat: 'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=600&h=600&fit=crop',
  wallet: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&h=600&fit=crop',
  book_pragmatic: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5d6?w=600&h=600&fit=crop',
  book_data: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop',
  book_js: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=600&h=600&fit=crop',
  book_clean: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=600&fit=crop',
  book_eloquent: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&h=600&fit=crop',
  book_mindset: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&h=600&fit=crop',
  book_dune: 'https://images.unsplash.com/photo-1531988042231-d39a9cc12a9a?w=600&h=600&fit=crop',
  coffee_maker: 'https://images.unsplash.com/photo-1517256064527-09c53b2d0bc6?w=600&h=600&fit=crop',
  skillet: 'https://images.unsplash.com/photo-1585675549007-9b25134106bb?w=600&h=600&fit=crop',
  cutting_board: 'https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?w=600&h=600&fit=crop',
  mixing_bowls: 'https://images.unsplash.com/photo-1574656562475-300dd34b82bc?w=600&h=600&fit=crop',
  air_purifier: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=600&h=600&fit=crop',
  bath_towels: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=600&h=600&fit=crop',
  yoga_mat: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&h=600&fit=crop',
  dumbbells: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=600&fit=crop',
  resistance_bands: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&h=600&fit=crop',
  water_bottle: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&h=600&fit=crop',
  foam_roller: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=600&fit=crop',
  jump_rope: 'https://images.unsplash.com/photo-1580261450046-d0a30080dc9b?w=600&h=600&fit=crop',
  vitamin_c: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=600&fit=crop',
  hyaluronic: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=600&fit=crop',
  face_mask: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=600&fit=crop',
  facial_brush: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=600&fit=crop',
  backpack: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop',
  crossbody_bag: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=600&fit=crop',
  suitcase: 'https://images.unsplash.com/photo-1596484552834-6a52f4d5eb6c?w=600&h=600&fit=crop',
  card_holder: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&h=600&fit=crop',
  gaming_mouse: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&h=600&fit=crop',
  gaming_keyboard: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=600&h=600&fit=crop',
  gaming_headset: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
  gaming_chair: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=600&h=600&fit=crop',
  mousepad: 'https://images.unsplash.com/photo-1593640495253-23196b27a87f?w=600&h=600&fit=crop'
};

const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

async function checkAll() {
  console.log('Verifying image URLs...');
  for (const [key, url] of Object.entries(urlCache)) {
    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent': userAgent
        }
      });
      if (res.status !== 200) {
        console.log(`❌ FAILED (${res.status}): ${key} -> ${url}`);
      } else {
        console.log(`✅ OK (200): ${key}`);
      }
    } catch (err) {
      console.log(`❌ ERROR: ${key} -> ${url} (${err.message})`);
    }
  }
  console.log('Verification completed.');
}

checkAll();
