
USE `codealpha_ecommerce`;
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE `order_items`;
TRUNCATE TABLE `orders`;
TRUNCATE TABLE `cart_items`;
TRUNCATE TABLE `products`;
TRUNCATE TABLE `categories`;

-- Alter products table to support the new requirements implicitly without destroying relations
-- We use a stored procedure trick safely to add columns if they don't exist
DROP PROCEDURE IF EXISTS AddProductColumns;
DELIMITER //
CREATE PROCEDURE AddProductColumns()
BEGIN
    IF NOT EXISTS (SELECT * FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = 'codealpha_ecommerce' AND TABLE_NAME = 'products' AND COLUMN_NAME = 'brand') THEN
        ALTER TABLE `products` ADD COLUMN `brand` VARCHAR(100) DEFAULT NULL;
    END IF;
    IF NOT EXISTS (SELECT * FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = 'codealpha_ecommerce' AND TABLE_NAME = 'products' AND COLUMN_NAME = 'discount_percentage') THEN
        ALTER TABLE `products` ADD COLUMN `discount_percentage` DECIMAL(5,2) DEFAULT '0.00';
    END IF;
    IF NOT EXISTS (SELECT * FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = 'codealpha_ecommerce' AND TABLE_NAME = 'products' AND COLUMN_NAME = 'rating') THEN
        ALTER TABLE `products` ADD COLUMN `rating` DECIMAL(3,1) DEFAULT '4.0';
    END IF;
    IF NOT EXISTS (SELECT * FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = 'codealpha_ecommerce' AND TABLE_NAME = 'products' AND COLUMN_NAME = 'review_count') THEN
        ALTER TABLE `products` ADD COLUMN `review_count` INT UNSIGNED DEFAULT '0';
    END IF;
END //
DELIMITER ;
CALL AddProductColumns();
DROP PROCEDURE AddProductColumns;
SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO `categories` (`id`, `name`, `slug`, `description`) VALUES
  (1, 'Electronics', 'electronics', 'Gadgets and devices'),
  (2, 'Fashion', 'fashion', 'Clothes and apparel'),
  (3, 'Books', 'books', 'Readings and literature'),
  (4, 'Home & Kitchen', 'home-kitchen', 'Household items'),
  (5, 'Sports & Fitness', 'sports-fitness', 'Athletic gear'),
  (6, 'Beauty & Personal Care', 'beauty-personal-care', 'Cosmetics and grooming'),
  (7, 'Bags & Accessories', 'bags-accessories', 'Bags, wallets, etc.'),
  (8, 'Gaming', 'gaming', 'Consoles and gaming gear'),
  (9, 'Pet Supplies', 'pet-supplies', 'Everything for your pets'),
  (10, 'Automotive', 'automotive', 'Car accessories and parts');

INSERT INTO `products` (`id`, `category_id`, `name`, `slug`, `description`, `image_url`, `price`, `stock`, `is_featured`, `brand`, `discount_percentage`, `rating`, `review_count`) VALUES
  (1, 1, 'Apple iPhone 15 Pro', 'apple-iphone-15-pro', 'Latest flagship smartphone from Apple.', 'https://images.unsplash.com/photo-1598327106026-d9521da673d1?w=600&h=600&fit=crop', 1199.99, 120, 1, 'Apple', 0.0, 4.9, 350),
  (2, 1, 'Apple MacBook Air M3', 'apple-macbook-air-m3', 'Incredibly thin and light laptop with M3 chip.', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop', 1099.0, 40, 1, 'Apple', 5.0, 4.8, 220),
  (3, 1, 'Samsung 65-Inch 4K TV', 'samsung-65-4k-tv', 'Breathtaking 4K UHD Smart TV.', 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&h=600&fit=crop', 1250.0, 20, 0, 'Samsung', 10.0, 4.7, 180),
  (4, 1, 'Sony WH-1000XM5 Headphones', 'sony-wh-1000xm5', 'Industry-leading noise canceling over-ear headphones.', 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&h=600&fit=crop', 349.99, 110, 1, 'Sony', 0.0, 4.8, 105),
  (5, 1, 'Canon EOS R5 Camera', 'canon-eos-r5', 'Professional mirrorless camera for stunning photography.', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=600&fit=crop', 3899.0, 15, 0, 'Canon', 5.0, 4.9, 85),
  (6, 1, 'Apple iPad Pro', 'apple-ipad-pro', 'Ultimate tablet experience with extreme performance.', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=600&fit=crop', 999.0, 60, 0, 'Apple', 0.0, 4.9, 140),
  (7, 1, 'Apple AirPods Pro', 'apple-airpods-pro', 'Rich audio with active noise cancellation.', 'https://images.unsplash.com/photo-1606220588913-b3eea415a2ed?w=600&h=600&fit=crop', 249.0, 200, 1, 'Apple', 5.0, 4.8, 400),
  (8, 1, 'Apple Watch Series 9', 'apple-watch-series-9', 'Advanced health tracking smartwatch.', 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&h=600&fit=crop', 399.0, 75, 0, 'Apple', 0.0, 4.8, 250),
  (9, 2, 'Nike Air Max 270', 'nike-air-max-270', 'Comfortable, stylish everyday sneakers.', 'https://images.unsplash.com/photo-1600181516264-3ea807fe3772?w=600&h=600&fit=crop', 150.0, 130, 1, 'Nike', 0.0, 4.7, 310),
  (10, 2, 'Levi''s 501 Original Jeans', 'levis-501-original', 'Classic straight leg denim jeans.', 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=600&fit=crop', 69.5, 200, 0, 'Levi''s', 15.0, 4.6, 280),
  (11, 2, 'Adidas Originals Hoodie', 'adidas-originals-hoodie', 'Comfortable cotton-blend sports hoodie.', 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=600&fit=crop', 65.0, 180, 0, 'Adidas', 10.0, 4.8, 150),
  (12, 2, 'Calvin Klein Classic T-Shirt', 'calvin-klein-tshirt', 'Essential basic crew neck t-shirt.', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop', 32.0, 300, 0, 'Calvin Klein', 0.0, 4.5, 400),
  (13, 2, 'AllSaints Leather Jacket', 'allsaints-leather-jacket', 'Genuine leather jacket for a bold look.', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=600&fit=crop', 349.99, 40, 1, 'AllSaints', 20.0, 4.9, 90),
  (14, 2, 'Zara Summer Floral Dress', 'zara-floral-dress', 'Lightweight, breathable dress for warm days.', 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=600&h=600&fit=crop', 45.0, 115, 0, 'Zara', 0.0, 4.4, 60),
  (15, 2, 'Converse Chuck Taylor', 'converse-chuck-taylor', 'The iconic canvas high-top sneaker.', 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&h=600&fit=crop', 65.0, 150, 0, 'Converse', 0.0, 4.8, 550),
  (16, 2, 'North Face Winter Coat', 'north-face-winter-coat', 'Insulated winter jacket for extreme cold.', 'https://images.unsplash.com/photo-1517070208541-6ddc4d3efbcb?w=600&h=600&fit=crop', 199.0, 75, 0, 'The North Face', 10.0, 4.7, 120),
  (17, 3, 'Atomic Habits', 'atomic-habits', 'An Easy & Proven Way to Build Good Habits.', 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600&h=600&fit=crop', 16.99, 250, 1, 'Penguin Random House', 0.0, 4.9, 1500),
  (18, 3, 'Clean Code', 'clean-code', 'A Handbook of Agile Software Craftsmanship.', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=600&fit=crop', 42.5, 120, 0, 'Prentice Hall', 5.0, 4.8, 800),
  (19, 3, 'Deep Work', 'deep-work', 'Rules for Focused Success in a Distracted World.', 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&h=600&fit=crop', 21.0, 185, 0, 'Grand Central Publishing', 0.0, 4.7, 450),
  (20, 3, 'The Pragmatic Programmer', 'pragmatic-programmer', 'Journey to Mastery in software engineering.', 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&h=600&fit=crop', 39.99, 90, 0, 'Addison-Wesley', 0.0, 4.9, 320),
  (21, 3, 'Zero to One', 'zero-to-one', 'Notes on Startups, or How to Build the Future.', 'https://images.unsplash.com/photo-1589998059171-989d887dda6e?w=600&h=600&fit=crop', 18.0, 210, 1, 'Crown Business', 10.0, 4.6, 500),
  (22, 3, 'Sapiens', 'sapiens', 'A Brief History of Humankind.', 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=600&fit=crop', 22.95, 140, 0, 'Harper', 0.0, 4.8, 950),
  (23, 3, 'Shoe Dog', 'shoe-dog', 'A Memoir by the Creator of Nike.', 'https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?w=600&h=600&fit=crop', 19.95, 160, 0, 'Scribner', 5.0, 4.9, 780),
  (24, 3, 'Dune', 'dune-frank-herbert', 'A science fiction masterpiece by Frank Herbert.', 'https://images.unsplash.com/photo-1614546419706-e7893a201b17?w=600&h=600&fit=crop', 15.99, 130, 0, 'Ace Books', 0.0, 4.8, 1200),
  (25, 4, 'Breville Coffee Maker', 'breville-coffee-maker', 'Create great tasting coffee at home.', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=600&fit=crop', 299.95, 25, 1, 'Breville', 10.0, 4.8, 150),
  (26, 4, 'Vitamix High-Speed Blender', 'vitamix-blender', 'Professional level kitchen blender.', 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&h=600&fit=crop', 449.0, 40, 0, 'Vitamix', 0.0, 4.9, 210),
  (27, 4, 'Zojirushi Rice Cooker', 'zojirushi-rice-cooker', 'Micom rice cooker and warmer.', 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600&h=600&fit=crop', 145.0, 45, 0, 'Zojirushi', 5.0, 4.7, 300),
  (28, 4, 'KitchenAid Stand Mixer', 'kitchenaid-mixer', 'Artisan series 5-quart tilt-head mixer.', 'https://images.unsplash.com/photo-1593998066526-65fcab3021a2?w=600&h=600&fit=crop', 429.99, 30, 1, 'KitchenAid', 0.0, 4.9, 520),
  (29, 4, 'Dyson V15 Vacuum', 'dyson-v15-vacuum', 'Cordless stick vacuum with laser illumination.', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop', 749.0, 40, 0, 'Dyson', 15.0, 4.8, 120),
  (30, 4, 'Caraway Cookware Set', 'caraway-cookware', 'Ceramic non-stick pot and pan set.', 'https://images.unsplash.com/photo-1585675549007-9b25134106bb?w=600&h=600&fit=crop', 395.0, 20, 0, 'Caraway', 0.0, 4.6, 90),
  (31, 4, 'Oxo Storage Containers', 'oxo-storage-containers', 'Airtight pantry organization set.', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=600&fit=crop', 35.99, 180, 0, 'OXO', 0.0, 4.7, 400),
  (32, 4, 'IKEA Table Lamp', 'ikea-table-lamp', 'Minimalist brass and glass table lamp.', 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&h=600&fit=crop', 55.0, 95, 0, 'IKEA', 0.0, 4.3, 110),
  (33, 5, 'Kookaburra Cricket Bat', 'kookaburra-cricket-bat', 'Premium English willow cricket bat.', 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600&h=600&fit=crop', 185.0, 30, 1, 'Kookaburra', 0.0, 4.8, 80),
  (34, 5, 'Adidas Match Football', 'adidas-football', 'Professional quality match soccer ball.', 'https://images.unsplash.com/photo-1614632537190-23e4146777f5?w=600&h=600&fit=crop', 85.0, 120, 0, 'Adidas', 10.0, 4.7, 210),
  (35, 5, 'Bowflex Adjustable Dumbbells', 'bowflex-dumbbells', 'Adjustable dumbbells for home gyms.', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=600&fit=crop', 429.0, 45, 1, 'Bowflex', 15.0, 4.9, 450),
  (36, 5, 'Manduka PRO Yoga Mat', 'manduka-yoga-mat', 'High performance, extra thick yoga mat.', 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&h=600&fit=crop', 129.0, 110, 0, 'Manduka', 0.0, 4.8, 300),
  (37, 5, 'Wilson Pro Staff Tennis Racket', 'wilson-tennis-racket', 'Precision engineered racket for perfect swing.', 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&h=600&fit=crop', 145.0, 40, 0, 'Wilson', 0.0, 4.7, 180),
  (38, 5, 'Spalding NBA Basketball', 'spalding-basketball', 'Official size and weight leather basketball.', 'https://images.unsplash.com/photo-1518063319808-1f5be1c6e1e8?w=600&h=600&fit=crop', 65.0, 85, 0, 'Spalding', 0.0, 4.6, 260),
  (39, 5, 'Under Armour Gym Bag', 'ua-gym-bag', 'Water-resistant, ventilated sports bag.', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop', 45.0, 160, 0, 'Under Armour', 5.0, 4.7, 150),
  (40, 5, 'Rogue Speed Skipping Rope', 'rogue-skipping-rope', 'Adjustable speed jump rope for cardio.', 'https://images.unsplash.com/photo-1590487988256-9ed24133863e?w=600&h=600&fit=crop', 15.99, 210, 0, 'Rogue Fitness', 0.0, 4.4, 210),
  (41, 6, 'Dior Sauvage Perfume', 'dior-sauvage', 'A radically fresh composition for men.', 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&h=600&fit=crop', 125.0, 95, 1, 'Dior', 0.0, 4.9, 1200),
  (42, 6, 'Olaplex No.4 Shampoo', 'olaplex-shampoo', 'Bond maintenance shampoo for damaged hair.', 'https://images.unsplash.com/photo-1585232351009-467ce1f42220?w=600&h=600&fit=crop', 30.0, 180, 0, 'Olaplex', 0.0, 4.7, 500),
  (43, 6, 'MAC Matte Lipstick', 'mac-lipstick', 'Iconic lipstick with high color payoff.', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop', 21.0, 300, 1, 'MAC', 5.0, 4.8, 800),
  (44, 6, 'Cetaphil Daily Moisturizer', 'cetaphil-moisturizer', 'Everyday face and body moisturizer.', 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=600&fit=crop', 18.0, 220, 0, 'Cetaphil', 0.0, 4.6, 950),
  (45, 6, 'CeraVe Hydrating Face Wash', 'cerave-face-wash', 'Mild facial cleanser with ceramides.', 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=600&fit=crop', 16.5, 240, 0, 'CeraVe', 0.0, 4.8, 1100),
  (46, 6, 'Philips Norelco Trimmer', 'philips-trimmer', 'All-in-one men''s grooming trimmer.', 'https://images.unsplash.com/photo-1629851608678-7fba0b9a67a8?w=600&h=600&fit=crop', 59.99, 110, 0, 'Philips', 15.0, 4.5, 340),
  (47, 6, 'Dyson Supersonic Hair Dryer', 'dyson-hair-dryer', 'Fast drying with heat shield technology.', 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=600&h=600&fit=crop', 429.0, 35, 0, 'Dyson', 0.0, 4.9, 210),
  (48, 6, 'Laneige Lip Sleeping Mask', 'laneige-lip-mask', 'Leave-on lip mask that soothes and moisturizes.', 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=600&h=600&fit=crop', 24.0, 160, 0, 'Laneige', 10.0, 4.7, 500),
  (49, 7, 'Herschel Little America Backpack', 'herschel-backpack', 'Mountaineering inspired everyday backpack.', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop', 109.99, 140, 1, 'Herschel', 10.0, 4.7, 450),
  (50, 7, 'Bellroy Leather Wallet', 'bellroy-wallet', 'Minimalist bi-fold genuine leather wallet.', 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&h=600&fit=crop', 79.0, 180, 0, 'Bellroy', 0.0, 4.8, 320),
  (51, 7, 'Ray-Ban Aviator Sunglasses', 'ray-ban-aviator', 'Classic polarized metal frame sunglasses.', 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&h=600&fit=crop', 163.0, 95, 1, 'Ray-Ban', 5.0, 4.9, 580),
  (52, 7, 'Michael Kors Handbag', 'michael-kors-handbag', 'Elegant leather tote ideal for work or travel.', 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&h=600&fit=crop', 225.0, 45, 0, 'Michael Kors', 20.0, 4.6, 120),
  (53, 7, 'Spigen Tough Armor Phone Case', 'spigen-phone-case', 'Extreme protection for your smartphone.', 'https://images.unsplash.com/photo-1603566234582-fdd73812165c?w=600&h=600&fit=crop', 19.99, 300, 0, 'Spigen', 0.0, 4.5, 800),
  (54, 7, 'Fossil Leather Belt', 'fossil-belt', 'Classic men''s brown leather belt.', 'https://images.unsplash.com/photo-1624222247344-550fb60ebabf?w=600&h=600&fit=crop', 35.0, 140, 0, 'Fossil', 0.0, 4.6, 210),
  (55, 7, 'Casio Vintage Watch', 'casio-vintage-watch', 'Iconic digital retro watch.', 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=600&h=600&fit=crop', 45.0, 150, 0, 'Casio', 10.0, 4.7, 600),
  (56, 7, 'The North Face Duffel Bag', 'north-face-duffel', 'Base camp resistant travel duffel bag.', 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&h=600&fit=crop', 135.0, 60, 0, 'The North Face', 0.0, 4.8, 140),
  (57, 8, 'Logitech G Pro Gaming Mouse', 'logitech-gaming-mouse', 'Ultra-lightweight wireless gaming mouse.', 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&h=600&fit=crop', 149.99, 130, 1, 'Logitech G', 0.0, 4.9, 900),
  (58, 8, 'PlayStation 5 Controller', 'ps5-controller', 'DualSense wireless controller for PS5.', 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&h=600&fit=crop', 69.99, 210, 1, 'Sony', 5.0, 4.8, 1500),
  (59, 8, 'Corsair K70 Gaming Keyboard', 'corsair-keyboard', 'Mechanical gaming keyboard with RGB lightning.', 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=600&h=600&fit=crop', 159.99, 90, 0, 'Corsair', 0.0, 4.7, 340),
  (60, 8, 'HyperX Cloud II Headset', 'hyperx-headset', '7.1 surround sound gaming headset.', 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&h=600&fit=crop', 99.99, 150, 0, 'HyperX', 20.0, 4.7, 1250),
  (61, 8, 'Nintendo Switch OLED', 'nintendo-switch', 'Versatile hybrid console with vibrant screen.', 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=600&h=600&fit=crop', 349.99, 65, 0, 'Nintendo', 0.0, 4.9, 750),
  (62, 8, 'Secretlab TITAN Gaming Chair', 'secretlab-chair', 'Ergonomic gaming chair for long sessions.', 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=600&h=600&fit=crop', 549.0, 20, 0, 'Secretlab', 10.0, 4.8, 480),
  (63, 8, 'Logitech Brio 4K Webcam', 'logitech-webcam', 'Ultra HD webcam for game streaming.', 'https://images.unsplash.com/photo-1587826620573-0ff7227ddc0f?w=600&h=600&fit=crop', 199.99, 70, 0, 'Logitech', 0.0, 4.5, 230),
  (64, 8, 'Samsung 990 PRO NVMe SSD', 'samsung-nvme-ssd', 'High-speed internal 2TB SSD for PC and PS5.', 'https://images.unsplash.com/photo-1628557044797-f21a177c37ec?w=600&h=600&fit=crop', 189.99, 120, 0, 'Samsung', 15.0, 4.9, 450),
  (65, 9, 'Purina Pro Plan Dog Food', 'purina-dog-food', 'High protein dry dog food, 30 lb bag.', 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&h=600&fit=crop', 55.99, 150, 1, 'Purina', 5.0, 4.7, 850),
  (66, 9, 'Orthopedic Cat Bed', 'orthopedic-cat-bed', 'Memory foam bed for ultimate feline comfort.', 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=600&h=600&fit=crop', 65.0, 80, 0, 'PetFusion', 0.0, 4.8, 220),
  (67, 9, 'Kong Classic Dog Toy', 'kong-dog-toy', 'Durable rubber chew and fetch toy.', 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=600&h=600&fit=crop', 14.5, 250, 1, 'KONG', 0.0, 4.9, 1500),
  (68, 9, 'Furbo 360 Pet Camera', 'furbo-pet-camera', 'Interactive pet camera with treat tosser.', 'https://images.unsplash.com/photo-1520117006859-00216715f0d9?w=600&h=600&fit=crop', 210.0, 45, 0, 'Furbo', 15.0, 4.6, 310),
  (69, 9, 'Multi-Level Cat Tree', 'multi-level-cat-tree', 'Scratching posts and perches for indoor cats.', 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=600&h=600&fit=crop', 89.99, 35, 0, 'Go Pet Club', 10.0, 4.7, 180),
  (70, 9, 'Stainless Steel Pet Bowl', 'stainless-pet-bowl', 'Non-slip set of two bowls for food and water.', 'https://images.unsplash.com/photo-1605335520938-0fc298075306?w=600&h=600&fit=crop', 18.0, 180, 0, 'Amazon Basics', 0.0, 4.5, 600),
  (71, 9, 'No-Pull Dog Harness', 'no-pull-dog-harness', 'Adjustable reflective harness with handle.', 'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?w=600&h=600&fit=crop', 22.95, 140, 0, 'Rabbitgoo', 5.0, 4.6, 950),
  (72, 9, 'Deshedding Pet Brush', 'deshedding-pet-brush', 'Tool to significantly reduce pet shedding.', 'https://images.unsplash.com/photo-1516734212903-a1752b0cb0e3?w=600&h=600&fit=crop', 25.0, 120, 0, 'FURminator', 0.0, 4.8, 420),
  (73, 10, 'Portable Car Vacuum Cleaner', 'car-vacuum', 'High power handheld vacuum for interiors.', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=600&fit=crop', 35.5, 160, 1, 'ThisWorx', 10.0, 4.5, 520),
  (74, 10, 'Motorcycle Safety Helmet', 'motorcycle-helmet', 'Full face matte black DOT safety helmet.', 'https://images.unsplash.com/photo-1555008872-f03b347fd862?w=600&h=600&fit=crop', 129.95, 65, 1, 'Bell', 0.0, 4.8, 230),
  (75, 10, 'Anker ROAV DashCam', 'anker-dashcam', '1080p dashboard camera with night vision.', 'https://images.unsplash.com/photo-1503375894314-476514ac012b?w=600&h=600&fit=crop', 79.99, 110, 0, 'Anker', 15.0, 4.6, 410),
  (76, 10, 'Chemical Guys Wash Kit', 'car-wash-kit', '16-piece complete car care kit.', 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=600&h=600&fit=crop', 99.99, 85, 0, 'Chemical Guys', 0.0, 4.9, 700),
  (77, 10, 'Digital Tire Inflator', 'tire-inflator', '12V portable air compressor pump.', 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=600&h=600&fit=crop', 42.0, 130, 0, 'EPAuto', 5.0, 4.6, 380),
  (78, 10, 'All-Weather Car Cover', 'car-cover', 'Heavy duty waterproof outdoor cover.', 'https://images.unsplash.com/photo-1610665979854-c9779df5373a?w=600&h=600&fit=crop', 55.0, 100, 0, 'Leader Accessories', 0.0, 4.3, 150),
  (79, 10, 'NOCO Jump Starter', 'jump-starter', '1000 Amp lithium car battery jump starter.', 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=600&h=600&fit=crop', 99.95, 120, 0, 'NOCO', 12.0, 4.8, 620),
  (80, 10, 'Microfiber Cleaning Cloths', 'microfiber-cloths', 'Pack of 24 lint-free detailing towels.', 'https://images.unsplash.com/photo-1620063259960-91129b85c2df?w=600&h=600&fit=crop', 19.99, 210, 0, 'Amazon Basics', 0.0, 4.8, 1250);
