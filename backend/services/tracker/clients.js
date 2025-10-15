const joi = require('joi')
const { clientRepo } = require('entityQueries/index')

const getClientsSchema = joi.object({
  page: joi.number().integer().min(0).required().default(0).failover(0),
  limit: joi.number().integer().min(1).allow(null),
  id: joi.number().integer().allow(null).optional(),
})
const getClients = async ({ request }) => {
  const { error, value } = getClientsSchema.validate(request.queryStringParameters || {})

  if (error) {
    throw new Error(`Invalid Parameters: ${error.message}`)
  }

  const nextPageLimit = value.limit + 1

  const result = await clientRepo.getClients({
    page: value.page * value.limit,
    limit: nextPageLimit,
    id: value.id,
  })

  const hasNextPage = result.length === nextPageLimit

  if (result.length === nextPageLimit) {
    result.pop()
  }

  return {
    clients: result,
    hasNextPage,
  }
}

const addClientSchema = joi.object({
  name: joi.string().min(1).max(200).required(),
  email: joi.string().email().optional().allow(null, ''),
  phone: joi.string().max(50).optional().allow(null, ''),
  company: joi.string().max(200).optional().allow(null, ''),
  address: joi.string().max(500).optional().allow(null, ''),
})
const addClient = async ({ request }) => {
  const { error, value } = addClientSchema.validate(request.body)

  if (error) {
    throw new Error(`Invalid Parameters: ${error.message}`)
  }

  return clientRepo.insertClient(value)
}

const updateClientSchema = joi.object({
  id: joi.number().integer().required(),
  name: joi.string().min(1).max(200).required(),
  email: joi.string().email().required(),
  phone: joi.string().max(50).optional().allow(null, ''),
  company: joi.string().max(200).optional().allow(null, ''),
  address: joi.string().max(500).optional().allow(null, ''),
})
const updateClient = async ({ request }) => {
  const { error, value } = updateClientSchema.validate(request.body)

  if (error) {
    throw new Error(`Invalid Parameters: ${error.message}`)
  }

  return clientRepo.updateClient(value)
}

const deleteClientSchema = joi.object({
  id: joi.number().integer().required(),
})
const deleteClient = async ({ request }) => {
  const { error, value } = deleteClientSchema.validate(request.body)

  if (error) {
    throw new Error(`Invalid Parameters: ${error.message}`)
  }

  return clientRepo.deleteClient(value)
}

module.exports = {
  getClients,
  addClient,
  updateClient,
  deleteClient,
}
