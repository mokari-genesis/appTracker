import { MutationResponse } from './constants'
import { AuctionHouse } from './types'
import queryString from 'query-string'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/localhost/tracker'

export interface GetAuctionHousesParams {
  id?: number
}

export interface GetAuctionHousesResponse {
  auctionHouses: AuctionHouse[]
}

const fetchAuctionHouses = async (params: GetAuctionHousesParams = {}): Promise<GetAuctionHousesResponse> => {
  const queryParams = queryString.stringify(params)

  const response = await fetch(`${API_BASE_URL}/auction-houses?${queryParams}`)

  if (!response.ok) {
    throw new Error('Failed to fetch auction houses')
  }

  const result = await response.json()

  return result.data
}

const createAuctionHouse = async (
  auctionHouse: Omit<AuctionHouse, 'id' | 'isActive' | 'createdAt'>
): Promise<MutationResponse> => {
  const response = await fetch(`${API_BASE_URL}/auction-houses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(auctionHouse),
  })

  if (!response.ok) {
    throw new Error('Failed to create auction house')
  }

  const result = await response.json()

  return result.data
}

const updateAuctionHouse = async (
  auctionHouse: Omit<AuctionHouse, 'isActive' | 'createdAt'>
): Promise<MutationResponse> => {
  const response = await fetch(`${API_BASE_URL}/auction-houses`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(auctionHouse),
  })

  if (!response.ok) {
    throw new Error('Failed to update auction house')
  }

  const result = await response.json()

  return result.data
}

const deleteAuctionHouse = async (id: string): Promise<MutationResponse> => {
  const response = await fetch(`${API_BASE_URL}/auction-houses`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: parseInt(id) }),
  })

  if (!response.ok) {
    throw new Error('Failed to delete auction house')
  }

  const result = await response.json()

  return result.data
}

export { fetchAuctionHouses, createAuctionHouse, updateAuctionHouse, deleteAuctionHouse }
