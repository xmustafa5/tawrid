// User management types

export interface UserCreate {
  email: string
  password: string
  full_name: string
  phone?: string | null
  is_active?: boolean
  is_superuser?: boolean
  role_ids?: string[]
}

export interface UserRead {
  id: string
  email: string
  full_name: string
  phone?: string | null
  is_active: boolean
  is_superuser: boolean
  created_at: string
  updated_at: string
  deleted_at?: string | null
  roles: UserRoleInfo[]
}

export interface UserRoleInfo {
  id: string
  code: string
  name: string
  priority: number
}

export interface UserList {
  id: string
  email: string
  full_name: string
  is_active: boolean
  is_superuser: boolean
  created_at: string
  role_names: string[]
}

export interface UserUpdate {
  full_name?: string | null
  phone?: string | null
  is_active?: boolean | null
}

export interface UserRoleAssignment {
  role_ids: string[]
}

export interface UserListParams {
  search?: string
  is_active?: boolean
  allow_deleted?: boolean
  skip_count?: number
  max_count?: number
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}
