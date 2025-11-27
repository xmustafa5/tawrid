// Role and Permission types

export interface RoleCreate {
  code: string
  name: string
  description?: string | null
  priority?: number
  permission_ids?: string[]
}

export interface RoleRead {
  id: string
  code: string
  name: string
  description?: string | null
  priority: number
  created_at: string
  updated_at: string
  permissions: PermissionList[]
}

export interface RoleList {
  id: string
  code: string
  name: string
  priority: number
}

export interface RoleUpdate {
  name?: string | null
  description?: string | null
  priority?: number | null
}

export interface PermissionRead {
  id: string
  code: string
  name: string
  description?: string | null
  resource: string
  action: string
  created_at: string
}

export interface PermissionList {
  id: string
  code: string
  name: string
  resource: string
  action: string
}

export interface RoleListParams {
  search?: string
  skip_count?: number
  max_count?: number
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}
