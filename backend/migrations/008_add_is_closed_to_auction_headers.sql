-- Migration: Add is_closed column to auction_headers
-- Created: 2025-10-04

-- Add is_closed column
ALTER TABLE auction_headers 
  ADD COLUMN is_closed BOOLEAN DEFAULT FALSE NOT NULL AFTER exchange_rate,
  ADD COLUMN closed_at TIMESTAMP NULL AFTER is_closed;

-- Add index for filtering closed auctions
ALTER TABLE auction_headers
  ADD INDEX idx_is_closed (is_closed);

-- Rollback
-- ALTER TABLE auction_headers 
--   DROP INDEX idx_is_closed,
--   DROP COLUMN closed_at,
--   DROP COLUMN is_closed;
