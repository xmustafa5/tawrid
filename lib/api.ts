import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import type {
  // Common
  HealthResponse,
  MessageResponse,
  PaginatedResponse,
  // Auth
  UserRegister,
  LoginRequest,
  LoginResponse,
  Token,
  RefreshTokenRequest,
  UserProfile,
  UserUpdatePassword,
  // User
  UserCreate,
  UserRead,
  UserList,
  UserUpdate,
  UserRoleAssignment,
  UserListParams,
  // Role
  RoleCreate,
  RoleRead,
  RoleList,
  RoleUpdate,
  PermissionRead,
  RoleListParams,
  // Restaurant
  RestaurantCreate,
  RestaurantRead,
  RestaurantList,
  RestaurantUpdate,
  RestaurantVerification,
  RestaurantListParams,
  NearbyParams,
  // Supplier
  SupplierCreate,
  SupplierRead,
  SupplierList,
  SupplierUpdate,
  SupplierVerification,
  SupplierListParams,
  SupplierNearbyParams,
  // Product
  ProductCreate,
  ProductRead,
  ProductList,
  ProductUpdate,
  ProductStockUpdate,
  ProductBulkPriceUpdate,
  ProductListParams,
  // Order
  OrderCreate,
  OrderRead,
  OrderList,
  OrderUpdate,
  OrderStatusUpdate,
  OrderConfirmation,
  OrderRejection,
  OrderCancellation,
  OrderPaymentUpdate,
  OrderStatistics,
  OrderListParams,
  // Delivery
  DeliveryCreate,
  DeliveryRead,
  DeliveryList,
  DeliveryAssignment,
  DeliveryLocationUpdate,
  DeliveryProofOfDelivery,
  DeliveryFailure,
  DeliveryCancellation,
  DeliveryStatistics,
  DeliveryListParams,
  // Audit
  AuditLogRead,
  AuditLogList,
  AuditLogStats,
  AuditLogQueryParams,
  UserActivityParams,
} from '@/types'

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://fastapi-sqlmodel-starter-v1-production.up.railway.app'

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Token storage keys
const ACCESS_TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'

// Cookie helper functions
const setCookie = (name: string, value: string, days: number = 7): void => {
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString()
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`
}

const deleteCookie = (name: string): void => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
}

// Token management utilities
export const tokenStorage = {
  getAccessToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(ACCESS_TOKEN_KEY)
    }
    return null
  },
  getRefreshToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(REFRESH_TOKEN_KEY)
    }
    return null
  },
  setTokens: (accessToken: string, refreshToken: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
      // Also set cookies for middleware
      setCookie(ACCESS_TOKEN_KEY, accessToken)
      setCookie(REFRESH_TOKEN_KEY, refreshToken)
    }
  },
  clearTokens: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(ACCESS_TOKEN_KEY)
      localStorage.removeItem(REFRESH_TOKEN_KEY)
      // Also clear cookies
      deleteCookie(ACCESS_TOKEN_KEY)
      deleteCookie(REFRESH_TOKEN_KEY)
    }
  },
}

// Request interceptor to add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenStorage.getAccessToken()
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const refreshToken = tokenStorage.getRefreshToken()
      if (refreshToken) {
        try {
          const { data } = await axios.post<Token>(
            `${API_BASE_URL}/api/v1/auth/refresh`,
            { refresh_token: refreshToken }
          )
          tokenStorage.setTokens(data.access_token, data.refresh_token)

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${data.access_token}`
          }
          return api(originalRequest)
        } catch {
          tokenStorage.clearTokens()
          if (typeof window !== 'undefined') {
            window.location.href = '/login'
          }
        }
      }
    }

    return Promise.reject(error)
  }
)

// ============================================
// Health API
// ============================================
export const healthApi = {
  check: async (): Promise<HealthResponse> => {
    const { data } = await api.get<HealthResponse>('/health')
    return data
  },
}

// ============================================
// Authentication API
// ============================================
export const authApi = {
  register: async (userData: UserRegister): Promise<UserProfile> => {
    const { data } = await api.post<UserProfile>('/auth/register', userData)
    return data
  },

  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const { data } = await api.post<LoginResponse>('/auth/login', credentials)
    tokenStorage.setTokens(data.access_token, data.refresh_token)
    return data
  },

  refresh: async (refreshToken: string): Promise<Token> => {
    const { data } = await api.post<Token>('/auth/refresh', {
      refresh_token: refreshToken,
    } as RefreshTokenRequest)
    tokenStorage.setTokens(data.access_token, data.refresh_token)
    return data
  },

  getProfile: async (): Promise<UserProfile> => {
    const { data } = await api.get<UserProfile>('/auth/me')
    return data
  },

  changePassword: async (passwordData: UserUpdatePassword): Promise<MessageResponse> => {
    const { data } = await api.put<MessageResponse>('/auth/me/password', passwordData)
    return data
  },

  logout: async (): Promise<MessageResponse> => {
    const { data } = await api.post<MessageResponse>('/auth/logout')
    tokenStorage.clearTokens()
    return data
  },
}

// ============================================
// Users API
// ============================================
export const usersApi = {
  create: async (userData: UserCreate): Promise<UserRead> => {
    const { data } = await api.post<UserRead>('/users', userData)
    return data
  },

  getAll: async (params?: UserListParams): Promise<PaginatedResponse<UserList>> => {
    const { data } = await api.get<PaginatedResponse<UserList>>('/users', { params })
    return data
  },

  getById: async (userId: string): Promise<UserRead> => {
    const { data } = await api.get<UserRead>(`/users/${userId}`)
    return data
  },

  update: async (userId: string, userData: UserUpdate): Promise<UserRead> => {
    const { data } = await api.put<UserRead>(`/users/${userId}`, userData)
    return data
  },

  delete: async (userId: string): Promise<MessageResponse> => {
    const { data } = await api.delete<MessageResponse>(`/users/${userId}`)
    return data
  },

  restore: async (userId: string): Promise<UserRead> => {
    const { data } = await api.post<UserRead>(`/users/${userId}/restore`)
    return data
  },

  assignRoles: async (userId: string, roleAssignment: UserRoleAssignment): Promise<UserRead> => {
    const { data } = await api.post<UserRead>(`/users/${userId}/roles`, roleAssignment)
    return data
  },
}

// ============================================
// Roles & Permissions API
// ============================================
export const rolesApi = {
  create: async (roleData: RoleCreate): Promise<RoleRead> => {
    const { data } = await api.post<RoleRead>('/roles', roleData)
    return data
  },

  getAll: async (params?: RoleListParams): Promise<PaginatedResponse<RoleList>> => {
    const { data } = await api.get<PaginatedResponse<RoleList>>('/roles', { params })
    return data
  },

  getById: async (roleId: string): Promise<RoleRead> => {
    const { data } = await api.get<RoleRead>(`/roles/${roleId}`)
    return data
  },

  update: async (roleId: string, roleData: RoleUpdate): Promise<RoleRead> => {
    const { data } = await api.put<RoleRead>(`/roles/${roleId}`, roleData)
    return data
  },

  delete: async (roleId: string): Promise<MessageResponse> => {
    const { data } = await api.delete<MessageResponse>(`/roles/${roleId}`)
    return data
  },

  restore: async (roleId: string): Promise<RoleRead> => {
    const { data } = await api.post<RoleRead>(`/roles/${roleId}/restore`)
    return data
  },

  getPermissions: async (roleId: string): Promise<PermissionRead[]> => {
    const { data } = await api.get<PermissionRead[]>(`/roles/${roleId}/permissions`)
    return data
  },

  addPermission: async (roleId: string, permissionId: string): Promise<RoleRead> => {
    const { data } = await api.post<RoleRead>(`/roles/${roleId}/permissions/${permissionId}`)
    return data
  },

  removePermission: async (roleId: string, permissionId: string): Promise<RoleRead> => {
    const { data } = await api.delete<RoleRead>(`/roles/${roleId}/permissions/${permissionId}`)
    return data
  },

  getAllPermissions: async (): Promise<PermissionRead[]> => {
    const { data } = await api.get<PermissionRead[]>('/roles/permissions/all')
    return data
  },
}

// ============================================
// Restaurants API
// ============================================
export const restaurantsApi = {
  create: async (restaurantData: RestaurantCreate): Promise<RestaurantRead> => {
    const { data } = await api.post<RestaurantRead>('/restaurants', restaurantData)
    return data
  },

  getAll: async (params?: RestaurantListParams): Promise<PaginatedResponse<RestaurantList>> => {
    const { data } = await api.get<PaginatedResponse<RestaurantList>>('/restaurants', { params })
    return data
  },

  getMyRestaurant: async (): Promise<RestaurantRead> => {
    const { data } = await api.get<RestaurantRead>('/restaurants/me')
    return data
  },

  getById: async (restaurantId: string): Promise<RestaurantRead> => {
    const { data } = await api.get<RestaurantRead>(`/restaurants/${restaurantId}`)
    return data
  },

  update: async (restaurantId: string, restaurantData: RestaurantUpdate): Promise<RestaurantRead> => {
    const { data } = await api.put<RestaurantRead>(`/restaurants/${restaurantId}`, restaurantData)
    return data
  },

  getByCity: async (city: string, params?: RestaurantListParams): Promise<PaginatedResponse<RestaurantList>> => {
    const { data } = await api.get<PaginatedResponse<RestaurantList>>(`/restaurants/city/${city}`, { params })
    return data
  },

  getNearby: async (params: NearbyParams): Promise<PaginatedResponse<RestaurantList>> => {
    const { data } = await api.get<PaginatedResponse<RestaurantList>>('/restaurants/nearby', { params })
    return data
  },

  verify: async (restaurantId: string, verification: RestaurantVerification): Promise<RestaurantRead> => {
    const { data } = await api.put<RestaurantRead>(`/restaurants/${restaurantId}/verify`, verification)
    return data
  },

  getPendingVerification: async (params?: RestaurantListParams): Promise<PaginatedResponse<RestaurantList>> => {
    const { data } = await api.get<PaginatedResponse<RestaurantList>>('/restaurants/pending/verification', { params })
    return data
  },
}

// ============================================
// Suppliers API
// ============================================
export const suppliersApi = {
  create: async (supplierData: SupplierCreate): Promise<SupplierRead> => {
    const { data } = await api.post<SupplierRead>('/suppliers', supplierData)
    return data
  },

  getAll: async (params?: SupplierListParams): Promise<PaginatedResponse<SupplierList>> => {
    const { data } = await api.get<PaginatedResponse<SupplierList>>('/suppliers', { params })
    return data
  },

  getMySupplier: async (): Promise<SupplierRead> => {
    const { data } = await api.get<SupplierRead>('/suppliers/me')
    return data
  },

  getById: async (supplierId: string): Promise<SupplierRead> => {
    const { data } = await api.get<SupplierRead>(`/suppliers/${supplierId}`)
    return data
  },

  update: async (supplierId: string, supplierData: SupplierUpdate): Promise<SupplierRead> => {
    const { data } = await api.put<SupplierRead>(`/suppliers/${supplierId}`, supplierData)
    return data
  },

  getByCity: async (city: string, params?: SupplierListParams): Promise<PaginatedResponse<SupplierList>> => {
    const { data } = await api.get<PaginatedResponse<SupplierList>>(`/suppliers/city/${city}`, { params })
    return data
  },

  getTopRated: async (params?: SupplierListParams): Promise<PaginatedResponse<SupplierList>> => {
    const { data } = await api.get<PaginatedResponse<SupplierList>>('/suppliers/top-rated', { params })
    return data
  },

  getNearby: async (params: SupplierNearbyParams): Promise<PaginatedResponse<SupplierList>> => {
    const { data } = await api.get<PaginatedResponse<SupplierList>>('/suppliers/nearby', { params })
    return data
  },

  getByDeliveryArea: async (city: string, params?: SupplierListParams): Promise<PaginatedResponse<SupplierList>> => {
    const { data } = await api.get<PaginatedResponse<SupplierList>>(`/suppliers/delivery-area/${city}`, { params })
    return data
  },

  verify: async (supplierId: string, verification: SupplierVerification): Promise<SupplierRead> => {
    const { data } = await api.put<SupplierRead>(`/suppliers/${supplierId}/verify`, verification)
    return data
  },

  getPendingVerification: async (params?: SupplierListParams): Promise<PaginatedResponse<SupplierList>> => {
    const { data } = await api.get<PaginatedResponse<SupplierList>>('/suppliers/pending/verification', { params })
    return data
  },

  toggleActive: async (supplierId: string): Promise<SupplierRead> => {
    const { data } = await api.post<SupplierRead>(`/suppliers/${supplierId}/toggle-active`)
    return data
  },
}

// ============================================
// Products API
// ============================================
export const productsApi = {
  create: async (productData: ProductCreate): Promise<ProductRead> => {
    const { data } = await api.post<ProductRead>('/products', productData)
    return data
  },

  getAll: async (params?: ProductListParams): Promise<PaginatedResponse<ProductList>> => {
    const { data } = await api.get<PaginatedResponse<ProductList>>('/products', { params })
    return data
  },

  getById: async (productId: string): Promise<ProductRead> => {
    const { data } = await api.get<ProductRead>(`/products/${productId}`)
    return data
  },

  update: async (productId: string, productData: ProductUpdate): Promise<ProductRead> => {
    const { data } = await api.put<ProductRead>(`/products/${productId}`, productData)
    return data
  },

  delete: async (productId: string): Promise<MessageResponse> => {
    const { data } = await api.delete<MessageResponse>(`/products/${productId}`)
    return data
  },

  getBySupplier: async (supplierId: string, params?: ProductListParams): Promise<PaginatedResponse<ProductList>> => {
    const { data } = await api.get<PaginatedResponse<ProductList>>(`/products/supplier/${supplierId}`, { params })
    return data
  },

  getByCategory: async (category: string, params?: ProductListParams): Promise<PaginatedResponse<ProductList>> => {
    const { data } = await api.get<PaginatedResponse<ProductList>>(`/products/category/${category}`, { params })
    return data
  },

  getFeatured: async (params?: ProductListParams): Promise<PaginatedResponse<ProductList>> => {
    const { data } = await api.get<PaginatedResponse<ProductList>>('/products/featured', { params })
    return data
  },

  getLowStock: async (params?: ProductListParams): Promise<PaginatedResponse<ProductList>> => {
    const { data } = await api.get<PaginatedResponse<ProductList>>('/products/low-stock', { params })
    return data
  },

  getBySku: async (sku: string): Promise<ProductRead> => {
    const { data } = await api.get<ProductRead>(`/products/sku/${sku}`)
    return data
  },

  updateStock: async (productId: string, stockData: ProductStockUpdate): Promise<ProductRead> => {
    const { data } = await api.put<ProductRead>(`/products/${productId}/stock`, stockData)
    return data
  },

  toggleActive: async (productId: string): Promise<ProductRead> => {
    const { data } = await api.post<ProductRead>(`/products/${productId}/toggle-active`)
    return data
  },

  bulkUpdateDiscount: async (bulkData: ProductBulkPriceUpdate): Promise<MessageResponse> => {
    const { data } = await api.post<MessageResponse>('/products/bulk/update-discount', bulkData)
    return data
  },
}

// ============================================
// Orders API
// ============================================
export const ordersApi = {
  create: async (orderData: OrderCreate): Promise<OrderRead> => {
    const { data } = await api.post<OrderRead>('/orders', orderData)
    return data
  },

  getAll: async (params?: OrderListParams): Promise<PaginatedResponse<OrderList>> => {
    const { data } = await api.get<PaginatedResponse<OrderList>>('/orders', { params })
    return data
  },

  getById: async (orderId: string): Promise<OrderRead> => {
    const { data } = await api.get<OrderRead>(`/orders/${orderId}`)
    return data
  },

  update: async (orderId: string, orderData: OrderUpdate): Promise<OrderRead> => {
    const { data } = await api.put<OrderRead>(`/orders/${orderId}`, orderData)
    return data
  },

  delete: async (orderId: string): Promise<MessageResponse> => {
    const { data } = await api.delete<MessageResponse>(`/orders/${orderId}`)
    return data
  },

  getPending: async (params?: OrderListParams): Promise<PaginatedResponse<OrderList>> => {
    const { data } = await api.get<PaginatedResponse<OrderList>>('/orders/pending', { params })
    return data
  },

  getStatistics: async (params?: { start_date?: string; end_date?: string }): Promise<OrderStatistics> => {
    const { data } = await api.get<OrderStatistics>('/orders/statistics', { params })
    return data
  },

  submit: async (orderId: string): Promise<OrderRead> => {
    const { data } = await api.post<OrderRead>(`/orders/${orderId}/submit`)
    return data
  },

  confirm: async (orderId: string, confirmation?: OrderConfirmation): Promise<OrderRead> => {
    const { data } = await api.post<OrderRead>(`/orders/${orderId}/confirm`, confirmation)
    return data
  },

  reject: async (orderId: string, rejection: OrderRejection): Promise<OrderRead> => {
    const { data } = await api.post<OrderRead>(`/orders/${orderId}/reject`, rejection)
    return data
  },

  cancel: async (orderId: string, cancellation: OrderCancellation): Promise<OrderRead> => {
    const { data } = await api.post<OrderRead>(`/orders/${orderId}/cancel`, cancellation)
    return data
  },

  updateStatus: async (orderId: string, statusUpdate: OrderStatusUpdate): Promise<OrderRead> => {
    const { data } = await api.put<OrderRead>(`/orders/${orderId}/status`, statusUpdate)
    return data
  },

  updatePayment: async (orderId: string, paymentData: OrderPaymentUpdate): Promise<OrderRead> => {
    const { data } = await api.put<OrderRead>(`/orders/${orderId}/payment`, paymentData)
    return data
  },
}

// ============================================
// Deliveries API
// ============================================
export const deliveriesApi = {
  create: async (deliveryData: DeliveryCreate): Promise<DeliveryRead> => {
    const { data } = await api.post<DeliveryRead>('/deliveries', deliveryData)
    return data
  },

  getAll: async (params?: DeliveryListParams): Promise<PaginatedResponse<DeliveryList>> => {
    const { data } = await api.get<PaginatedResponse<DeliveryList>>('/deliveries', { params })
    return data
  },

  getById: async (deliveryId: string): Promise<DeliveryRead> => {
    const { data } = await api.get<DeliveryRead>(`/deliveries/${deliveryId}`)
    return data
  },

  getPending: async (params?: DeliveryListParams): Promise<PaginatedResponse<DeliveryList>> => {
    const { data } = await api.get<PaginatedResponse<DeliveryList>>('/deliveries/pending', { params })
    return data
  },

  getActive: async (params?: DeliveryListParams): Promise<PaginatedResponse<DeliveryList>> => {
    const { data } = await api.get<PaginatedResponse<DeliveryList>>('/deliveries/active', { params })
    return data
  },

  getByDriver: async (driverId: string, params?: DeliveryListParams): Promise<PaginatedResponse<DeliveryList>> => {
    const { data } = await api.get<PaginatedResponse<DeliveryList>>(`/deliveries/driver/${driverId}`, { params })
    return data
  },

  getByOrder: async (orderId: string): Promise<DeliveryRead> => {
    const { data } = await api.get<DeliveryRead>(`/deliveries/order/${orderId}`)
    return data
  },

  getStatistics: async (params?: { start_date?: string; end_date?: string }): Promise<DeliveryStatistics> => {
    const { data } = await api.get<DeliveryStatistics>('/deliveries/statistics', { params })
    return data
  },

  assign: async (deliveryId: string, assignment: DeliveryAssignment): Promise<DeliveryRead> => {
    const { data } = await api.post<DeliveryRead>(`/deliveries/${deliveryId}/assign`, assignment)
    return data
  },

  updateStatus: async (deliveryId: string, status: string): Promise<DeliveryRead> => {
    const { data } = await api.put<DeliveryRead>(`/deliveries/${deliveryId}/status`, { status })
    return data
  },

  markPickedUp: async (deliveryId: string): Promise<DeliveryRead> => {
    const { data } = await api.post<DeliveryRead>(`/deliveries/${deliveryId}/pickup`)
    return data
  },

  startDelivery: async (deliveryId: string): Promise<DeliveryRead> => {
    const { data } = await api.post<DeliveryRead>(`/deliveries/${deliveryId}/start`)
    return data
  },

  markArrived: async (deliveryId: string): Promise<DeliveryRead> => {
    const { data } = await api.post<DeliveryRead>(`/deliveries/${deliveryId}/arrive`)
    return data
  },

  updateLocation: async (deliveryId: string, location: DeliveryLocationUpdate): Promise<DeliveryRead> => {
    const { data } = await api.put<DeliveryRead>(`/deliveries/${deliveryId}/location`, location)
    return data
  },

  submitProof: async (deliveryId: string, proof: DeliveryProofOfDelivery): Promise<DeliveryRead> => {
    const { data } = await api.post<DeliveryRead>(`/deliveries/${deliveryId}/proof`, proof)
    return data
  },

  markFailed: async (deliveryId: string, failure: DeliveryFailure): Promise<DeliveryRead> => {
    const { data } = await api.post<DeliveryRead>(`/deliveries/${deliveryId}/fail`, failure)
    return data
  },

  cancel: async (deliveryId: string, cancellation: DeliveryCancellation): Promise<DeliveryRead> => {
    const { data } = await api.post<DeliveryRead>(`/deliveries/${deliveryId}/cancel`, cancellation)
    return data
  },
}

// ============================================
// Audit Logs API
// ============================================
export const auditApi = {
  query: async (params?: AuditLogQueryParams): Promise<PaginatedResponse<AuditLogList>> => {
    const { data } = await api.get<PaginatedResponse<AuditLogList>>('/audit/logs', { params })
    return data
  },

  getById: async (logId: string): Promise<AuditLogRead> => {
    const { data } = await api.get<AuditLogRead>(`/audit/logs/${logId}`)
    return data
  },

  getStats: async (params?: { start_date?: string; end_date?: string }): Promise<AuditLogStats> => {
    const { data } = await api.get<AuditLogStats>('/audit/stats', { params })
    return data
  },

  getActionTypes: async (): Promise<string[]> => {
    const { data } = await api.get<string[]>('/audit/actions')
    return data
  },

  getUserActivity: async (params: UserActivityParams): Promise<PaginatedResponse<AuditLogList>> => {
    const { user_id, ...rest } = params
    const { data } = await api.get<PaginatedResponse<AuditLogList>>(`/audit/user/${user_id}/activity`, { params: rest })
    return data
  },
}

export default api
