-- =============================================================================
-- Product Details Extension Schema Migration
-- =============================================================================

USE `codealpha_ecommerce`;

-- ── 1. product_gallery ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `product_gallery` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `product_id`    BIGINT UNSIGNED NOT NULL,
  `image_url`     VARCHAR(500)    NOT NULL,
  `display_order` INT             NOT NULL DEFAULT 0,
  `created_at`    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (`id`),
  INDEX `idx_gallery_product_id` (`product_id`),
  CONSTRAINT `fk_gallery_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── 2. product_specifications ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `product_specifications` (
  `id`         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `product_id` BIGINT UNSIGNED NOT NULL,
  `spec_key`   VARCHAR(150)    NOT NULL,
  `spec_value` VARCHAR(255)    NOT NULL,

  PRIMARY KEY (`id`),
  INDEX `idx_specs_product_id` (`product_id`),
  CONSTRAINT `fk_specs_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── 3. product_reviews ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `product_reviews` (
  `id`                 BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `product_id`          BIGINT UNSIGNED NOT NULL,
  `user_name`          VARCHAR(150)    NOT NULL,
  `user_avatar`        VARCHAR(500)        NULL,
  `rating`             INT             NOT NULL DEFAULT 5,
  `review`             TEXT            NOT NULL,
  `verified_purchase` TINYINT(1)      NOT NULL DEFAULT 1,
  `created_at`          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (`id`),
  INDEX `idx_reviews_product_id` (`product_id`),
  CONSTRAINT `fk_reviews_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
