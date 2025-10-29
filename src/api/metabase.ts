const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/localhost/tracker'

export interface MetabaseDashboardResponse {
  url: string
  expiresIn: number
}

export const fetchMetabaseDashboardUrl = async (): Promise<MetabaseDashboardResponse> => {
  const response = await fetch(`${API_BASE_URL}/metabase/dashboard-url`)

  if (!response.ok) {
    throw new Error('Failed to fetch Metabase dashboard URL')
  }

  const result = await response.json()

  return result.data
}
