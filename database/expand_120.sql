-- =============================================================================
-- CodeAlpha E-Commerce Store — Product Catalog Expansion (120+ Products)
-- =============================================================================
USE `codealpha_ecommerce`;

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Ensure all 12 Categories exist (Adding 11 and 12, preserving 1-10)
INSERT IGNORE INTO `categories` (`id`, `name`, `slug`, `description`) VALUES
  (11, 'Toys & Baby', 'toys-baby', 'Toys, games, and baby care essentials.'),
  (12, 'Office & Stationery', 'office-stationery', 'Office supplies, pens, and paper.');

SET FOREIGN_KEY_CHECKS = 1;

-- 2. Add Exactly 30 New Products to reach 120 total.
-- Allocates 1 product into existing Categories 1-10 (bringing their counts to 10 each).
-- Allocates 10 products into Category 11 and 10 products into Category 12 (10 each).
INSERT IGNORE INTO `products` (`category_id`, `name`, `slug`, `description`, `image_url`, `price`, `stock`, `is_featured`) VALUES
  (1, 'DJI Mini 4 Pro Drone', 'dji-mini-4-pro-drone', 'Lightweight folding drone with 4K HDR video and omnidirectional obstacle sensing.', 'https://picsum.photos/seed/dji-mini-4-pro-drone/600/600', 759.00, 45, 0),
  (2, 'Patagonia Fleece Jacket', 'patagonia-fleece-jacket', 'Warm, durable, and lightweight fleece jacket for outdoor adventures.', 'https://picsum.photos/seed/patagonia-fleece-jacket/600/600', 139.00, 85, 0),
  (3, 'Shoe Dog by Phil Knight', 'shoe-dog-phil-knight', 'A memoir by the creator of Nike, detailing the early days of the company.', 'https://picsum.photos/seed/shoe-dog-phil-knight/600/600', 21.00, 110, 0),
  (4, 'Philips Air Fryer XXL', 'philips-air-fryer-xxl', 'Spacious air fryer for preparing healthier meals with little to no oil.', 'https://picsum.photos/seed/philips-air-fryer-xxl/600/600', 249.95, 30, 0),
  (5, 'Theragun Pro Massage Gun', 'theragun-pro-massage-gun', 'Deep muscle treatment for enhanced muscle recovery and pain relief.', 'https://picsum.photos/seed/theragun-pro-massage-gun/600/600', 599.00, 25, 0),
  (6, 'Paul Mitchell Tea Tree Shampoo', 'paul-mitchell-tea-tree', 'Invigorating shampoo that leaves hair fresh and full of vitality.', 'https://picsum.photos/seed/paul-mitchell-tea-tree/600/600', 18.00, 140, 0),
  (7, 'Herschel Supply Backpack', 'herschel-supply-backpack', 'Classic mountaineering backpack modernized for everyday use.', 'https://picsum.photos/seed/herschel-supply-backpack/600/600', 109.99, 50, 0),
  (8, 'PlayStation 5 Slim', 'playstation-5-slim', 'Next-gen gaming console with lightning-fast load times and stunning graphics.', 'https://picsum.photos/seed/playstation-5-slim/600/600', 499.00, 80, 1),
  (9, 'Furbo 360 Dog Camera', 'furbo-360-dog-camera', 'Keep an eye on your dog and toss treats continuously with a 360 view.', 'https://picsum.photos/seed/furbo-360-dog-camera/600/600', 210.00, 33, 0),
  (10, 'Anker ROAV DashCam', 'anker-roav-dashcam', 'High-definition car dashcam featuring night vision and built-in WiFi.', 'https://picsum.photos/seed/anker-roav-dashcam/600/600', 79.99, 120, 0),
  
  -- Category 11: Toys & Baby (10 Items)
  (11, 'LEGO Star Wars Millennium Falcon', 'lego-star-wars-millennium-falcon', 'Build the legendary Corellian freighter with this massive LEGO set.', 'https://picsum.photos/seed/lego-star-wars-millennium-falcon/600/600', 159.99, 20, 1),
  (11, 'Fisher-Price Baby Bouncer', 'fisher-price-baby-bouncer', 'Comfortable vibrating infant seat helping soothe your baby.', 'https://picsum.photos/seed/fisher-price-baby-bouncer/600/600', 44.99, 85, 0),
  (11, 'Huggies Snug & Dry Diapers', 'huggies-snug-dry-diapers', 'Up to 12 hours of long-lasting protection for babies.', 'https://picsum.photos/seed/huggies-snug-dry-diapers/600/600', 42.00, 150, 0),
  (11, 'Hot Wheels 20-Car Pack', 'hot-wheels-20-car-pack', 'A diverse collection of 20 detailed die-cast vehicles.', 'https://picsum.photos/seed/hot-wheels-20-car-pack/600/600', 21.99, 130, 0),
  (11, 'Barbie Dreamhouse', 'barbie-dreamhouse', 'Extensive dollhouse featuring a working elevator and a slide.', 'https://picsum.photos/seed/barbie-dreamhouse/600/600', 199.00, 45, 0),
  (11, 'Philips Avent Baby Monitor', 'philips-avent-baby-monitor', 'Secure audio baby monitor providing crystal clear sound.', 'https://picsum.photos/seed/philips-avent-baby-monitor/600/600', 39.99, 65, 0),
  (11, 'Melissa & Doug Wooden Blocks', 'melissa-doug-wooden-blocks', 'Colorful 100-piece wooden block set for early motor development.', 'https://picsum.photos/seed/melissa-doug-wooden-blocks/600/600', 19.99, 110, 0),
  (11, 'Graco Extend2Fit Car Seat', 'graco-extend2fit-car-seat', 'Convertible car seat designed for safe rear-facing and forward-facing rides.', 'https://picsum.photos/seed/graco-extend2fit-car-seat/600/600', 189.99, 32, 0),
  (11, 'Baby Einstein Play Gym', 'baby-einstein-play-gym', 'Musical activity gym that grows alongside your infant.', 'https://picsum.photos/seed/baby-einstein-play-gym/600/600', 54.99, 70, 0),
  (11, 'NERF N-Strike Elite Blaster', 'nerf-n-strike-elite-blaster', 'Rapid-fire foam dart blaster with a high capacity drum.', 'https://picsum.photos/seed/nerf-n-strike-elite-blaster/600/600', 29.99, 90, 0),

  -- Category 12: Office & Stationery (10 Items)
  (12, 'Moleskine Classic Notebook', 'moleskine-classic-notebook', 'Hard cover lined notebook with ivory pages for writing and journaling.', 'https://picsum.photos/seed/moleskine-classic-notebook/600/600', 22.95, 140, 0),
  (12, 'Pilot G2 Retractable Gel Pens', 'pilot-g2-gel-pens', 'Smooth writing black gel ink pens holding the longest lasting ink.', 'https://picsum.photos/seed/pilot-g2-gel-pens/600/600', 14.50, 200, 0),
  (12, 'Post-it Notes 3x3in', 'post-it-notes-3x3', 'Colorful sticky notes perfect for reminders and brainstorming sessions.', 'https://picsum.photos/seed/post-it-notes-3x3/600/600', 12.00, 180, 0),
  (12, 'Epson EcoTank ET-2800 Printer', 'epson-ecotank-et2800', 'Cartridge-free supertank printer for incredibly low cost color printing.', 'https://picsum.photos/seed/epson-ecotank-et2800/600/600', 279.00, 48, 1),
  (12, 'Steelcase Leap v2 Office Chair', 'steelcase-leap-v2', 'Highly ergonomic premium office chair tailored for maximum support.', 'https://picsum.photos/seed/steelcase-leap-v2/600/600', 899.00, 25, 0),
  (12, 'Logitech ERGO K860 Keyboard', 'logitech-ergo-k860', 'Wireless ergonomic split keyboard with an integrated wrist rest.', 'https://picsum.photos/seed/logitech-ergo-k860/600/600', 129.99, 65, 0),
  (12, 'Sharpie Permanent Markers Pack', 'sharpie-markers-pack', 'Assorted colors permanent markers that write on almost any surface.', 'https://picsum.photos/seed/sharpie-markers-pack/600/600', 15.99, 130, 0),
  (12, 'Brother P-Touch Label Maker', 'brother-ptouch-label-maker', 'Compact electronic label maker featuring versatile font styles.', 'https://picsum.photos/seed/brother-ptouch-label-maker/600/600', 39.99, 90, 0),
  (12, 'Highland Double Sided Tape', 'highland-double-sided-tape', 'Pack of double sided office tape perfect for presentations and crafting.', 'https://picsum.photos/seed/highland-double-sided-tape/600/600', 9.50, 160, 0),
  (12, 'Swingline Stapler 545', 'swingline-stapler-545', 'Durable metal stapler built for reliable everyday performance.', 'https://picsum.photos/seed/swingline-stapler-545/600/600', 13.99, 110, 0);
