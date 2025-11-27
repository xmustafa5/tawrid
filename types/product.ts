// Product types

export interface ProductCreate {
  sku: string
  barcode?: string | null
  name_ar: string
  name_en: string
  description_ar?: string | null
  description_en?: string | null
  category: string
  subcategory?: string | null
  tags?: string[] | null
  unit_price: number | string
  currency?: string
  tax_rate?: number | string
  discount_percentage?: number | string
  stock_quantity?: number | string
  reorder_level?: number | string
  unit_of_measure: string
  minimum_order_quantity?: number | string
  brand?: string | null
  manufacturer?: string | null
  origin_country?: string | null
  shelf_life_days?: number | null
  storage_instructions?: string | null
  image_urls?: string[] | null
  primary_image_url?: string | null
  search_keywords?: string[] | null
  supplier_id: string
}

export interface ProductRead {
  id: string
  sku: string
  barcode?: string | null
  name_ar: string
  name_en: string
  description_ar?: string | null
  description_en?: string | null
  category: string
  subcategory?: string | null
  tags?: string[] | null
  unit_price: string
  currency: string
  tax_rate: string
  discount_percentage: string
  stock_quantity: string
  reorder_level: string
  unit_of_measure: string
  minimum_order_quantity: string
  brand?: string | null
  manufacturer?: string | null
  origin_country?: string | null
  shelf_life_days?: number | null
  storage_instructions?: string | null
  image_urls?: string[] | null
  primary_image_url?: string | null
  search_keywords?: string[] | null
  supplier_id: string
  is_active: boolean
  is_featured: boolean
  availability_status: string
  final_price: string
  price_with_tax: string
  is_low_stock: boolean
  is_in_stock: boolean
  created_at: string
  updated_at: string
}

export interface ProductList {
  id: string
  sku: string
  name_ar: string
  name_en: string
  category: string
  subcategory?: string | null
  unit_price: string
  currency: string
  discount_percentage: string
  final_price: string
  stock_quantity: string
  unit_of_measure: string
  supplier_id: string
  primary_image_url?: string | null
  is_active: boolean
  is_featured: boolean
  availability_status: string
  is_in_stock: boolean
}

export interface ProductUpdate {
  sku?: string | null
  barcode?: string | null
  name_ar?: string | null
  name_en?: string | null
  description_ar?: string | null
  description_en?: string | null
  category?: string | null
  subcategory?: string | null
  tags?: string[] | null
  unit_price?: number | string | null
  currency?: string | null
  tax_rate?: number | string | null
  discount_percentage?: number | string | null
  stock_quantity?: number | string | null
  reorder_level?: number | string | null
  unit_of_measure?: string | null
  minimum_order_quantity?: number | string | null
  brand?: string | null
  manufacturer?: string | null
  origin_country?: string | null
  shelf_life_days?: number | null
  storage_instructions?: string | null
  image_urls?: string[] | null
  primary_image_url?: string | null
  is_active?: boolean | null
  is_featured?: boolean | null
  availability_status?: 'in_stock' | 'out_of_stock' | 'discontinued' | null
  search_keywords?: string[] | null
}

export interface ProductStockUpdate {
  stock_quantity: number | string
  notes?: string | null
}

export interface ProductBulkPriceUpdate {
  product_ids: string[]
  discount_percentage: number | string
}

export interface ProductListParams {
  search?: string
  supplier_id?: string
  category?: string
  subcategory?: string
  min_price?: number
  max_price?: number
  is_active?: boolean
  is_featured?: boolean
  is_in_stock?: boolean
  skip_count?: number
  max_count?: number
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}
