export type Role = 'INVESTIGATOR' | 'ADMIN' | 'BILLING_AGENT'

export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}
