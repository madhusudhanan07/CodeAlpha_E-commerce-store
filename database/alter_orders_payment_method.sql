-- =============================================================================
-- ALTER TABLE: Add payment_method column to orders table
-- Required for Checkout & Order Processing module
-- =============================================================================

USE `codealpha_ecommerce`;

ALTER TABLE `orders`
  ADD COLUMN `payment_method` VARCHAR(50) NOT NULL DEFAULT 'Cash on Delivery'
  COMMENT 'Payment method selected at checkout (e.g., Cash on Delivery, UPI, Credit/Debit Card)'
  AFTER `payment_status`;
