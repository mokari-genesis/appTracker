const joi = require('joi')
const { auctionHeaderRepo, auctionDetailRepo } = require('entityQueries/index')

const getAuctionHeadersSchema = joi.object({
  page: joi.number().integer().min(0).required().default(0).failover(0),
  limit: joi.number().integer().min(1).allow(null).default(null),
  id: joi.number().integer().allow(null).optional(),
})
const getAuctionHeaders = async ({ request }) => {
  const { error, value } = getAuctionHeadersSchema.validate(
    request.queryStringParameters || {}
  )

  if (error) {
    throw new Error(`Invalid Parameters: ${error.message}`)
  }

  // If no limit is provided, return all results without pagination
  if (!value.limit) {
    const result = await auctionHeaderRepo.getAuctionHeaders({
      page: 0,
      limit: null,
      id: value.id,
    })

    return {
      auctionHeaders: result,
      hasNextPage: false,
    }
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
  auctionHouseId: joi.number().integer().required(),
  numberOfPeople: joi.number().integer().min(0).allow(null),
  date: joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
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
  auctionHouseId: joi.number().integer().required(),
  numberOfPeople: joi.number().integer().min(0).allow(null),
  date: joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
  exchangeRate: joi.number().min(0).allow(null),
})
const updateAuctionHeader = async ({ request }) => {
  const { error, value } = updateAuctionHeaderSchema.validate(request.body)

  if (error) {
    throw new Error(`Invalid Parameters: ${error.message}`)
  }

  // Get current auction header to check if exchange rate changed
  const currentHeaders = await auctionHeaderRepo.getAuctionHeaders({ id: value.id })
  const currentHeader = currentHeaders[0]

  // Update the auction header
  const result = await auctionHeaderRepo.updateAuctionHeader(value)

  // If exchange rate changed, recalculate all detail prices
  if (currentHeader && currentHeader.exchangeRate !== value.exchangeRate) {
    await auctionDetailRepo.recalculateAuctionDetailPrices({
      auctionId: value.id,
      exchangeRate: value.exchangeRate || 7.14,
    })
  }

  return result
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

const getAuctionMetrics = async () => {
  const data = await auctionHeaderRepo.getAuctionMetricsData({})

  if (!data || data.length === 0) {
    return {
      totalAuctions: 0,
      totalParticipants: 0,
      totalRevenueUsd: 0,
      totalRmb: 0,
      totalCommissionRmb: 0,
      totalCommissionUsd: 0,
    }
  }

  const uniqueAuctionIds = new Set()
  let totalParticipants = 0
  let totalRevenueUsd = 0
  let totalRmb = 0
  let totalCommissionRmb = 0
  let totalCommissionUsd = 0

  data.forEach(row => {
    // Count unique auctions and sum participants only once per auction
    if (!uniqueAuctionIds.has(row.id)) {
      uniqueAuctionIds.add(row.id)
      totalParticipants += Number(row.numberOfPeople) || 0
    }

    // Only process sold details
    // Verify that detail_id exists and isSold is truthy (1, true, "1")
    if (row.detailId && (row.isSold === 1 || row.isSold === true || row.isSold === '1')) {
      const priceSold = Number(row.priceSold) || 0
      const highestBidRmb = Number(row.highestBidRmb) || 0
      const exchangeRate = Number(row.exchangeRate) || 7.14
      const commissionRate = Number(row.commissionRate) || 0.02

      totalRevenueUsd += priceSold
      totalRmb += highestBidRmb

      // Calculate commission based on auction house commission rate
      const commissionRmb = highestBidRmb * commissionRate
      const commissionUsd = commissionRmb / exchangeRate

      totalCommissionRmb += commissionRmb
      totalCommissionUsd += commissionUsd
    }
  })

  return {
    totalAuctions: uniqueAuctionIds.size,
    totalParticipants,
    totalRevenueUsd,
    totalRmb,
    totalCommissionRmb,
    totalCommissionUsd,
  }
}

module.exports = {
  getAuctionHeaders,
  getNextAuctionHeaderId,
  addAuctionHeader,
  updateAuctionHeader,
  closeAuctionHeader,
  reopenAuctionHeader,
  deleteAuctionHeader,
  getAuctionMetrics,
}
