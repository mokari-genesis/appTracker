import queryString from 'query-string'
import { AuctionHeader, AuctionDetail } from './types'
import { MutationResponse } from './constants'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/localhost/tracker'

// Auction Headers
export interface GetAuctionHeadersParams {
  page?: number
  limit?: number
  id?: number
}

export interface GetAuctionHeadersResponse {
  auctionHeaders: AuctionHeader[]
  hasNextPage: boolean
}

const fetchAuctionHeaders = async (params: GetAuctionHeadersParams = {}): Promise<GetAuctionHeadersResponse> => {
  const queryParams = queryString.stringify(params)

  const response = await fetch(`${API_BASE_URL}/auction-headers?${queryParams}`)

  if (!response.ok) {
    throw new Error('Failed to fetch auction headers')
  }

  const result = await response.json()

  return result.data || []
}

const createAuctionHeader = async (
  auctionHeader: Omit<AuctionHeader, 'id' | 'createdAt' | 'isClosed' | 'closedAt'>
): Promise<MutationResponse> => {
  const response = await fetch(`${API_BASE_URL}/auction-headers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(auctionHeader),
  })

  if (!response.ok) {
    throw new Error('Failed to create auction header')
  }

  const result = await response.json()

  return result.data
}

const updateAuctionHeader = async (
  auctionHeader: Omit<AuctionHeader, 'createdAt' | 'isClosed' | 'closedAt'>
): Promise<MutationResponse> => {
  const response = await fetch(`${API_BASE_URL}/auction-headers`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(auctionHeader),
  })

  if (!response.ok) {
    throw new Error('Failed to update auction header')
  }

  const result = await response.json()

  return result.data
}

const closeAuctionHeader = async (id: string): Promise<MutationResponse> => {
  const response = await fetch(`${API_BASE_URL}/auction-headers/close`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: parseInt(id) }),
  })

  if (!response.ok) {
    throw new Error('Failed to close auction header')
  }

  const result = await response.json()

  return result.data
}

const reopenAuctionHeader = async (id: string): Promise<MutationResponse> => {
  const response = await fetch(`${API_BASE_URL}/auction-headers/reopen`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: parseInt(id) }),
  })

  if (!response.ok) {
    throw new Error('Failed to reopen auction header')
  }

  const result = await response.json()

  return result.data
}

const deleteAuctionHeader = async (id: string): Promise<MutationResponse> => {
  const response = await fetch(`${API_BASE_URL}/auction-headers`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: parseInt(id) }),
  })

  if (!response.ok) {
    throw new Error('Failed to delete auction header')
  }

  const result = await response.json()

  return result.data
}

// Auction Details
export interface GetAuctionDetailsParams {
  page?: number
  limit?: number
  id?: number
  auctionId?: number
}

export interface GetAuctionDetailsResponse {
  auctionDetails: AuctionDetail[]
  hasNextPage: boolean
}

const fetchAuctionDetails = async (params: GetAuctionDetailsParams = {}): Promise<GetAuctionDetailsResponse> => {
  const queryParams = queryString.stringify(params)

  const response = await fetch(`${API_BASE_URL}/auction-details?${queryParams}`)

  if (!response.ok) {
    throw new Error('Failed to fetch auction details')
  }

  const result = await response.json()

  return result.data || []
}

const createAuctionDetail = async (auctionDetail: Omit<AuctionDetail, 'id' | 'isSold'>): Promise<MutationResponse> => {
  const response = await fetch(`${API_BASE_URL}/auction-details`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(auctionDetail),
  })

  if (!response.ok) {
    throw new Error('Failed to create auction detail')
  }

  const result = await response.json()

  return result.data
}

const updateAuctionDetail = async (auctionDetail: Omit<AuctionDetail, 'isSold'>): Promise<MutationResponse> => {
  const response = await fetch(`${API_BASE_URL}/auction-details`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(auctionDetail),
  })

  if (!response.ok) {
    throw new Error('Failed to update auction detail')
  }

  const result = await response.json()

  return result.data
}

const deleteAuctionDetail = async (id: string): Promise<MutationResponse> => {
  const response = await fetch(`${API_BASE_URL}/auction-details`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: parseInt(id) }),
  })

  if (!response.ok) {
    throw new Error('Failed to delete auction detail')
  }

  const result = await response.json()

  return result.data
}

const toggleAuctionDetailSold = async (id: string, isSold: boolean): Promise<MutationResponse> => {
  const response = await fetch(`${API_BASE_URL}/auction-details/toggle-sold`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: parseInt(id), isSold }),
  })

  if (!response.ok) {
    throw new Error('Failed to toggle auction detail sold status')
  }

  const result = await response.json()

  return result.data
}

export {
  fetchAuctionHeaders,
  createAuctionHeader,
  updateAuctionHeader,
  closeAuctionHeader,
  reopenAuctionHeader,
  deleteAuctionHeader,
  fetchAuctionDetails,
  createAuctionDetail,
  updateAuctionDetail,
  deleteAuctionDetail,
  toggleAuctionDetailSold,
}
