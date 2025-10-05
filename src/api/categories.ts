import queryString from 'query-string'
import { Category } from './types'
import { MutationResponse } from './constants'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/localhost/tracker'

export interface GetCategoriesParams {
  page?: number
  limit?: number
  id?: number
}

export interface GetCategoriesResponse {
  categories: Category[]
  hasNextPage: boolean
}

const fetchCategories = async (params: GetCategoriesParams = {}): Promise<GetCategoriesResponse> => {
  const queryParams = queryString.stringify(params)

  const response = await fetch(`${API_BASE_URL}/categories?${queryParams}`)

  if (!response.ok) {
    throw new Error('Failed to fetch categories')
  }

  const result = await response.json()

  return result.data
}

const createCategory = async (category: Omit<Category, 'id' | 'createdAt'>): Promise<MutationResponse> => {
  const response = await fetch(`${API_BASE_URL}/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(category),
  })

  if (!response.ok) {
    throw new Error('Failed to create category')
  }

  const result = await response.json()

  return result.data
}

const updateCategory = async (category: Omit<Category, 'createdAt'>): Promise<MutationResponse> => {
  const response = await fetch(`${API_BASE_URL}/categories`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(category),
  })

  if (!response.ok) {
    throw new Error('Failed to update category')
  }

  const result = await response.json()

  return result.data
}

const deleteCategory = async (id: string): Promise<MutationResponse> => {
  const response = await fetch(`${API_BASE_URL}/categories`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: parseInt(id) }),
  })

  if (!response.ok) {
    throw new Error('Failed to delete category')
  }

  const result = await response.json()

  return result.data
}

export { fetchCategories, createCategory, updateCategory, deleteCategory }
