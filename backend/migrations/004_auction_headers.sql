-- Migration: Create auction_headers table
-- Created: 2025-10-03

CREATE TABLE IF NOT EXISTS auction_headers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name TEXT NOT NULL,
  number_of_people INT,
  date DATE NOT NULL,
  exchange_rate DECIMAL(10,4),
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Rollback
-- DROP TABLE IF EXISTS auction_headers;
