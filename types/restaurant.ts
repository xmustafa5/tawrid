// Restaurant types

export interface RestaurantCreate {
  name_ar: string
  name_en: string
  email: string
  phone_primary: string
  phone_secondary?: string | null
  address_line1: string
  address_line2?: string | null
  city: string
  district: string
  postal_code?: string | null
  latitude?: number | string | null
  longitude?: number | string | null
  cuisine_types?: string[] | null
  description_ar?: string | null
  description_en?: string | null
  operating_hours?: Record<string, Record<string, string>> | null
  seating_capacity?: number | null
  has_delivery?: boolean
  has_takeout?: boolean
  has_dine_in?: boolean
}

export interface RestaurantRead {
  id: string
  name_ar: string
  name_en: string
  email: string
  phone_primary: string
  phone_secondary?: string | null
  address_line1: string
  address_line2?: string | null
  city: string
  district: string
  postal_code?: string | null
  latitude?: string | null
  longitude?: string | null
  cuisine_types?: string[] | null
  description_ar?: string | null
  description_en?: string | null
  operating_hours?: Record<string, Record<string, string>> | null
  logo_url?: string | null
  cover_image_url?: string | null
  seating_capacity?: number | null
  has_delivery: boolean
  has_takeout: boolean
  has_dine_in: boolean
  is_verified: boolean
  verification_status: string
  verified_at?: string | null
  average_rating?: string | null
  total_reviews: number
  is_active: boolean
  owner_id: string
  created_at: string
  updated_at: string
  created_by_id?: string | null
  updated_by_id?: string | null
}

export interface RestaurantList {
  id: string
  name_ar: string
  name_en: string
  city: string
  district: string
  cuisine_types?: string[] | null
  is_verified: boolean
  average_rating?: string | null
  total_reviews: number
  is_active: boolean
  logo_url?: string | null
  has_delivery: boolean
  has_takeout: boolean
  has_dine_in: boolean
}

export interface RestaurantUpdate {
  name_ar?: string | null
  name_en?: string | null
  description_ar?: string | null
  description_en?: string | null
  email?: string | null
  phone_primary?: string | null
  phone_secondary?: string | null
  address_line1?: string | null
  address_line2?: string | null
  city?: string | null
  district?: string | null
  postal_code?: string | null
  latitude?: number | string | null
  longitude?: number | string | null
  cuisine_types?: string[] | null
  operating_hours?: Record<string, Record<string, string>> | null
  logo_url?: string | null
  cover_image_url?: string | null
  seating_capacity?: number | null
  has_delivery?: boolean | null
  has_takeout?: boolean | null
  has_dine_in?: boolean | null
}

export interface RestaurantVerification {
  verification_status: 'pending' | 'approved' | 'rejected'
  verification_notes?: string | null
}

export interface RestaurantListParams {
  search?: string
  city?: string
  cuisine_type?: string
  is_verified?: boolean
  has_delivery?: boolean
  skip_count?: number
  max_count?: number
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

export interface NearbyParams {
  latitude: number
  longitude: number
  radius_km?: number
  skip_count?: number
  max_count?: number
}
