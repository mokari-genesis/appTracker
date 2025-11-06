-- Migration: Create auction_houses table
-- Created: 2025-11-05

CREATE TABLE IF NOT EXISTS auction_houses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL UNIQUE,
  commission_rate DECIMAL(5,4) NOT NULL COMMENT 'Commission rate as decimal (e.g., 0.02 for 2%, 0.08 for 8%)',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert initial auction houses
INSERT INTO auction_houses (name, commission_rate) VALUES
  ('Juan', 0.02),
  ('Antonio', 0.02),
  ('Pinguino', 0.08);

-- Rollback
-- DROP TABLE IF EXISTS auction_houses;
