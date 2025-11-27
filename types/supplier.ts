// Supplier types

export interface SupplierCreate {
  company_name_ar: string
  company_name_en: string
  email: string
  phone_primary: string
  phone_secondary?: string | null
  website?: string | null
  address_line1: string
  address_line2?: string | null
  city: string
  district: string
  postal_code?: string | null
  latitude?: number | string | null
  longitude?: number | string | null
  product_categories?: string[] | null
  minimum_order_value?: number | string | null
  delivery_fee?: number | string | null
  free_delivery_threshold?: number | string | null
  trade_license?: string | null
  tax_id?: string | null
  description_ar?: string | null
  description_en?: string | null
  delivery_areas?: Record<string, string[]> | null
  operating_hours?: Record<string, Record<string, string>> | null
  accepts_cash?: boolean
  accepts_credit?: boolean
  allows_installments?: boolean
  payment_terms_days?: number
  auto_accept_orders?: boolean
  lead_time_hours?: number
}

export interface SupplierRead {
  id: string
  company_name_ar: string
  company_name_en: string
  email: string
  phone_primary: string
  phone_secondary?: string | null
  website?: string | null
  address_line1: string
  address_line2?: string | null
  city: string
  district: string
  postal_code?: string | null
  latitude?: string | null
  longitude?: string | null
  product_categories?: string[] | null
  minimum_order_value?: string | null
  delivery_fee?: string | null
  free_delivery_threshold?: string | null
  trade_license?: string | null
  tax_id?: string | null
  description_ar?: string | null
  description_en?: string | null
  delivery_areas?: Record<string, string[]> | null
  operating_hours?: Record<string, Record<string, string>> | null
  logo_url?: string | null
  cover_image_url?: string | null
  is_verified: boolean
  verification_status: string
  verified_at?: string | null
  accepts_cash: boolean
  accepts_credit: boolean
  allows_installments: boolean
  payment_terms_days: number
  average_rating?: string | null
  total_reviews: number
  total_orders_completed: number
  auto_accept_orders: boolean
  lead_time_hours: number
  is_active: boolean
  owner_id: string
  created_at: string
  updated_at: string
  created_by_id?: string | null
  updated_by_id?: string | null
}

export interface SupplierList {
  id: string
  company_name_ar: string
  company_name_en: string
  city: string
  district: string
  product_categories?: string[] | null
  is_verified: boolean
  average_rating?: string | null
  total_reviews: number
  is_active: boolean
  logo_url?: string | null
  minimum_order_value?: string | null
  delivery_fee?: string | null
}

export interface SupplierUpdate {
  company_name_ar?: string | null
  company_name_en?: string | null
  trade_license?: string | null
  tax_id?: string | null
  description_ar?: string | null
  description_en?: string | null
  email?: string | null
  phone_primary?: string | null
  phone_secondary?: string | null
  website?: string | null
  address_line1?: string | null
  address_line2?: string | null
  city?: string | null
  district?: string | null
  postal_code?: string | null
  latitude?: number | string | null
  longitude?: number | string | null
  product_categories?: string[] | null
  delivery_areas?: Record<string, string[]> | null
  minimum_order_value?: number | string | null
  delivery_fee?: number | string | null
  free_delivery_threshold?: number | string | null
  operating_hours?: Record<string, Record<string, string>> | null
  logo_url?: string | null
  cover_image_url?: string | null
  accepts_cash?: boolean | null
  accepts_credit?: boolean | null
  allows_installments?: boolean | null
  payment_terms_days?: number | null
  auto_accept_orders?: boolean | null
  lead_time_hours?: number | null
}

export interface SupplierVerification {
  verification_status: 'pending' | 'approved' | 'rejected'
  verification_notes?: string | null
}

export interface SupplierListParams {
  search?: string
  city?: string
  category?: string
  is_verified?: boolean
  min_rating?: number
  skip_count?: number
  max_count?: number
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

export interface SupplierNearbyParams {
  latitude: number
  longitude: number
  radius_km?: number
  category?: string
  skip_count?: number
  max_count?: number
}
