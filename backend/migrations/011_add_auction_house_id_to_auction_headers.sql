-- Migration: Add auction_house_id to auction_headers table
-- Created: 2025-11-05

-- Add the new column
ALTER TABLE auction_headers
  ADD COLUMN auction_house_id INT AFTER name;

-- Add foreign key constraint
ALTER TABLE auction_headers
  ADD CONSTRAINT fk_auction_headers_auction_house
  FOREIGN KEY (auction_house_id) REFERENCES auction_houses(id)
  ON DELETE RESTRICT
  ON UPDATE CASCADE;

-- Migrate existing data: map name to auction_house_id
UPDATE auction_headers ah
JOIN auction_houses ahs ON ah.name = ahs.name
SET ah.auction_house_id = ahs.id;

-- Rollback
-- ALTER TABLE auction_headers DROP FOREIGN KEY fk_auction_headers_auction_house;
-- ALTER TABLE auction_headers DROP COLUMN auction_house_id;
