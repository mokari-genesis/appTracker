const categories = require('../categories')

const categoriesRoute = [
  {
    path: 'categories',
    method: 'GET',
    handler: categories.getCategories,
    public: false,
  },
  {
    path: 'categories',
    method: 'POST',
    handler: categories.addCategory,
    public: false,
  },
  {
    path: 'categories',
    method: 'PUT',
    handler: categories.updateCategory,
    public: false,
  },
  {
    path: 'categories',
    method: 'DELETE',
    handler: categories.deleteCategory,
    public: false,
  },
  {
    path: 'productsByCategory',
    method: 'GET',
    handler: categories.getProductsByCategory,
    public: false,
  },
]

module.exports = categoriesRoute
