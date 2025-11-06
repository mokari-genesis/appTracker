const { fetchResultMySQL } = require('libs/db')

const getAuctionHeaders = fetchResultMySQL(({ page, limit, id }, connection) =>
  connection.query(
    `
    SELECT 
      ah.id,
      ah.name,
      ah.auction_house_id,
      ah.number_of_people,
      ah.date,
      ah.exchange_rate,
      ah.is_closed,
      ah.closed_at,
      ah.created_at,
      ahs.name as auction_house_name,
      ahs.commission_rate
    FROM 
      auction_headers ah
      LEFT JOIN auction_houses ahs ON ah.auction_house_id = ahs.id
    WHERE 
      ah.is_deleted = false
      AND (ah.id = ? OR ? IS NULL)
    ORDER BY 
      ah.date DESC, ah.created_at DESC
    ${limit ? `LIMIT ? OFFSET ?` : ''}
  `,
    [id, id, limit, page]
  )
)

const getNextAuctionHeaderId = fetchResultMySQL((params, connection) =>
  connection.query(
    `
    SELECT 
      COALESCE(MAX(id), 0) + 1 as nextId
    FROM 
      auction_headers
  `,
    []
  )
)

const insertAuctionHeader = fetchResultMySQL(
  ({ name, auctionHouseId, numberOfPeople, date, exchangeRate }, connection) =>
    connection.query(
      `
      INSERT INTO auction_headers (
        name,
        auction_house_id, 
        number_of_people, 
        date, 
        exchange_rate
      )
      VALUES (
        ?, 
        ?,
        ?, 
        ?, 
        ?
     )
    `,
      [name, auctionHouseId, numberOfPeople, date, exchangeRate]
    )
)

const updateAuctionHeader = fetchResultMySQL(
  ({ id, name, auctionHouseId, numberOfPeople, date, exchangeRate }, connection) =>
    connection.query(
      `
      UPDATE auction_headers
      SET 
        name = ?,
        auction_house_id = ?,
        number_of_people = ?,
        date = ?,
        exchange_rate = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE 
        id = ?
    `,
      [name, auctionHouseId, numberOfPeople, date, exchangeRate, id]
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

const getAuctionMetricsData = fetchResultMySQL((params, connection) =>
  connection.query(
    `
    SELECT 
      ah.id,
      ah.name,
      ah.number_of_people,
      ah.exchange_rate,
      ahs.commission_rate,
      ad.id as detail_id,
      ad.price_sold,
      ad.highest_bid_rmb,
      ad.is_sold
    FROM 
      auction_headers ah
      LEFT JOIN auction_houses ahs ON ah.auction_house_id = ahs.id
      LEFT JOIN auction_details ad ON ah.id = ad.auction_id AND ad.is_deleted = false
    WHERE 
      ah.is_deleted = false
  `,
    []
  )
)

module.exports = {
  getAuctionHeaders,
  getNextAuctionHeaderId,
  insertAuctionHeader,
  updateAuctionHeader,
  closeAuctionHeader,
  reopenAuctionHeader,
  deleteAuctionHeader,
  getAuctionMetricsData,
}
