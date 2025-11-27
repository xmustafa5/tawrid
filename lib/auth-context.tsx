'use client'

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { authApi, tokenStorage } from './api'
import type { UserProfile, LoginRequest, UserRegister } from '@/types'

interface AuthContextType {
  user: UserProfile | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginRequest) => Promise<void>
  register: (userData: UserRegister) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const refreshUser = useCallback(async () => {
    try {
      const token = tokenStorage.getAccessToken()
      if (!token) {
        setUser(null)
        setIsLoading(false)
        return
      }

      const profile = await authApi.getProfile()
      setUser(profile)
    } catch {
      setUser(null)
      tokenStorage.clearTokens()
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshUser()
  }, [refreshUser])

  const login = useCallback(async (credentials: LoginRequest) => {
    setIsLoading(true)
    try {
      const response = await authApi.login(credentials)
      setUser(response.user)
      router.push('/dashboard')
    } finally {
      setIsLoading(false)
    }
  }, [router])

  const register = useCallback(async (userData: UserRegister) => {
    setIsLoading(true)
    try {
      await authApi.register(userData)
      router.push('/login?registered=true')
    } finally {
      setIsLoading(false)
    }
  }, [router])

  const logout = useCallback(async () => {
    setIsLoading(true)
    try {
      await authApi.logout()
    } catch {
      // Even if logout fails on server, clear local state
    } finally {
      setUser(null)
      tokenStorage.clearTokens()
      setIsLoading(false)
      router.push('/login')
    }
  }, [router])

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
