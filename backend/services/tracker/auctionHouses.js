const joi = require('joi')
const { auctionHouseRepo } = require('entityQueries/index')

const getAuctionHousesSchema = joi.object({
  id: joi.number().integer().allow(null).optional(),
})
const getAuctionHouses = async ({ request }) => {
  const { error, value } = getAuctionHousesSchema.validate(request.queryStringParameters || {})

  if (error) {
    throw new Error(`Invalid Parameters: ${error.message}`)
  }

  const result = await auctionHouseRepo.getAuctionHouses({
    id: value.id,
  })

  return {
    auctionHouses: result,
  }
}

const addAuctionHouseSchema = joi.object({
  name: joi.string().min(1).max(200).required(),
  commissionRate: joi.number().min(0).max(1).required(),
})
const addAuctionHouse = async ({ request }) => {
  const { error, value } = addAuctionHouseSchema.validate(request.body)

  if (error) {
    throw new Error(`Invalid Parameters: ${error.message}`)
  }

  return auctionHouseRepo.insertAuctionHouse(value)
}

const updateAuctionHouseSchema = joi.object({
  id: joi.number().integer().required(),
  name: joi.string().min(1).max(200).required(),
  commissionRate: joi.number().min(0).max(1).required(),
})
const updateAuctionHouse = async ({ request }) => {
  const { error, value } = updateAuctionHouseSchema.validate(request.body)

  if (error) {
    throw new Error(`Invalid Parameters: ${error.message}`)
  }

  return auctionHouseRepo.updateAuctionHouse(value)
}

const deleteAuctionHouseSchema = joi.object({
  id: joi.number().integer().required(),
})
const deleteAuctionHouse = async ({ request }) => {
  const { error, value } = deleteAuctionHouseSchema.validate(request.body)

  if (error) {
    throw new Error(`Invalid Parameters: ${error.message}`)
  }

  return auctionHouseRepo.deleteAuctionHouse(value)
}

module.exports = {
  getAuctionHouses,
  addAuctionHouse,
  updateAuctionHouse,
  deleteAuctionHouse,
}
