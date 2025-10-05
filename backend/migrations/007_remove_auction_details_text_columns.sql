-- Migration: Remove text columns from auction_details (type, winner1, winner2)
-- Created: 2025-10-04
-- These columns are now replaced by foreign keys (product_id, winner1_client_id, winner2_client_id)

-- Remove the old text columns
ALTER TABLE auction_details 
  DROP COLUMN type,
  DROP COLUMN winner1,
  DROP COLUMN winner2;

-- Rollback
-- ALTER TABLE auction_details 
--   ADD COLUMN type TEXT NOT NULL AFTER product_id,
--   ADD COLUMN winner1 TEXT AFTER winner2_client_id,
--   ADD COLUMN winner2 TEXT AFTER winner1;
