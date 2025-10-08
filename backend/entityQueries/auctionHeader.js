const { fetchResultMySQL } = require('libs/db')

const getAuctionHeaders = fetchResultMySQL(({ page, limit, id }, connection) =>
  connection.query(
    `
    SELECT 
      id,
      name,
      number_of_people,
      date,
      exchange_rate,
      is_closed,
      closed_at,
      created_at 
    FROM 
      auction_headers
    WHERE 
      is_deleted = false
      AND (id = ? OR ? IS NULL)
    ORDER BY 
      date DESC, created_at DESC
    ${limit ? `LIMIT ? OFFSET ?` : ''}
  `,
    [id, id, limit, page]
  )
)

const insertAuctionHeader = fetchResultMySQL(
  ({ name, numberOfPeople, date, exchangeRate }, connection) =>
    connection.query(
      `
      INSERT INTO auction_headers (
        name, 
        number_of_people, 
        date, 
        exchange_rate
      )
      VALUES (
        ?, 
        ?, 
        ?, 
        ?
     )
    `,
      [name, numberOfPeople, date, exchangeRate]
    )
)

const updateAuctionHeader = fetchResultMySQL(
  ({ id, name, numberOfPeople, date, exchangeRate }, connection) =>
    connection.query(
      `
      UPDATE auction_headers
      SET 
        name = ?,
        number_of_people = ?,
        date = ?,
        exchange_rate = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE 
        id = ?
    `,
      [name, numberOfPeople, date, exchangeRate, id]
    )
)

const closeAuctionHeader = fetchResultMySQL(({ id }, connection) =>
  connection.query(
    `
      UPDATE auction_headers
      SET 
        is_closed = true,
        closed_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
      WHERE 
        id = ?
    `,
    [id]
  )
)

const reopenAuctionHeader = fetchResultMySQL(({ id }, connection) =>
  connection.query(
    `
      UPDATE auction_headers
      SET 
        is_closed = false,
        closed_at = NULL,
        updated_at = CURRENT_TIMESTAMP
      WHERE 
        id = ?
    `,
    [id]
  )
)

const deleteAuctionHeader = fetchResultMySQL(({ id }, connection) =>
  connection.query(
    `
      UPDATE auction_headers
      SET 
        is_deleted = true,
        updated_at = CURRENT_TIMESTAMP
      WHERE 
        id = ?
    `,
    [id]
  )
)

module.exports = {
  getAuctionHeaders,
  insertAuctionHeader,
  updateAuctionHeader,
  closeAuctionHeader,
  reopenAuctionHeader,
  deleteAuctionHeader,
}
