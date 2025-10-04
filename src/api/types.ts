export interface Client {
  id: string
  name: string
  email: string
  phone: string | null
  company: string | null
  address: string | null
  createdAt: string
}

export interface Category {
  id: string
  name: string
  description: string | null
  createdAt: string
}

export interface Product {
  id: string
  name: string
  description: string | null
  categoryId: string
  sku: string
  basePrice: number | null
  createdAt: string
}

export interface AuctionHeader {
  id: string
  name: string
  numberOfPeople: number | null
  date: string
  exchangeRate: number | null // Yuan to USD
  createdAt: string
}

export interface AuctionDetail {
  id: string
  auctionId: string
  type: string
  weight: number
  bagNumber: string | null
  numberOfPieces: number | null
  winner1: string | null
  winner2: string | null
  lot: string
  date: string
  highestBidRmb: number | null
  pricePerKg: number | null
  priceSold: number | null
}
