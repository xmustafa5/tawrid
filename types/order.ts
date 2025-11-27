// Order types

export interface OrderItemCreate {
  product_id: string
  quantity: number | string
  notes?: string | null
}

export interface OrderCreate {
  restaurant_id: string
  supplier_id: string
  notes?: string | null
  special_instructions?: string | null
  delivery_address?: Record<string, unknown> | null
  delivery_date?: string | null
  items: OrderItemCreate[]
}

export interface OrderItemRead {
  id: string
  order_id: string
  product_id: string
  product_name_ar: string
  product_name_en: string
  product_sku: string
  unit_price: string
  unit_of_measure: string
  quantity: string
  discount_percentage: string
  tax_rate: string
  notes?: string | null
  line_subtotal: string
  discount_amount: string
  line_total_before_tax: string
  tax_amount: string
  line_total: string
  created_at: string
  updated_at: string
}

export interface OrderRead {
  id: string
  order_number: string
  restaurant_id: string
  supplier_id: string
  status: string
  notes?: string | null
  internal_notes?: string | null
  special_instructions?: string | null
  subtotal: string
  tax_amount: string
  delivery_fee: string
  discount_amount: string
  total_amount: string
  currency: string
  payment_status: string
  payment_method?: string | null
  paid_amount: string
  payment_due_date?: string | null
  delivery_address?: Record<string, unknown> | null
  delivery_date?: string | null
  delivered_at?: string | null
  delivery_notes?: string | null
  submitted_at?: string | null
  confirmed_at?: string | null
  confirmed_by_id?: string | null
  rejected_at?: string | null
  rejection_reason?: string | null
  cancelled_at?: string | null
  cancellation_reason?: string | null
  is_editable: boolean
  is_cancellable: boolean
  is_completed: boolean
  outstanding_amount: string
  items: OrderItemRead[]
  created_at: string
  updated_at: string
  created_by_id?: string | null
}

export interface OrderList {
  id: string
  order_number: string
  restaurant_id: string
  supplier_id: string
  status: string
  payment_status: string
  total_amount: string
  currency: string
  outstanding_amount: string
  submitted_at?: string | null
  delivery_date?: string | null
  created_at: string
  is_editable: boolean
  is_cancellable: boolean
  is_completed: boolean
}

export interface OrderUpdate {
  notes?: string | null
  special_instructions?: string | null
  delivery_address?: Record<string, unknown> | null
  delivery_date?: string | null
  delivery_fee?: number | string | null
  discount_amount?: number | string | null
}

export interface OrderStatusUpdate {
  status: 'pending' | 'confirmed' | 'processing' | 'ready_for_delivery' | 'in_transit' | 'delivered' | 'cancelled' | 'rejected'
  notes?: string | null
}

export interface OrderConfirmation {
  delivery_date?: string | null
  notes?: string | null
}

export interface OrderRejection {
  reason: string
}

export interface OrderCancellation {
  reason: string
}

export interface OrderPaymentUpdate {
  payment_method: string
  payment_amount: number | string
  payment_notes?: string | null
}

export interface OrderStatistics {
  total_orders: number
  pending_orders: number
  confirmed_orders: number
  completed_orders: number
  cancelled_orders: number
  total_revenue: string
  average_order_value: string
}

export interface OrderListParams {
  restaurant_id?: string
  supplier_id?: string
  status?: string
  payment_status?: string
  start_date?: string
  end_date?: string
  skip_count?: number
  max_count?: number
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}
