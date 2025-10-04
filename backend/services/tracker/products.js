const joi = require('joi')
const { productRepo } = require('entityQueries/index')

const getProductsSchema = joi.object({
  page: joi.number().integer().min(0).required().default(0).failover(0),
  limit: joi.number().integer().min(1).allow(null),
  id: joi.number().integer().allow(null).optional(),
  categoryId: joi.number().integer().allow(null).optional(),
})
const getProducts = async ({ request }) => {
  const { error, value } = getProductsSchema.validate(request.queryStringParameters || {})

  if (error) {
    throw new Error(`Invalid Parameters: ${error.message}`)
  }

  const nextPageLimit = value.limit + 1

  const result = await productRepo.getProducts({
    page: value.page * value.limit,
    limit: nextPageLimit,
    id: value.id,
    categoryId: value.categoryId,
  })

  const hasNextPage = result.length === nextPageLimit

  if (result.length === nextPageLimit) {
    result.pop()
  }

  return {
    products: result,
    hasNextPage,
  }
}

const addProductSchema = joi.object({
  name: joi.string().min(1).max(200).required(),
  description: joi.string().max(500).optional().allow(null, ''),
  categoryId: joi.number().integer().required(),
  sku: joi.string().min(1).max(100).required(),
  basePrice: joi.number().min(0).allow(null),
})
const addProduct = async ({ request }) => {
  const { error, value } = addProductSchema.validate(request.body)

  if (error) {
    throw new Error(`Invalid Parameters: ${error.message}`)
  }

  return productRepo.insertProduct(value)
}

const updateProductSchema = joi.object({
  id: joi.number().integer().required(),
  name: joi.string().min(1).max(200).required(),
  description: joi.string().max(500).optional().allow(null, ''),
  categoryId: joi.number().integer().required(),
  sku: joi.string().min(1).max(100).required(),
  basePrice: joi.number().min(0).allow(null),
})
const updateProduct = async ({ request }) => {
  const { error, value } = updateProductSchema.validate(request.body)

  if (error) {
    throw new Error(`Invalid Parameters: ${error.message}`)
  }

  return productRepo.updateProduct(value)
}

const deleteProductSchema = joi.object({
  id: joi.number().integer().required(),
})
const deleteProduct = async ({ request }) => {
  const { error, value } = deleteProductSchema.validate(request.body)

  if (error) {
    throw new Error(`Invalid Parameters: ${error.message}`)
  }

  return productRepo.deleteProduct(value)
}

module.exports = {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
}
