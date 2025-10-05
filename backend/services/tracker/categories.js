const joi = require('joi')
const { categoryRepo } = require('entityQueries/index')

const getCategoriesSchema = joi.object({
  page: joi.number().integer().min(0).required().default(0).failover(0),
  limit: joi.number().integer().min(1).allow(null),
  id: joi.number().integer().allow(null).optional(),
})
const getCategories = async ({ request }) => {
  const { error, value } = getCategoriesSchema.validate(
    request.queryStringParameters || {}
  )

  if (error) {
    throw new Error(`Invalid Parameters: ${error.message}`)
  }

  const nextPageLimit = value.limit + 1

  const result = await categoryRepo.getCategories({
    page: value.page * value.limit,
    limit: nextPageLimit,
    id: value.id,
  })

  const hasNextPage = result.length === nextPageLimit

  if (result.length === nextPageLimit) {
    result.pop()
  }

  return {
    categories: result,
    hasNextPage,
  }
}

const addCategorySchema = joi.object({
  name: joi.string().min(1).max(100).required(),
  description: joi.string().max(500).optional().allow(null, ''),
})
const addCategory = async ({ request }) => {
  const { error, value } = addCategorySchema.validate(request.body)

  if (error) {
    throw new Error(`Invalid Parameters: ${error.message}`)
  }

  return categoryRepo.insertCategory(value)
}

const updateCategorySchema = joi.object({
  id: joi.number().integer().required(),
  name: joi.string().min(1).max(100).required(),
  description: joi.string().max(500).optional().allow(null, ''),
})
const updateCategory = async ({ request }) => {
  const { error, value } = updateCategorySchema.validate(request.body)

  if (error) {
    throw new Error(`Invalid Parameters: ${error.message}`)
  }

  return categoryRepo.updateCategory(value)
}

const deleteCategorySchema = joi.object({
  id: joi.number().integer().required(),
})
const deleteCategory = async ({ request }) => {
  const { error, value } = deleteCategorySchema.validate(request.body)

  if (error) {
    throw new Error(`Invalid Parameters: ${error.message}`)
  }

  return categoryRepo.deleteCategory(value)
}

const getProductsByCategorySchema = joi.object({
  categoryId: joi.number().integer().required(),
})
const getProductsByCategory = async ({ request }) => {
  const { error, value } = getProductsByCategorySchema.validate(
    request.queryStringParameters
  )

  if (error) {
    throw new Error(`Invalid Parameters: ${error.message}`)
  }

  return categoryRepo.getProductsByCategory({
    categoryId: value.categoryId,
  })
}

module.exports = {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  getProductsByCategory,
}
