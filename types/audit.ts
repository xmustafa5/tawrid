// Audit Log types

export interface AuditLogList {
  id: string
  timestamp: string
  action: string
  status: string
  resource_type: string
  resource_id?: string | null
  user_email?: string | null
  ip_address?: string | null
}

export interface AuditLogRead {
  id: string
  timestamp: string
  action: string
  status: string
  resource_type: string
  resource_id?: string | null
  user_email?: string | null
  user_id?: string | null
  changes?: Record<string, unknown> | null
  error_message?: string | null
  request_id?: string | null
  ip_address?: string | null
  user_agent?: string | null
}

export interface AuditLogStats {
  total_logs: number
  status_counts: Record<string, number>
  action_counts: Record<string, number>
  resource_counts: Record<string, number>
  failed_logins: number
  unique_users: number
}

export interface AuditLogQueryParams {
  start_date?: string
  end_date?: string
  action?: string
  action_prefix?: string
  status?: string
  resource_type?: string
  resource_id?: string
  user_id?: string
  user_email?: string
  request_id?: string
  ip_address?: string
  skip_count?: number
  max_count?: number
}

export interface UserActivityParams {
  user_id: string
  start_date?: string
  end_date?: string
  skip_count?: number
  max_count?: number
}
