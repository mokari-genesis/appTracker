-- Migration: Add is_sold column to auction_details table
-- Created: 2025-10-05

ALTER TABLE auction_details
ADD COLUMN is_sold BOOLEAN DEFAULT FALSE AFTER price_sold;

-- Rollback
-- ALTER TABLE auction_details DROP COLUMN is_sold;
