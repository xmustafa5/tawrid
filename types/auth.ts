// Authentication related types

export interface UserRegister {
  email: string
  password: string
  full_name: string
  phone?: string | null
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
  user: UserProfile
}

export interface Token {
  access_token: string
  refresh_token: string
  token_type: string
}

export interface RefreshTokenRequest {
  refresh_token: string
}

export interface UserProfile {
  id: string
  email: string
  full_name: string
  phone?: string | null
  is_active: boolean
  is_superuser: boolean
  created_at: string
  updated_at: string
  roles: RoleInfo[]
}

export interface RoleInfo {
  id: string
  code: string
  name: string
}

export interface UserUpdatePassword {
  current_password: string
  new_password: string
}
