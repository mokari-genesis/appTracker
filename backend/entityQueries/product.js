const { fetchResultMySQL } = require('libs/db')

const getProducts = fetchResultMySQL(({ page, limit, id, categoryId }, connection) =>
  connection.query(
    `
    SELECT 
      p.id,
      p.name,
      p.description,
      p.category_id,
      p.sku,
      p.base_price,
      p.created_at,
      c.name as category_name
    FROM 
      products p
      LEFT JOIN categories c ON p.category_id = c.id
    WHERE 
      p.is_deleted = false
      AND (p.id = ? OR ? IS NULL)
      AND (p.category_id = ? OR ? IS NULL)
    ORDER BY 
      p.created_at DESC
    ${limit ? `LIMIT ? OFFSET ?` : ''}
  `,
    [id, id, categoryId, categoryId, limit, page]
  )
)

const insertProduct = fetchResultMySQL(
  ({ name, description, categoryId, sku, basePrice }, connection) =>
    connection.query(
      `
      INSERT INTO products (
        name, 
        description, 
        category_id, 
        sku,
        base_price
      )
      VALUES (
        ?, 
        ?, 
        ?, 
        ?,
        ?
     )
    `,
      [name, description, categoryId, sku, basePrice]
    )
)

const updateProduct = fetchResultMySQL(
  ({ id, name, description, categoryId, sku, basePrice }, connection) =>
    connection.query(
      `
      UPDATE products
      SET 
        name = ?,
        description = ?,
        category_id = ?,
        sku = ?,
        base_price = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE 
        id = ?
    `,
      [name, description, categoryId, sku, basePrice, id]
    )
)

const deleteProduct = fetchResultMySQL(({ id }, connection) =>
  connection.query(
    `
      UPDATE products
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
  getProducts,
  insertProduct,
  updateProduct,
  deleteProduct,
}
