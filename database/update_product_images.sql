-- =============================================================================
-- Update Product Images — Unsplash (hotlink-friendly, always available)
-- Run this against your existing `codealpha_ecommerce` database.
-- =============================================================================

USE `codealpha_ecommerce`;

-- ── Electronics ───────────────────────────────────────────────────────────────

-- Apple iPhone 15 Pro
UPDATE `products` SET `image_url` =
  'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&h=600&fit=crop&q=85'
WHERE `slug` = 'apple-iphone-15-pro';

-- Samsung Galaxy S24 Ultra
UPDATE `products` SET `image_url` =
  'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&h=600&fit=crop&q=85'
WHERE `slug` = 'samsung-galaxy-s24-ultra';

-- Sony WH-1000XM5 Headphones
UPDATE `products` SET `image_url` =
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop&q=85'
WHERE `slug` = 'sony-wh-1000xm5';

-- Apple MacBook Air M3
UPDATE `products` SET `image_url` =
  'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop&q=85'
WHERE `slug` = 'apple-macbook-air-m3';

-- ── Fashion ───────────────────────────────────────────────────────────────────

-- Levi's 501 Original Jeans
UPDATE `products` SET `image_url` =
  'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=600&h=600&fit=crop&q=85'
WHERE `slug` = 'levis-501-original-jeans';

-- Nike Air Max 270
UPDATE `products` SET `image_url` =
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop&q=85'
WHERE `slug` = 'nike-air-max-270';

-- Ray-Ban Aviator Classic Sunglasses
UPDATE `products` SET `image_url` =
  'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=600&fit=crop&q=85'
WHERE `slug` = 'ray-ban-aviator-classic';

-- Adidas Ultraboost 23
UPDATE `products` SET `image_url` =
  'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&h=600&fit=crop&q=85'
WHERE `slug` = 'adidas-ultraboost-23';

-- ── Books ─────────────────────────────────────────────────────────────────────

-- Atomic Habits
UPDATE `products` SET `image_url` =
  'https://m.media-amazon.com/images/I/81wgcld4wxL._AC_UF1000,1000_QL80_.jpg'
WHERE `slug` = 'atomic-habits-james-clear';

-- The Pragmatic Programmer
UPDATE `products` SET `image_url` =
  'https://m.media-amazon.com/images/I/71VStSjZmpL._AC_UF1000,1000_QL80_.jpg'
WHERE `slug` = 'the-pragmatic-programmer';

-- Deep Work
UPDATE `products` SET `image_url` =
  'https://m.media-amazon.com/images/I/51vmivI5KvL._AC_UF1000,1000_QL80_.jpg'
WHERE `slug` = 'deep-work-cal-newport';

-- Clean Code
UPDATE `products` SET `image_url` =
  'https://m.media-amazon.com/images/I/41xShlnTZTL._AC_UF1000,1000_QL80_.jpg'
WHERE `slug` = 'clean-code-robert-martin';

-- ── Home & Kitchen ────────────────────────────────────────────────────────────

-- Instant Pot Duo 7-in-1
UPDATE `products` SET `image_url` =
  'https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&h=600&fit=crop&q=85'
WHERE `slug` = 'instant-pot-duo-7-in-1';

-- Dyson V15 Detect Vacuum
UPDATE `products` SET `image_url` =
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop&q=85'
WHERE `slug` = 'dyson-v15-detect-vacuum';

-- IKEA KALLAX Shelf Unit
UPDATE `products` SET `image_url` =
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=600&fit=crop&q=85'
WHERE `slug` = 'ikea-kallax-shelf-unit';

-- Nespresso Vertuo Pop
UPDATE `products` SET `image_url` =
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=600&fit=crop&q=85'
WHERE `slug` = 'nespresso-vertuo-pop';

-- ── Sports ────────────────────────────────────────────────────────────────────

-- Peloton Bike+
UPDATE `products` SET `image_url` =
  'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&h=600&fit=crop&q=85'
WHERE `slug` = 'peloton-bike-plus';

-- Hydro Flask 32 oz
UPDATE `products` SET `image_url` =
  'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&h=600&fit=crop&q=85'
WHERE `slug` = 'hydro-flask-32oz';

-- Yoga Mat Premium Non-Slip
UPDATE `products` SET `image_url` =
  'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=600&fit=crop&q=85'
WHERE `slug` = 'yoga-mat-premium-non-slip';

-- Bowflex SelectTech 552 Dumbbells
UPDATE `products` SET `image_url` =
  'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=600&h=600&fit=crop&q=85'
WHERE `slug` = 'bowflex-selecttech-552';

-- Verify results
SELECT id, name, SUBSTRING(image_url, 1, 60) AS image_preview FROM `products` ORDER BY id;
