import queryString from 'query-string'
import { Product } from './types'
import { MutationResponse } from './constants'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/localhost/tracker'

export interface GetProductsParams {
  page?: number
  limit?: number
  id?: number
  categoryId?: number
}

export interface GetProductsResponse {
  products: Product[]
  hasNextPage: boolean
}

const fetchProducts = async (params: GetProductsParams = {}): Promise<GetProductsResponse> => {
  const queryParams = queryString.stringify(params)

  const response = await fetch(`${API_BASE_URL}/products?${queryParams}`)

  if (!response.ok) {
    throw new Error('Failed to fetch products')
  }

  const result = await response.json()

  return result.data
}

const createProduct = async (product: Omit<Product, 'id' | 'createdAt'>): Promise<MutationResponse> => {
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  })

  if (!response.ok) {
    throw new Error('Failed to create product')
  }

  const result = await response.json()

  return result.data
}

const updateProduct = async (product: Omit<Product, 'createdAt'>): Promise<MutationResponse> => {
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  })

  if (!response.ok) {
    throw new Error('Failed to update product')
  }

  const result = await response.json()

  return result.data
}

const deleteProduct = async (id: string): Promise<MutationResponse> => {
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: parseInt(id) }),
  })

  if (!response.ok) {
    throw new Error('Failed to delete product')
  }

  const result = await response.json()

  return result.data
}

export { fetchProducts, createProduct, updateProduct, deleteProduct }
