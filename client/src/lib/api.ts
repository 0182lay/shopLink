const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ?? 'http://localhost:4000'

export type ApiResponse<T> = {
  success: boolean
  data?: T
  message?: string
  service?: string
  status?: string
}

export type Product = {
  id: number
  storeId: number
  categoryId?: number | null
  name: string
  description?: string | null
  price: string | number
  stock: number
  imageUrl?: string | null
  isActive: boolean
}

async function request<T>(path: string): Promise<ApiResponse<T>> {
  const response = await fetch(`${API_BASE_URL}/api${path}`)
  const payload = (await response.json()) as ApiResponse<T>

  if (!response.ok || payload.success === false) {
    throw new Error(payload.message ?? `Request failed: ${response.status}`)
  }

  return payload
}

export const api = {
  baseUrl: API_BASE_URL,
  health: () => request<never>('/health'),
  products: () => request<Product[]>('/products'),
}
