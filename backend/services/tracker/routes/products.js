const products = require('../products')

const productsRoute = [
  {
    path: 'products',
    method: 'GET',
    handler: products.getProducts,
    public: false,
  },
  {
    path: 'products',
    method: 'POST',
    handler: products.addProduct,
    public: false,
  },
  {
    path: 'products',
    method: 'PUT',
    handler: products.updateProduct,
    public: false,
  },
  {
    path: 'products',
    method: 'DELETE',
    handler: products.deleteProduct,
    public: false,
  },
]

module.exports = productsRoute
