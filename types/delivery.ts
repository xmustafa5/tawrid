// Delivery types

export interface DeliveryCreate {
  priority?: string
  pickup_address: string
  pickup_city?: string | null
  pickup_district?: string | null
  pickup_latitude?: number | string | null
  pickup_longitude?: number | string | null
  delivery_address: string
  delivery_city?: string | null
  delivery_district?: string | null
  delivery_latitude?: number | string | null
  delivery_longitude?: number | string | null
  estimated_distance_km?: number | string | null
  delivery_fee?: number | string
  estimated_pickup_time?: string | null
  estimated_delivery_time?: string | null
  special_instructions?: string | null
  order_id: string
  driver_id?: string | null
}

export interface DeliveryRead {
  id: string
  order_id: string
  driver_id?: string | null
  status: string
  priority: string
  pickup_address: string
  pickup_city?: string | null
  pickup_district?: string | null
  pickup_latitude?: string | null
  pickup_longitude?: string | null
  delivery_address: string
  delivery_city?: string | null
  delivery_district?: string | null
  delivery_latitude?: string | null
  delivery_longitude?: string | null
  estimated_distance_km?: string | null
  delivery_fee: string
  estimated_pickup_time?: string | null
  estimated_delivery_time?: string | null
  special_instructions?: string | null
  current_latitude?: string | null
  current_longitude?: string | null
  last_location_update?: string | null
  actual_distance_km?: string | null
  assigned_at?: string | null
  picked_up_at?: string | null
  in_transit_at?: string | null
  arrived_at?: string | null
  delivered_at?: string | null
  failed_at?: string | null
  cancelled_at?: string | null
  signature_url?: string | null
  recipient_name?: string | null
  recipient_phone?: string | null
  recipient_notes?: string | null
  failure_reason?: string | null
  cancellation_reason?: string | null
  driver_notes?: string | null
  created_at: string
  updated_at: string
  created_by_id?: string | null
  updated_by_id?: string | null
  is_assigned: boolean
  is_active: boolean
  is_completed: boolean
  is_in_progress: boolean
  can_be_cancelled: boolean
  is_delayed: boolean
}

export interface DeliveryList {
  id: string
  order_id: string
  driver_id?: string | null
  status: string
  priority: string
  delivery_address: string
  delivery_city?: string | null
  estimated_delivery_time?: string | null
  delivered_at?: string | null
  delivery_fee: string
  is_delayed: boolean
  created_at: string
}

export interface DeliveryAssignment {
  driver_id: string
  estimated_pickup_time?: string | null
  notes?: string | null
}

export interface DeliveryLocationUpdate {
  latitude: number | string
  longitude: number | string
}

export interface DeliveryProofOfDelivery {
  signature_url?: string | null
  photo_urls?: string[] | null
  recipient_name: string
  recipient_phone?: string | null
  recipient_notes?: string | null
}

export interface DeliveryFailure {
  failure_reason: string
  photo_urls?: string[] | null
}

export interface DeliveryCancellation {
  cancellation_reason: string
}

export interface DeliveryStatistics {
  total_deliveries: number
  pending_deliveries: number
  in_progress_deliveries: number
  completed_deliveries: number
  failed_deliveries: number
  cancelled_deliveries: number
  total_distance_km: string
  total_delivery_fees: string
  average_delivery_time_minutes?: number | null
  on_time_delivery_rate?: string | null
}

export interface DeliveryListParams {
  status?: string
  driver_id?: string
  priority?: string
  city?: string
  start_date?: string
  end_date?: string
  skip_count?: number
  max_count?: number
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}
