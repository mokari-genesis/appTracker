const { fetchResultMySQL } = require('libs/db')

const getClients = fetchResultMySQL(({ page, limit, id }, connection) =>
  connection.query(
    `
    SELECT 
      id,
      name,
      email,
      phone,
      company,
      address,
      created_at 
    FROM 
      clients
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

const insertClient = fetchResultMySQL(
  ({ name, email, phone, company, address }, connection) =>
    connection.query(
      `
      INSERT INTO clients (
        name, 
        email, 
        phone, 
        company,
        address
      )
      VALUES (
        ?, 
        ?, 
        ?, 
        ?,
        ?
     )
    `,
      [name, email, phone, company, address]
    )
)

const updateClient = fetchResultMySQL(
  ({ id, name, email, phone, company, address }, connection) =>
    connection.query(
      `
      UPDATE clients
      SET 
        name = ?,
        email = ?,
        phone = ?,
        company = ?,
        address = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE 
        id = ?
    `,
      [name, email, phone, company, address, id]
    )
)

const deleteClient = fetchResultMySQL(({ id }, connection) =>
  connection.query(
    `
      UPDATE clients
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
  getClients,
  insertClient,
  updateClient,
  deleteClient,
}
