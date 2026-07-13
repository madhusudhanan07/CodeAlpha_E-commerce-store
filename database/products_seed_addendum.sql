-- =============================================================================
-- products_seed_addendum.sql
-- Run this ONLY if you already ran ecommerce.sql but want to re-seed the
-- products and categories tables without dropping everything else.
-- =============================================================================
-- Note: The full schema (including the products table) is already in
-- ecommerce.sql. The products table was designed with:
--   id, category_id, name, slug, description, image_url, price, stock,
--   is_featured, created_at, updated_at
-- =============================================================================

USE `codealpha_ecommerce`;

-- Re-seed categories (safe — INSERT IGNORE skips duplicates)
INSERT IGNORE INTO `categories` (`id`, `name`, `slug`, `description`) VALUES
  (1, 'Electronics',    'electronics',   'Smartphones, laptops, accessories and all things tech.'),
  (2, 'Fashion',        'fashion',       'Clothing, footwear, and lifestyle accessories for every style.'),
  (3, 'Books',          'books',         'Bestsellers, textbooks, fiction, non-fiction and more.'),
  (4, 'Home & Kitchen', 'home-kitchen',  'Everything you need to make your home comfortable and stylish.'),
  (5, 'Sports',         'sports',        'Fitness equipment, outdoor gear, and sportswear.');

-- Re-seed products (12+ realistic products covering Electronics, Fashion, Books)
INSERT IGNORE INTO `products`
  (`category_id`, `name`, `slug`, `description`, `image_url`, `price`, `stock`, `is_featured`)
VALUES

-- ── Electronics (category_id = 1) ──────────────────────────────────────────
(1, 'Apple iPhone 15 Pro',
    'apple-iphone-15-pro',
    'Apple iPhone 15 Pro with A17 Pro chip, 48 MP main camera, USB-C, and titanium design.',
    'https://placehold.co/600x400/1a1a24/6c63ff?text=iPhone+15+Pro',
    1199.99, 85, 1),

(1, 'Samsung Galaxy S24 Ultra',
    'samsung-galaxy-s24-ultra',
    'Samsung flagship with built-in S Pen, 200 MP camera, and AI-powered features.',
    'https://placehold.co/600x400/1a1a24/6c63ff?text=Galaxy+S24+Ultra',
    1299.99, 60, 1),

(1, 'Sony WH-1000XM5 Headphones',
    'sony-wh-1000xm5',
    'Industry-leading noise-cancelling wireless headphones with 30-hr battery life.',
    'https://placehold.co/600x400/1a1a24/6c63ff?text=Sony+WH-1000XM5',
    349.99, 120, 0),

(1, 'Apple MacBook Air M3',
    'apple-macbook-air-m3',
    '13-inch MacBook Air with Apple M3 chip, 16 GB RAM, 512 GB SSD, Liquid Retina display.',
    'https://placehold.co/600x400/1a1a24/6c63ff?text=MacBook+Air+M3',
    1299.00, 45, 1),

-- ── Fashion (category_id = 2) ───────────────────────────────────────────────
(2, 'Levi\'s 501 Original Jeans',
    'levis-501-original-jeans',
    'The iconic straight-fit jeans. 100% cotton denim, button fly, available in multiple washes.',
    'https://placehold.co/600x400/1a1a24/f59e0b?text=Levis+501',
    69.99, 200, 0),

(2, 'Nike Air Max 270',
    'nike-air-max-270',
    'Lifestyle sneaker with the biggest heel Air unit yet for all-day comfort.',
    'https://placehold.co/600x400/1a1a24/f59e0b?text=Nike+Air+Max+270',
    150.00, 180, 1),

(2, 'Ray-Ban Aviator Classic Sunglasses',
    'ray-ban-aviator-classic',
    'Timeless aviator sunglasses with crystal green lenses and gold metal frame.',
    'https://placehold.co/600x400/1a1a24/f59e0b?text=RayBan+Aviator',
    154.00, 95, 0),

(2, 'Adidas Ultraboost 23',
    'adidas-ultraboost-23',
    'Premium running shoe with Boost midsole technology for energy return with every step.',
    'https://placehold.co/600x400/1a1a24/f59e0b?text=Ultraboost+23',
    190.00, 140, 0),

-- ── Books (category_id = 3) ─────────────────────────────────────────────────
(3, 'Atomic Habits by James Clear',
    'atomic-habits-james-clear',
    'A practical guide on building good habits and breaking bad ones. #1 NYT Bestseller.',
    'https://placehold.co/600x400/1a1a24/22c55e?text=Atomic+Habits',
    16.99, 500, 1),

(3, 'The Pragmatic Programmer',
    'the-pragmatic-programmer',
    '20th Anniversary Edition. Your journey to mastery — essential reading for software engineers.',
    'https://placehold.co/600x400/1a1a24/22c55e?text=Pragmatic+Programmer',
    49.99, 210, 1),

(3, 'Deep Work by Cal Newport',
    'deep-work-cal-newport',
    'Rules for focused success in a distracted world. A must-read for knowledge workers.',
    'https://placehold.co/600x400/1a1a24/22c55e?text=Deep+Work',
    17.99, 340, 0),

(3, 'Clean Code by Robert C. Martin',
    'clean-code-robert-martin',
    'A handbook of agile software craftsmanship. Essential for writing maintainable code.',
    'https://placehold.co/600x400/1a1a24/22c55e?text=Clean+Code',
    35.99, 260, 0);

-- =============================================================================
-- END OF SEED ADDENDUM
-- =============================================================================
