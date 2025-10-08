const joi = require('joi')
const { auctionHeaderRepo } = require('entityQueries/index')

const getAuctionHeadersSchema = joi.object({
  page: joi.number().integer().min(0).required().default(0).failover(0),
  limit: joi.number().integer().min(1).allow(null),
  id: joi.number().integer().allow(null).optional(),
})
const getAuctionHeaders = async ({ request }) => {
  const { error, value } = getAuctionHeadersSchema.validate(
    request.queryStringParameters || {}
  )

  if (error) {
    throw new Error(`Invalid Parameters: ${error.message}`)
  }

  const nextPageLimit = value.limit + 1

  const result = await auctionHeaderRepo.getAuctionHeaders({
    page: value.page * value.limit,
    limit: nextPageLimit,
    id: value.id,
  })

  const hasNextPage = result.length === nextPageLimit

  if (result.length === nextPageLimit) {
    result.pop()
  }

  return {
    auctionHeaders: result,
    hasNextPage,
  }
}

const getNextAuctionHeaderId = async () => {
  const result = await auctionHeaderRepo.getNextAuctionHeaderId({})
  return {
    nextId: result[0]?.nextId || 1,
  }
}

const addAuctionHeaderSchema = joi.object({
  name: joi.string().min(1).max(200).required(),
  numberOfPeople: joi.number().integer().min(0).allow(null),
  date: joi.date().required(),
  exchangeRate: joi.number().min(0).allow(null),
})
const addAuctionHeader = async ({ request }) => {
  const { error, value } = addAuctionHeaderSchema.validate(request.body)

  if (error) {
    throw new Error(`Invalid Parameters: ${error.message}`)
  }

  return auctionHeaderRepo.insertAuctionHeader(value)
}

const updateAuctionHeaderSchema = joi.object({
  id: joi.number().integer().required(),
  name: joi.string().min(1).max(200).required(),
  numberOfPeople: joi.number().integer().min(0).allow(null),
  date: joi.date().required(),
  exchangeRate: joi.number().min(0).allow(null),
})
const updateAuctionHeader = async ({ request }) => {
  const { error, value } = updateAuctionHeaderSchema.validate(request.body)

  if (error) {
    throw new Error(`Invalid Parameters: ${error.message}`)
  }

  return auctionHeaderRepo.updateAuctionHeader(value)
}

const closeAuctionHeaderSchema = joi.object({
  id: joi.number().integer().required(),
})
const closeAuctionHeader = async ({ request }) => {
  const { error, value } = closeAuctionHeaderSchema.validate(request.body)

  if (error) {
    throw new Error(`Invalid Parameters: ${error.message}`)
  }

  return auctionHeaderRepo.closeAuctionHeader(value)
}

const reopenAuctionHeaderSchema = joi.object({
  id: joi.number().integer().required(),
})
const reopenAuctionHeader = async ({ request }) => {
  const { error, value } = reopenAuctionHeaderSchema.validate(request.body)

  if (error) {
    throw new Error(`Invalid Parameters: ${error.message}`)
  }

  return auctionHeaderRepo.reopenAuctionHeader(value)
}

const deleteAuctionHeaderSchema = joi.object({
  id: joi.number().integer().required(),
})
const deleteAuctionHeader = async ({ request }) => {
  const { error, value } = deleteAuctionHeaderSchema.validate(request.body)

  if (error) {
    throw new Error(`Invalid Parameters: ${error.message}`)
  }

  return auctionHeaderRepo.deleteAuctionHeader(value)
}

module.exports = {
  getAuctionHeaders,
  getNextAuctionHeaderId,
  addAuctionHeader,
  updateAuctionHeader,
  closeAuctionHeader,
  reopenAuctionHeader,
  deleteAuctionHeader,
}
