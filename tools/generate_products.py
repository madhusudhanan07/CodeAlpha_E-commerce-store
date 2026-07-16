import json
import random

categories = [
    (1, 'Electronics', 'electronics'),
    (2, 'Fashion', 'fashion'),
    (3, 'Books', 'books'),
    (4, 'Home & Kitchen', 'home-kitchen'),
    (5, 'Sports', 'sports'),
    (6, 'Beauty', 'beauty'),
    (7, 'Accessories', 'accessories'),
]

products_data = {
    1: [
        ("Google Pixel 8 Pro", "google-pixel-8-pro", "Google's flagship phone with advanced AI cameras.", 999.00),
        ("OnePlus 12", "oneplus-12", "Flagship killer with Snapdragon 8 Gen 3 and fast charging.", 799.99),
        ("Dell XPS 15", "dell-xps-15", "Premium 15-inch laptop with OLED display and powerful performance.", 1899.00),
        ("HP Spectre x360", "hp-spectre-x360", "Versatile 2-in-1 laptop with stunning design and battery life.", 1499.50),
        ("Lenovo ThinkPad X1 Carbon", "lenovo-thinkpad-x1", "Business ultrabook with top-tier keyboard and lightweight build.", 1600.00),
        ("JBL Charge 5", "jbl-charge-5", "Portable Bluetooth speaker with deep bass and waterproof design.", 149.95),
        ("Apple Watch Series 9", "apple-watch-series-9", "Advanced health tracking, double tap gesture, and bright display.", 399.00),
        ("Logitech MX Master 3S", "logitech-mx-master-3s", "Ergonomic wireless mouse tailored for creators and coders.", 99.99),
        ("Keychron Q1 Pro", "keychron-q1-pro", "Wireless custom mechanical keyboard with aluminum body.", 199.00),
        ("Logitech Brio 4K Webcam", "logitech-brio-4k", "Ultra HD webcam for professional video calls and streaming.", 169.99),
        ("Samsung 990 PRO 2TB SSD", "samsung-990-pro-2tb", "Blazing fast PCIe 4.0 NVMe SSD for gaming and intensive tasks.", 189.99),
        ("Asus ROG Zephyrus G14", "asus-rog-zephyrus-g14", "Powerful and portable 14-inch gaming laptop.", 1449.99),
        ("Sony A7 IV Mirrorless Camera", "sony-a7-iv", "Hybrid full-frame camera perfect for photos and video.", 2498.00),
        ("Nintendo Switch OLED", "nintendo-switch-oled", "Handheld console with a vibrant OLED screen.", 349.99),
        ("Bose QuietComfort Ultra", "bose-qc-ultra", "Premium noise-cancelling headphones with immersive spatial audio.", 429.00)
    ],
    2: [
        ("Men's Classic T-Shirt", "mens-classic-tshirt", "100% cotton crewneck t-shirt. Everyday essential.", 25.00),
        ("Women's Summer Dress", "womens-summer-dress", "Light and breezy floral dress perfect for warm weather.", 45.00),
        ("Slim Fit Jeans", "slim-fit-jeans", "Comfortable stretch denim in a modern slim fit.", 55.00),
        ("Fleece Pullover Hoodie", "fleece-pullover-hoodie", "Cozy fleece hoodie with kangaroo pocket.", 40.00),
        ("Chuck Taylor All Star", "chuck-taylor-all-star", "The classic canvas sneaker that goes with everything.", 60.00),
        ("Leather Biker Jacket", "leather-biker-jacket", "Genuine leather jacket with asymmetrical zip closure.", 199.99),
        ("Casio Vintage Watch", "casio-vintage-watch", "Retro digital watch with stainless steel band.", 35.00),
        ("Polarized Sunglasses", "polarized-sunglasses", "UV400 protection with durable lightweight frames.", 29.99),
        ("Designer Tote Handbag", "designer-tote-handbag", "Spacious and elegant tote bag crafted from vegan leather.", 89.99),
        ("Running Sports Shoes", "running-sports-shoes", "Lightweight athletic shoes with breathable mesh.", 75.00),
        ("Men's Chino Pants", "mens-chino-pants", "Versatile flat-front chinos for casual or office wear.", 49.99),
        ("Winter Puffer Coat", "winter-puffer-coat", "Warm, insulated coat to brave the cold months.", 120.00)
    ],
    3: [
        ("The AI Revolution in Medicine", "ai-revolution-medicine", "How AI is transforming healthcare and saving lives.", 28.00),
        ("Machine Learning Yearning", "ml-yearning", "A practical guide to structuring machine learning projects.", 35.00),
        ("Zero to One", "zero-to-one", "Notes on startups, or how to build the future.", 22.00),
        ("Thinking, Fast and Slow", "thinking-fast-and-slow", "Groundbreaking tour of the mind and decision making.", 19.99),
        ("Dune by Frank Herbert", "dune-frank-herbert", "The epic masterpiece of science fiction.", 18.50),
        ("Sapiens: A Brief History of Humankind", "sapiens", "Exploring the history and impact of Homo sapiens.", 24.99),
        ("A Brief History of Time", "brief-history-of-time", "Stephen Hawking's classic work on cosmology.", 18.00),
        ("Rich Dad Poor Dad", "rich-dad-poor-dad", "What the rich teach their kids about money.", 16.95),
        ("Project Hail Mary", "project-hail-mary", "A lone astronaut must save the earth from disaster.", 20.00),
        ("Grokking Algorithms", "grokking-algorithms", "An illustrated guide for programmers and other curious people.", 39.99)
    ],
    4: [
        ("KitchenAid Stand Mixer", "kitchenaid-stand-mixer", "Iconic stand mixer for baking and food prep.", 379.99),
        ("Zojirushi Rice Cooker", "zojirushi-rice-cooker", "Micom rice cooker and warmer for perfect rice every time.", 145.00),
        ("Yeti Rambler 20 oz", "yeti-rambler-20", "Stainless steel vacuum insulated tumbler.", 35.00),
        ("Ergonomic Office Chair", "ergonomic-office-chair", "Adjustable mesh chair with lumbar support.", 199.99),
        ("Modern Table Lamp", "modern-table-lamp", "Minimalist touch-control desk lamp with USB port.", 39.99),
        ("Shark Navigator Upright Vacuum", "shark-navigator", "Powerful upright vacuum with lift-away functionality.", 159.99),
        ("Caraway Nonstick Cookware", "caraway-cookware", "Ceramic non-stick 7-piece pot and pan set.", 395.00),
        ("Corelle 18-Piece Dinner Set", "corelle-dinner-set", "Chip-resistant glass dinnerware set for 6.", 65.00),
        ("Airtight Food Storage Containers", "airtight-storage-containers", "7-piece BPA-free clear plastic pantry organization set.", 39.99),
        ("Breville Barista Express", "breville-barista-express", "Create great tasting espresso in less than a minute.", 699.95)
    ],
    5: [
        ("Kookaburra Cricket Bat", "kookaburra-cricket-bat", "Premium English willow cricket bat for professional play.", 199.99),
        ("Adidas Fevernova Football", "adidas-fevernova", "Size 5 match ball inspired by classic designs.", 39.99),
        ("Spalding NBA Basketball", "spalding-nba-basketball", "Indoor/outdoor composite leather basketball.", 49.99),
        ("Yonex Astrox Badminton Racket", "yonex-astrox", "Lightweight graphite racket for smash power.", 85.00),
        ("Under Armour Gym Bag", "ua-gym-bag", "Durable duffel bag with water-resistant finish.", 45.00),
        ("Everlast Skipping Rope", "everlast-skipping-rope", "Adjustable speed rope for cardio training.", 12.99),
        ("Manduka PRO Yoga Mat", "manduka-pro-yoga-mat", "Ultra-dense and spacious performance yoga mat.", 130.00),
        ("Hex Dumbbell Set", "hex-dumbbell-set-10-30", "Rubber encased hex dumbbell sets (10-30 lbs).", 150.00)
    ],
    6: [
        ("CeraVe Hydrating Face Wash", "cerave-hydrating-cleanser", "Gentle cleanser with ceramides and hyaluronic acid.", 15.99),
        ("Olaplex No. 4 Shampoo", "olaplex-no-4", "Bond maintenance shampoo for healthier hair.", 30.00),
        ("Dior Sauvage Eau de Parfum", "dior-sauvage-edp", "A radically fresh and powerful men's fragrance.", 120.00),
        ("MAC Matte Lipstick", "mac-matte-lipstick", "Iconic long-wearing matte finish lipstick.", 23.00),
        ("Cetaphil Moisturizing Cream", "cetaphil-body-lotion", "Rich body cream for ultimate hydration.", 17.50),
        ("Dyson Supersonic Hair Dryer", "dyson-supersonic", "Fast drying with heat shield technology.", 429.99),
        ("La Mer Crème de la Mer", "la-mer-face-cream", "Luxurious and deeply moisturizing face cream.", 380.00),
        ("Philips Norelco Multigroom", "philips-multigroom", "All-in-one trimmer for face, head, and body.", 59.95)
    ],
    7: [
        ("The North Face Backpack", "north-face-backpack", "Durable everyday backpack with laptop sleeve.", 89.00),
        ("Bellroy Slim Leather Wallet", "bellroy-slim-wallet", "Minimalist front-pocket wallet blocking RFID.", 79.99),
        ("Spigen iPhone 15 Case", "spigen-iphone-15-case", "Tough armor case with kickstand and drop protection.", 19.99),
        ("Anker USB-C Hub 7-in-1", "anker-usb-c-hub", "Portable dock with 4K HDMI, SD card reader, and USB ports.", 34.99),
        ("Anker PowerCore 20000mAh", "anker-power-bank", "High-capacity portable charger with fast charging.", 49.99),
        ("Anker Nylon USB-C Cable", "anker-usb-c-cable", "6ft braided charging cable engineered for durability.", 14.99),
        ("TP-Link Bluetooth 5.0 Adapter", "tp-link-bluetooth-adapter", "Nano USB receiver for PC and laptops.", 12.99)
    ]
}

sql = """-- =============================================================================
-- CodeAlpha E-Commerce Store — Product Catalog Expansion
-- =============================================================================
USE `codealpha_ecommerce`;\n\n"""

sql += "-- 1. Add new categories\n"
sql += "INSERT IGNORE INTO `categories` (`id`, `name`, `slug`, `description`) VALUES\n"
sql += "  (6, 'Beauty', 'beauty', 'Skincare, makeup, and personal care products.'),\n"
sql += "  (7, 'Accessories', 'accessories', 'Bags, wallets, belts, and tech accessories.');\n\n"

sql += "-- 2. Add realistic products\n"
sql += "INSERT IGNORE INTO `products` (`category_id`, `name`, `slug`, `description`, `image_url`, `price`, `stock`, `is_featured`) VALUES\n"

values = []
for cat_id, products in products_data.items():
    for name, slug, desc, price in products:
        stock = random.randint(20, 150)
        is_featured = 1 if random.random() < 0.2 else 0
        
        # Use picsum for consistent, working image URLs with a fixed seed to get the same image.
        # Adding a category and slug specific seed ensures it differs per product but remains stable.
        image_url = f"https://picsum.photos/seed/{slug}/600/600"
        
        values.append(f"  ({cat_id}, '{name.replace(chr(39), chr(39)+chr(39))}', '{slug}', '{desc.replace(chr(39), chr(39)+chr(39))}', '{image_url}', {price}, {stock}, {is_featured})")

sql += ",\n".join(values) + ";\n"

with open("expand_catalog.sql", "w", encoding="utf-8") as f:
    f.write(sql)

print("Created expand_catalog.sql")
