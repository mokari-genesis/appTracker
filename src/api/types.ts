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
  productId: string | null
  weight: number
  bagNumber: string | null
  numberOfPieces: number | null
  winner1ClientId: string | null
  winner2ClientId: string | null
  lot: string
  date: string
  highestBidRmb: number | null
  pricePerKg: number | null
  priceSold: number | null
  productName?: string | null
  winner1Name?: string | null
  winner2Name?: string | null
}
