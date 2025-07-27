"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

interface Admin {
  id: string
  username: string
  email?: string
  role: string
}

interface AuthContextType {
  admin: Admin | null
  loading: boolean
  signIn: (username: string, password: string) => Promise<{ success: boolean; message?: string }>
  signOut: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem("adminToken")
      const adminData = localStorage.getItem("adminUser")

      if (token && adminData) {
        // Verify token with server
        const response = await fetch("/api/admin/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            setAdmin(JSON.parse(adminData))
          } else {
            // Token invalid, clear storage
            localStorage.removeItem("adminToken")
            localStorage.removeItem("adminUser")
            setAdmin(null)
          }
        } else {
          // Server error, clear storage
          localStorage.removeItem("adminToken")
          localStorage.removeItem("adminUser")
          setAdmin(null)
        }
      }
    } catch (error) {
      console.error("Auth check error:", error)
      // Clear storage on error
      localStorage.removeItem("adminToken")
      localStorage.removeItem("adminUser")
      setAdmin(null)
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (username: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (data.success) {
        localStorage.setItem("adminToken", data.data.token)
        localStorage.setItem("adminUser", JSON.stringify(data.data.admin))
        setAdmin(data.data.admin)
        return { success: true }
      } else {
        return { success: false, message: data.message || "Login failed" }
      }
    } catch (error) {
      console.error("Sign in error:", error)
      return { success: false, message: "Network error. Please try again." }
    }
  }

  const signOut = async () => {
    try {
      const token = localStorage.getItem("adminToken")
      if (token) {
        // Optional: Call logout endpoint
        await fetch("/api/admin/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      }
    } catch (error) {
      console.error("Sign out error:", error)
    } finally {
      localStorage.removeItem("adminToken")
      localStorage.removeItem("adminUser")
      setAdmin(null)
      router.push("/admin/login")
    }
  }

  const value: AuthContextType = {
    admin,
    loading,
    signIn,
    signOut,
    isAuthenticated: !!admin,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
