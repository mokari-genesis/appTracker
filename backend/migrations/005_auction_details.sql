-- Migration: Create auction_details table
-- Created: 2025-10-03

CREATE TABLE IF NOT EXISTS auction_details (
  id INT AUTO_INCREMENT PRIMARY KEY,
  auction_id INT NOT NULL,
  type TEXT NOT NULL,
  weight DECIMAL(10,2) NOT NULL,
  bag_number TEXT,
  number_of_pieces INT,
  winner1 TEXT,
  winner2 TEXT,
  lot TEXT,
  date DATE,
  highest_bid_rmb DECIMAL(10,2),
  price_per_kg DECIMAL(10,2),
  price_sold DECIMAL(10,2),
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (auction_id) REFERENCES auction_headers(id) ON DELETE CASCADE,
  INDEX idx_auction_id (auction_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Rollback
-- DROP TABLE IF EXISTS auction_details;
