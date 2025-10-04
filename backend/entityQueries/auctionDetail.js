const { fetchResultMySQL } = require('libs/db')

const getAuctionDetails = fetchResultMySQL(({ page, limit, id, auctionId }, connection) =>
  connection.query(
    `
    SELECT 
      ad.id,
      ad.auction_id,
      ad.product_id,
      ad.weight,
      ad.bag_number,
      ad.number_of_pieces,
      ad.winner1_client_id,
      ad.winner2_client_id,
      ad.lot,
      ad.date,
      ad.highest_bid_rmb,
      ad.price_per_kg,
      ad.price_sold,
      ad.created_at,
      ah.name as auction_name,
      p.name as product_name,
      c1.name as winner1_name,
      c2.name as winner2_name
    FROM 
      auction_details ad
      LEFT JOIN auction_headers ah ON ad.auction_id = ah.id
      LEFT JOIN products p ON ad.product_id = p.id
      LEFT JOIN clients c1 ON ad.winner1_client_id = c1.id
      LEFT JOIN clients c2 ON ad.winner2_client_id = c2.id
    WHERE 
      ad.is_deleted = false
      AND (ad.id = ? OR ? IS NULL)
      AND (ad.auction_id = ? OR ? IS NULL)
    ORDER BY 
      ad.date DESC, ad.created_at DESC
    ${limit ? `LIMIT ? OFFSET ?` : ''}
  `,
    [id, id, auctionId, auctionId, limit, page]
  )
)

const insertAuctionDetail = fetchResultMySQL((params, connection) =>
  connection.query(
    `
      INSERT INTO auction_details (
        auction_id,
        product_id,
        weight,
        bag_number,
        number_of_pieces,
        winner1_client_id,
        winner2_client_id,
        lot,
        date,
        highest_bid_rmb,
        price_per_kg,
        price_sold
      )
      VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
     )
    `,
    [
      params.auctionId,
      params.productId || null,
      params.weight,
      params.bagNumber,
      params.numberOfPieces,
      params.winner1ClientId || null,
      params.winner2ClientId || null,
      params.lot,
      params.date,
      params.highestBidRmb,
      params.pricePerKg,
      params.priceSold,
    ]
  )
)

const updateAuctionDetail = fetchResultMySQL((params, connection) =>
  connection.query(
    `
      UPDATE auction_details
      SET 
        auction_id = ?,
        product_id = ?,
        weight = ?,
        bag_number = ?,
        number_of_pieces = ?,
        winner1_client_id = ?,
        winner2_client_id = ?,
        lot = ?,
        date = ?,
        highest_bid_rmb = ?,
        price_per_kg = ?,
        price_sold = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE 
        id = ?
    `,
    [
      params.auctionId,
      params.productId || null,
      params.weight,
      params.bagNumber,
      params.numberOfPieces,
      params.winner1ClientId || null,
      params.winner2ClientId || null,
      params.lot,
      params.date,
      params.highestBidRmb,
      params.pricePerKg,
      params.priceSold,
      params.id,
    ]
  )
)

const deleteAuctionDetail = fetchResultMySQL(({ id }, connection) =>
  connection.query(
    `
      UPDATE auction_details
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
  getAuctionDetails,
  insertAuctionDetail,
  updateAuctionDetail,
  deleteAuctionDetail,
}
