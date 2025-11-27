// Common types used across the API

export interface HealthResponse {
  status: string
  database: string
  timestamp: string
}

export interface MessageResponse {
  message: string
}

export interface HTTPValidationError {
  detail?: ValidationError[]
}

export interface ValidationError {
  loc: (string | number)[]
  msg: string
  type: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  skip_count: number
  max_count: number
  has_more: boolean
}

// Pagination query parameters
export interface PaginationParams {
  skip_count?: number
  max_count?: number
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}
