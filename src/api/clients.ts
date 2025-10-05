import { MutationResponse } from './constants'
import { Client } from './types'
import queryString from 'query-string'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/localhost/tracker'

export interface GetClientsParams {
  page?: number
  limit?: number
  id?: number
}

export interface GetClientsResponse {
  clients: Client[]
  hasNextPage: boolean
}

const fetchClients = async (params: GetClientsParams = {}): Promise<GetClientsResponse> => {
  const queryParams = queryString.stringify(params)

  const response = await fetch(`${API_BASE_URL}/clients?${queryParams}`)

  if (!response.ok) {
    throw new Error('Failed to fetch clients')
  }

  const result = await response.json()

  return result.data
}

const createClient = async (client: Omit<Client, 'id' | 'createdAt'>): Promise<MutationResponse> => {
  const response = await fetch(`${API_BASE_URL}/clients`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(client),
  })

  if (!response.ok) {
    throw new Error('Failed to create client')
  }

  const result = await response.json()

  return result.data
}

const updateClient = async (client: Omit<Client, 'createdAt'>): Promise<MutationResponse> => {
  const response = await fetch(`${API_BASE_URL}/clients`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(client),
  })

  if (!response.ok) {
    throw new Error('Failed to update client')
  }

  const result = await response.json()

  return result.data
}

const deleteClient = async (id: string): Promise<MutationResponse> => {
  const response = await fetch(`${API_BASE_URL}/clients`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: parseInt(id) }),
  })

  if (!response.ok) {
    throw new Error('Failed to delete client')
  }

  const result = await response.json()

  return result.data
}

export { fetchClients, createClient, updateClient, deleteClient }
