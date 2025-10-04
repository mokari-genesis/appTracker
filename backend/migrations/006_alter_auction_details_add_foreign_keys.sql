-- Migration: Alter auction_details to add foreign keys for product and clients
-- Created: 2025-10-04

-- Add new columns for foreign keys
ALTER TABLE auction_details 
  ADD COLUMN product_id INT NULL AFTER auction_id,
  ADD COLUMN winner1_client_id INT NULL AFTER number_of_pieces,
  ADD COLUMN winner2_client_id INT NULL AFTER winner1_client_id;

-- Add foreign key constraints
ALTER TABLE auction_details
  ADD CONSTRAINT fk_auction_details_product 
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
  ADD CONSTRAINT fk_auction_details_winner1 
    FOREIGN KEY (winner1_client_id) REFERENCES clients(id) ON DELETE SET NULL,
  ADD CONSTRAINT fk_auction_details_winner2 
    FOREIGN KEY (winner2_client_id) REFERENCES clients(id) ON DELETE SET NULL;

-- Add indexes for better query performance
ALTER TABLE auction_details
  ADD INDEX idx_product_id (product_id),
  ADD INDEX idx_winner1_client_id (winner1_client_id),
  ADD INDEX idx_winner2_client_id (winner2_client_id);

-- Rollback
-- ALTER TABLE auction_details 
--   DROP FOREIGN KEY fk_auction_details_product,
--   DROP FOREIGN KEY fk_auction_details_winner1,
--   DROP FOREIGN KEY fk_auction_details_winner2,
--   DROP INDEX idx_product_id,
--   DROP INDEX idx_winner1_client_id,
--   DROP INDEX idx_winner2_client_id,
--   DROP COLUMN product_id,
--   DROP COLUMN winner1_client_id,
--   DROP COLUMN winner2_client_id;
