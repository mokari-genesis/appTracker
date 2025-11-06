const { fetchResultMySQL } = require('libs/db')

const getAuctionHouses = fetchResultMySQL(({ id }, connection) =>
  connection.query(
    `
    SELECT 
      id,
      name,
      commission_rate,
      is_active,
      created_at 
    FROM 
      auction_houses
    WHERE 
      is_active = true
      AND (id = ? OR ? IS NULL)
    ORDER BY 
      name ASC
  `,
    [id, id]
  )
)

const insertAuctionHouse = fetchResultMySQL(({ name, commissionRate }, connection) =>
  connection.query(
    `
      INSERT INTO auction_houses (
        name, 
        commission_rate
      )
      VALUES (
        ?, 
        ?
     )
    `,
    [name, commissionRate]
  )
)

const updateAuctionHouse = fetchResultMySQL(({ id, name, commissionRate }, connection) =>
  connection.query(
    `
      UPDATE auction_houses
      SET 
        name = ?,
        commission_rate = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE 
        id = ?
    `,
    [name, commissionRate, id]
  )
)

const deleteAuctionHouse = fetchResultMySQL(({ id }, connection) =>
  connection.query(
    `
      UPDATE auction_houses
      SET 
        is_active = false,
        updated_at = CURRENT_TIMESTAMP
      WHERE 
        id = ?
    `,
    [id]
  )
)

module.exports = {
  getAuctionHouses,
  insertAuctionHouse,
  updateAuctionHouse,
  deleteAuctionHouse,
}
