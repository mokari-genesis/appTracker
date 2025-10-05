const joi = require('joi')
const { auctionDetailRepo } = require('entityQueries/index')

const getAuctionDetailsSchema = joi.object({
  page: joi.number().integer().min(0).required().default(0).failover(0),
  limit: joi.number().integer().min(1).allow(null),
  id: joi.number().integer().allow(null).optional(),
  auctionId: joi.number().integer().allow(null).optional(),
})
const getAuctionDetails = async ({ request }) => {
  const { error, value } = getAuctionDetailsSchema.validate(
    request.queryStringParameters || {}
  )

  if (error) {
    throw new Error(`Invalid Parameters: ${error.message}`)
  }

  const nextPageLimit = value.limit + 1

  const result = await auctionDetailRepo.getAuctionDetails({
    page: value.page * value.limit,
    limit: nextPageLimit,
    id: value.id,
    auctionId: value.auctionId,
  })

  const hasNextPage = result.length === nextPageLimit

  if (result.length === nextPageLimit) {
    result.pop()
  }

  return {
    auctionDetails: result,
    hasNextPage,
  }
}

const addAuctionDetailSchema = joi.object({
  auctionId: joi.number().integer().required(),
  productId: joi.number().integer().allow(null).optional(),
  weight: joi.number().min(0).required(),
  bagNumber: joi.string().min(1).max(100).allow(null, ''),
  numberOfPieces: joi.number().integer().min(0).allow(null),
  winner1ClientId: joi.number().integer().allow(null).optional(),
  winner2ClientId: joi.number().integer().allow(null).optional(),
  lot: joi.string().min(1).max(100).allow(null, ''),
  date: joi.date().required(),
  highestBidRmb: joi.number().min(0).allow(null),
  pricePerKg: joi.number().min(0).allow(null),
  priceSold: joi.number().min(0).allow(null),
})
const addAuctionDetail = async ({ request }) => {
  const { error, value } = addAuctionDetailSchema.validate(request.body)

  if (error) {
    throw new Error(`Invalid Parameters: ${error.message}`)
  }

  return auctionDetailRepo.insertAuctionDetail(value)
}

const updateAuctionDetailSchema = joi.object({
  id: joi.number().integer().required(),
  auctionId: joi.number().integer().required(),
  productId: joi.number().integer().allow(null).optional(),
  weight: joi.number().min(0).required(),
  bagNumber: joi.string().min(1).max(100).allow(null, ''),
  numberOfPieces: joi.number().integer().min(0).allow(null),
  winner1ClientId: joi.number().integer().allow(null).optional(),
  winner2ClientId: joi.number().integer().allow(null).optional(),
  lot: joi.string().min(1).max(100).allow(null, ''),
  date: joi.date().required(),
  highestBidRmb: joi.number().min(0).allow(null),
  pricePerKg: joi.number().min(0).allow(null),
  priceSold: joi.number().min(0).allow(null),
})
const updateAuctionDetail = async ({ request }) => {
  const { error, value } = updateAuctionDetailSchema.validate(request.body)

  if (error) {
    throw new Error(`Invalid Parameters: ${error.message}`)
  }

  return auctionDetailRepo.updateAuctionDetail(value)
}

const deleteAuctionDetailSchema = joi.object({
  id: joi.number().integer().required(),
})
const deleteAuctionDetail = async ({ request }) => {
  const { error, value } = deleteAuctionDetailSchema.validate(request.body)

  if (error) {
    throw new Error(`Invalid Parameters: ${error.message}`)
  }

  return auctionDetailRepo.deleteAuctionDetail(value)
}

module.exports = {
  getAuctionDetails,
  addAuctionDetail,
  updateAuctionDetail,
  deleteAuctionDetail,
}
