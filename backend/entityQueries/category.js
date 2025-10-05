const { fetchResultMySQL } = require('libs/db')

const getCategories = fetchResultMySQL(({ page, limit, id }, connection) =>
  connection.query(
    `
    SELECT 
      id,
      name,
      description,
      created_at 
    FROM 
      categories
    WHERE 
      is_deleted = false
      AND (id = ? OR ? IS NULL)
    ORDER BY 
      created_at DESC
    ${limit ? `LIMIT ? OFFSET ?` : ''}
  `,
    [id, id, limit, page]
  )
)

const insertCategory = fetchResultMySQL(({ name, description }, connection) =>
  connection.query(
    `
      INSERT INTO categories (
        name, 
        description
      )
      VALUES (
        ?, 
        ?
     )
    `,
    [name, description]
  )
)

const updateCategory = fetchResultMySQL(({ id, name, description }, connection) =>
  connection.query(
    `
      UPDATE categories
      SET 
        name = ?,
        description = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE 
        id = ?
    `,
    [name, description, id]
  )
)

const deleteCategory = fetchResultMySQL(({ id }, connection) =>
  connection.query(
    `
      UPDATE categories
      SET 
        is_deleted = true,
        updated_at = CURRENT_TIMESTAMP
      WHERE 
        id = ?
    `,
    [id]
  )
)

const getProductsByCategory = fetchResultMySQL(({ categoryId }, connection) =>
  connection.query(
    `
    SELECT 
      count(*) as total_products, 
      ca.name as category_name,
      pr.category_id
    FROM 
      products pr 
      INNER JOIN categories ca ON pr.category_id = ca.id
    WHERE  
      (ca.id = ? OR ? IS NULL)
      AND pr.is_deleted = false
    GROUP BY pr.category_id, ca.name
  `,
    [categoryId, categoryId]
  )
)

module.exports = {
  getCategories,
  insertCategory,
  updateCategory,
  deleteCategory,
  getProductsByCategory,
}
