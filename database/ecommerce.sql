-- =============================================================================
-- CodeAlpha E-Commerce Store — Database Schema
-- =============================================================================
-- Engine  : InnoDB
-- Charset : utf8mb4 / utf8mb4_unicode_ci
-- MySQL   : 8.0+
--
-- Execution order (no manual sorting needed — run top to bottom):
--   1. Create & select database
--   2. Drop existing tables in reverse-dependency order
--   3. Create tables
--   4. Insert seed data
-- =============================================================================

-- ── 1. Database ───────────────────────────────────────────────────────────────

CREATE DATABASE IF NOT EXISTS `codealpha_ecommerce`
  CHARACTER SET utf8mb4
  COLLATE      utf8mb4_unicode_ci;

USE `codealpha_ecommerce`;

-- ── 2. Safety: Drop tables in reverse FK order ────────────────────────────────
--    Allows re-running the script cleanly on an existing database.

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `order_items`;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `cart_items`;
DROP TABLE IF EXISTS `products`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `users`;

SET FOREIGN_KEY_CHECKS = 1;

-- =============================================================================
-- TABLES
-- =============================================================================

-- ── users ─────────────────────────────────────────────────────────────────────
-- Stores registered customer accounts.
-- firebase_uid is provided by Firebase Authentication (Phase 3).
-- email must be globally unique (enforced at DB level as a safety net).

CREATE TABLE `users` (
  `id`           BIGINT UNSIGNED    NOT NULL AUTO_INCREMENT,
  `firebase_uid` VARCHAR(128)       NOT NULL                   COMMENT 'Firebase Authentication UID',
  `full_name`    VARCHAR(150)       NOT NULL,
  `email`        VARCHAR(255)       NOT NULL,
  `phone`        VARCHAR(20)            NULL                   COMMENT 'Optional — E.164 format recommended',
  `created_at`   DATETIME           NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`   DATETIME           NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_users_firebase_uid` (`firebase_uid`),
  UNIQUE KEY `uq_users_email`        (`email`),
  INDEX  `idx_users_email`           (`email`),
  INDEX  `idx_users_firebase_uid`    (`firebase_uid`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Registered customer accounts';

-- ── categories ────────────────────────────────────────────────────────────────
-- Top-level product taxonomy.
-- slug is URL-friendly, e.g. "home-kitchen", used in frontend routing.

CREATE TABLE `categories` (
  `id`          INT UNSIGNED   NOT NULL AUTO_INCREMENT,
  `name`        VARCHAR(100)   NOT NULL,
  `slug`        VARCHAR(120)   NOT NULL                        COMMENT 'URL-friendly identifier, e.g. electronics',
  `description` TEXT               NULL,
  `created_at`  DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_categories_slug` (`slug`),
  INDEX  `idx_categories_slug`    (`slug`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Product taxonomy — top-level categories';

-- ── products ──────────────────────────────────────────────────────────────────
-- Core product catalogue.
-- price stored as DECIMAL to avoid floating-point rounding errors.
-- stock  >= 0 enforced by CHECK constraint.

CREATE TABLE `products` (
  `id`          BIGINT UNSIGNED   NOT NULL AUTO_INCREMENT,
  `category_id` INT UNSIGNED      NOT NULL,
  `name`        VARCHAR(200)      NOT NULL,
  `slug`        VARCHAR(220)      NOT NULL                     COMMENT 'URL-friendly identifier',
  `description` TEXT                  NULL,
  `image_url`   VARCHAR(500)          NULL                     COMMENT 'Absolute or CDN-relative URL',
  `price`       DECIMAL(10, 2)    NOT NULL                     COMMENT 'In USD, always >= 0',
  `stock`       INT UNSIGNED      NOT NULL DEFAULT 0           COMMENT 'Units available',
  `is_featured` TINYINT(1)        NOT NULL DEFAULT 0           COMMENT '1 = show on homepage',
  `created_at`  DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_products_slug`       (`slug`),
  INDEX  `idx_products_slug`          (`slug`),
  INDEX  `idx_products_category_id`   (`category_id`),
  INDEX  `idx_products_is_featured`   (`is_featured`),
  INDEX  `idx_products_price`         (`price`),

  CONSTRAINT `fk_products_category`
    FOREIGN KEY (`category_id`)
    REFERENCES  `categories` (`id`)
    ON DELETE RESTRICT   -- Prevent category deletion while products exist
    ON UPDATE CASCADE,

  CONSTRAINT `chk_products_price`
    CHECK (`price` >= 0),

  CONSTRAINT `chk_products_stock`
    CHECK (`stock` >= 0)

) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Product catalogue';

-- ── cart_items ────────────────────────────────────────────────────────────────
-- Represents items a user has added to their active (pre-checkout) cart.
-- One row per (user, product) pair; quantity tracks count.
-- When an order is placed, these rows are typically cleared.

CREATE TABLE `cart_items` (
  `id`         BIGINT UNSIGNED   NOT NULL AUTO_INCREMENT,
  `user_id`    BIGINT UNSIGNED   NOT NULL,
  `product_id` BIGINT UNSIGNED   NOT NULL,
  `quantity`   INT UNSIGNED      NOT NULL DEFAULT 1,
  `created_at` DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_cart_user_product` (`user_id`, `product_id`)  COMMENT 'One row per product per user cart',
  INDEX  `idx_cart_items_user_id`    (`user_id`),
  INDEX  `idx_cart_items_product_id` (`product_id`),

  CONSTRAINT `fk_cart_items_user`
    FOREIGN KEY (`user_id`)
    REFERENCES  `users` (`id`)
    ON DELETE CASCADE    -- Removing a user removes their cart
    ON UPDATE CASCADE,

  CONSTRAINT `fk_cart_items_product`
    FOREIGN KEY (`product_id`)
    REFERENCES  `products` (`id`)
    ON DELETE CASCADE    -- Removing a product removes it from all carts
    ON UPDATE CASCADE,

  CONSTRAINT `chk_cart_quantity`
    CHECK (`quantity` >= 1)

) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Active shopping cart items per user';

-- ── orders ────────────────────────────────────────────────────────────────────
-- Represents a confirmed purchase intent.
-- shipping_address stored as JSON for flexibility (city, state, zip, country).

CREATE TABLE `orders` (
  `id`               BIGINT UNSIGNED   NOT NULL AUTO_INCREMENT,
  `user_id`          BIGINT UNSIGNED   NOT NULL,
  `total_amount`     DECIMAL(12, 2)    NOT NULL                COMMENT 'Sum of all order_items.price * quantity, incl. tax/shipping',
  `order_status`     ENUM(
                       'Pending',
                       'Processing',
                       'Shipped',
                       'Delivered',
                       'Cancelled'
                     )                 NOT NULL DEFAULT 'Pending',
  `payment_status`   ENUM(
                       'Pending',
                       'Paid',
                       'Failed'
                     )                 NOT NULL DEFAULT 'Pending',
  `shipping_address` JSON                  NULL               COMMENT 'Snapshot: {line1, city, state, zip, country}',
  `created_at`       DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (`id`),
  INDEX  `idx_orders_user_id`        (`user_id`),
  INDEX  `idx_orders_order_status`   (`order_status`),
  INDEX  `idx_orders_payment_status` (`payment_status`),
  INDEX  `idx_orders_created_at`     (`created_at`),

  CONSTRAINT `fk_orders_user`
    FOREIGN KEY (`user_id`)
    REFERENCES  `users` (`id`)
    ON DELETE RESTRICT   -- Retain order history even if user account is deactivated
    ON UPDATE CASCADE,

  CONSTRAINT `chk_orders_total`
    CHECK (`total_amount` >= 0)

) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Confirmed customer orders';

-- ── order_items ───────────────────────────────────────────────────────────────
-- Line items belonging to a single order.
-- price is a SNAPSHOT of the product price at the time of purchase —
-- this prevents historical order totals from changing if a product price
-- is updated later.

CREATE TABLE `order_items` (
  `id`         BIGINT UNSIGNED   NOT NULL AUTO_INCREMENT,
  `order_id`   BIGINT UNSIGNED   NOT NULL,
  `product_id` BIGINT UNSIGNED   NOT NULL,
  `quantity`   INT UNSIGNED      NOT NULL DEFAULT 1,
  `price`      DECIMAL(10, 2)    NOT NULL                      COMMENT 'Price per unit at time of purchase (snapshot)',

  PRIMARY KEY (`id`),
  INDEX  `idx_order_items_order_id`   (`order_id`),
  INDEX  `idx_order_items_product_id` (`product_id`),

  CONSTRAINT `fk_order_items_order`
    FOREIGN KEY (`order_id`)
    REFERENCES  `orders` (`id`)
    ON DELETE CASCADE    -- Deleting an order removes its line items
    ON UPDATE CASCADE,

  CONSTRAINT `fk_order_items_product`
    FOREIGN KEY (`product_id`)
    REFERENCES  `products` (`id`)
    ON DELETE RESTRICT   -- Do not delete a product that is part of a historical order
    ON UPDATE CASCADE,

  CONSTRAINT `chk_order_items_quantity`
    CHECK (`quantity` >= 1),

  CONSTRAINT `chk_order_items_price`
    CHECK (`price` >= 0)

) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Line items for each order — price is a purchase-time snapshot';

-- =============================================================================
-- SEED DATA
-- =============================================================================

-- ── Categories (5) ───────────────────────────────────────────────────────────

INSERT INTO `categories` (`name`, `slug`, `description`) VALUES
  ('Electronics',   'electronics',   'Smartphones, laptops, accessories and all things tech.'),
  ('Fashion',       'fashion',       'Clothing, footwear, and lifestyle accessories for every style.'),
  ('Books',         'books',         'Bestsellers, textbooks, fiction, non-fiction and more.'),
  ('Home & Kitchen','home-kitchen',  'Everything you need to make your home comfortable and stylish.'),
  ('Sports',        'sports',        'Fitness equipment, outdoor gear, and sportswear.');

-- ── Products (20 — 4 per category) ───────────────────────────────────────────
-- image_url uses a public placeholder with a consistent size.
-- Prices are realistic market estimates in USD.

INSERT INTO `products`
  (`category_id`, `name`, `slug`, `description`, `image_url`, `price`, `stock`, `is_featured`)
VALUES

-- Electronics (category_id = 1)
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

-- Fashion (category_id = 2)
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

-- Books (category_id = 3)
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
    35.99, 260, 0),

-- Home & Kitchen (category_id = 4)
(4, 'Instant Pot Duo 7-in-1',
    'instant-pot-duo-7-in-1',
    'Electric pressure cooker that replaces 7 kitchen appliances. 6-quart capacity.',
    'https://placehold.co/600x400/1a1a24/ef4444?text=Instant+Pot+Duo',
    89.99, 75, 1),

(4, 'Dyson V15 Detect Vacuum',
    'dyson-v15-detect-vacuum',
    'The most powerful cordless vacuum with laser dust detection and LCD display.',
    'https://placehold.co/600x400/1a1a24/ef4444?text=Dyson+V15',
    749.99, 40, 0),

(4, 'IKEA KALLAX Shelf Unit',
    'ikea-kallax-shelf-unit',
    'Versatile cube storage shelf, 4×4 configuration, white. Ideal for home office or living room.',
    'https://placehold.co/600x400/1a1a24/ef4444?text=IKEA+KALLAX',
    249.00, 30, 0),

(4, 'Nespresso Vertuo Pop Coffee Machine',
    'nespresso-vertuo-pop',
    'Capsule coffee machine brewing 5 cup sizes, 37-second heat-up, 11 colours available.',
    'https://placehold.co/600x400/1a1a24/ef4444?text=Nespresso+Vertuo',
    129.99, 90, 1),

-- Sports (category_id = 5)
(5, 'Peloton Bike+',
    'peloton-bike-plus',
    'Smart exercise bike with 24" rotating HD touchscreen and auto-resistance.',
    'https://placehold.co/600x400/1a1a24/a5b4fc?text=Peloton+Bike+Plus',
    2495.00, 20, 1),

(5, 'Hydro Flask 32 oz Water Bottle',
    'hydro-flask-32oz',
    'Insulated stainless steel water bottle keeping drinks cold 24 hrs, hot 12 hrs.',
    'https://placehold.co/600x400/1a1a24/a5b4fc?text=Hydro+Flask',
    44.95, 300, 0),

(5, 'Yoga Mat Premium Non-Slip',
    'yoga-mat-premium-non-slip',
    '6mm thick eco-friendly TPE yoga mat with alignment lines and carry strap.',
    'https://placehold.co/600x400/1a1a24/a5b4fc?text=Yoga+Mat',
    39.99, 220, 0),

(5, 'Bowflex SelectTech 552 Dumbbells',
    'bowflex-selecttech-552',
    'Adjustable dumbbell pair, 5–52.5 lbs each. Replace 15 sets of weights.',
    'https://placehold.co/600x400/1a1a24/a5b4fc?text=Bowflex+552',
    429.00, 35, 1);

-- =============================================================================
-- END OF SCHEMA & SEED DATA
-- =============================================================================
