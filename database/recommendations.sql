-- =============================================================================
-- Product Recommendation Engine Schema Migration
-- =============================================================================

USE `codealpha_ecommerce`;

-- ── 1. recently_viewed ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `recently_viewed` (
  `id`         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id`    BIGINT UNSIGNED     NULL,
  `session_id` VARCHAR(128)        NULL,
  `product_id` BIGINT UNSIGNED NOT NULL,
  `viewed_at`  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_user_product`    (`user_id`, `product_id`),
  UNIQUE KEY `uq_session_product` (`session_id`, `product_id`),
  INDEX `idx_recently_user`       (`user_id`),
  INDEX `idx_recently_session`    (`session_id`),
  CONSTRAINT `fk_recently_user`    FOREIGN KEY (`user_id`)    REFERENCES `users` (`id`)    ON DELETE CASCADE,
  CONSTRAINT `fk_recently_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── 2. frequently_bought ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `frequently_bought` (
  `id`              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `product_id`      BIGINT UNSIGNED NOT NULL,
  `accessory_id`    BIGINT UNSIGNED NOT NULL,
  `bundle_discount` INT             NOT NULL DEFAULT 10,

  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_bundle_pair` (`product_id`, `accessory_id`),
  CONSTRAINT `fk_fb_product`   FOREIGN KEY (`product_id`)   REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_fb_accessory` FOREIGN KEY (`accessory_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── 3. product_popularity ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `product_popularity` (
  `id`               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `product_id`       BIGINT UNSIGNED NOT NULL,
  `sold_count`       INT             NOT NULL DEFAULT 0,
  `view_count`       INT             NOT NULL DEFAULT 0,
  `wishlist_count`   INT             NOT NULL DEFAULT 0,
  `popularity_score` INT             NOT NULL DEFAULT 0,

  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_pop_product` (`product_id`),
  CONSTRAINT `fk_pop_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
