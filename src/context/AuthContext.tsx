"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

// User interface for customers
interface User {
  id: string
  email: string
  name: string
  phone?: string
  email_verified?: boolean
}

// Admin interface for admin users
interface Admin {
  id: string
  username: string
  email?: string
  role: string
}

interface AuthContextType {
  // Customer auth
  user: User | null
  userLoading: boolean
  signIn: (email: string, name: string, phone?: string) => Promise<{ success: boolean; message?: string }>
  signOut: () => void
  // Admin auth
  admin: Admin | null
  adminLoading: boolean
  adminSignIn: (username: string, password: string) => Promise<{ success: boolean; message?: string }>
  adminSignOut: () => Promise<void>
  // Utility
  isUserAuthenticated: boolean
  isAdminAuthenticated: boolean
  loading: boolean // Combined loading state
}

// Define AuthContext here
const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  console.log("AuthProvider is rendering") // Debugging log
  const [user, setUser] = useState<User | null>(null)
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [userLoading, setUserLoading] = useState(true)
  const [adminLoading, setAdminLoading] = useState(true)
  const router = useRouter()

  // Check user authentication status
  useEffect(() => {
    checkUserAuthStatus()
  }, [])

  // Check admin authentication status
  useEffect(() => {
    checkAdminAuthStatus()
  }, [])

  const checkUserAuthStatus = async () => {
    try {
      const userData = localStorage.getItem("ferrow-user")
      console.log("checkUserAuthStatus: userData from localStorage =", userData ? "exists" : "null")
      if (userData) {
        const parsedUser = JSON.parse(userData)
        // Verify user with server (optional)
        try {
          const response = await fetch("/api/auth/verify-user", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId: parsedUser.id }),
          })
          console.log("checkUserAuthStatus: /api/auth/verify-user response status =", response.status)
          if (response.ok) {
            const data = await response.json()
            console.log("checkUserAuthStatus: /api/auth/verify-user response data =", data)
            if (data.success) {
              setUser(data.user)
              console.log("checkUserAuthStatus: User set from API verification:", data.user)
            } else {
              console.log("checkUserAuthStatus: /api/auth/verify-user returned success: false. Clearing local storage.")
              localStorage.removeItem("ferrow-user")
              setUser(null)
            }
          } else {
            // If verification fails, keep local data for now
            console.log("checkUserAuthStatus: /api/auth/verify-user response not OK. Keeping local data.")
            setUser(parsedUser)
          }
        } catch (error) {
          // If server is down, keep local data
          console.error("checkUserAuthStatus: Error verifying user with server:", error)
          setUser(parsedUser)
        }
      }
    } catch (error) {
      console.error("User auth check error:", error)
      localStorage.removeItem("ferrow-user")
      setUser(null)
    } finally {
      setUserLoading(false)
    }
  }

  const checkAdminAuthStatus = async () => {
    try {
      const token = localStorage.getItem("adminToken")
      const adminData = localStorage.getItem("adminUser")
      console.log(
        "checkAdminAuthStatus: token =",
        token ? "exists" : "null",
        "adminData =",
        adminData ? "exists" : "null",
      )

      if (token && adminData) {
        // Verify admin token with server
        const response = await fetch("/api/admin/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        console.log("checkAdminAuthStatus: /api/admin/verify response status =", response.status)
        if (response.ok) {
          const data = await response.json()
          console.log("checkAdminAuthStatus: /api/admin/verify response data =", data)
          if (data.success) {
            try {
              const parsedAdmin = JSON.parse(adminData)
              setAdmin(parsedAdmin)
              console.log("checkAdminAuthStatus: Admin set from localStorage:", parsedAdmin)
            } catch (parseError) {
              console.error("checkAdminAuthStatus: Error parsing adminData from localStorage:", parseError)
              localStorage.removeItem("adminToken")
              localStorage.removeItem("adminUser")
              setAdmin(null)
            }
          } else {
            console.log("checkAdminAuthStatus: /api/admin/verify returned success: false. Clearing local storage.")
            localStorage.removeItem("adminToken")
            localStorage.removeItem("adminUser")
            setAdmin(null)
          }
        } else {
          console.log("checkAdminAuthStatus: /api/admin/verify response not OK. Clearing local storage.")
          localStorage.removeItem("adminToken")
          localStorage.removeItem("adminUser")
          setAdmin(null)
        }
      } else {
        console.log("checkAdminAuthStatus: No token or adminData in localStorage. Admin is null.")
        setAdmin(null) // Ensure admin is null if no data
      }
    } catch (error) {
      console.error("Admin auth check error:", error)
      localStorage.removeItem("adminToken")
      localStorage.removeItem("adminUser")
      setAdmin(null)
    } finally {
      setAdminLoading(false)
    }
  }

  // Customer sign in (simple registration/login)
  const signIn = async (
    email: string,
    name: string,
    phone?: string,
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, name, phone }),
      })
      const data = await response.json()
      console.log("signIn: /api/auth/signin response data =", data)
      if (data.success) {
        const userData = data.user
        localStorage.setItem("ferrow-user", JSON.stringify(userData))
        setUser(userData)
        return { success: true }
      } else {
        return { success: false, message: data.message || "Sign in failed" }
      }
    } catch (error) {
      console.error("Sign in error:", error)
      return { success: false, message: "Network error. Please try again." }
    }
  }

  // Customer sign out
  const signOut = () => {
    localStorage.removeItem("ferrow-user")
    localStorage.removeItem("ferrow-cart")
    setUser(null)
    // Optionally redirect to home or login page for customers
    // router.push("/");
  }

  // Admin sign in
  const adminSignIn = async (username: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })
      const data = await response.json()
      console.log("adminSignIn: /api/admin/login response data =", data)
      if (data.success) {
        localStorage.setItem("adminToken", data.data.token)
        localStorage.setItem("adminUser", JSON.stringify(data.data.admin))
        setAdmin(data.data.admin)
        console.log("adminSignIn: Admin successfully set:", data.data.admin)
        return { success: true }
      } else {
        console.log("adminSignIn: Login failed:", data.message)
        return { success: false, message: data.message || "Login failed" }
      }
    } catch (error) {
      console.error("Admin sign in error:", error)
      return { success: false, message: "Network error. Please try again." }
    }
  }

  // Admin sign out
  const adminSignOut = async () => {
    try {
      const token = localStorage.getItem("adminToken")
      if (token) {
        await fetch("/api/admin/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      }
    } catch (error) {
      console.error("Admin sign out error:", error)
    } finally {
      localStorage.removeItem("adminToken")
      localStorage.removeItem("adminUser")
      setAdmin(null)
      router.push("/admin/login")
    }
  }

  const value: AuthContextType = {
    // Customer auth
    user,
    userLoading,
    signIn,
    signOut,
    // Admin auth
    admin,
    adminLoading,
    adminSignIn,
    adminSignOut,
    // Utility
    isUserAuthenticated: !!user,
    isAdminAuthenticated: !!admin,
    loading: userLoading || adminLoading, // Combined loading state
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  console.log("AuthContext value in useAuth:", context) // Debugging log
  if (context === undefined) {
    // Kesalahan ini menunjukkan bahwa AuthProvider bukan merupakan ancestor dalam pohon React.
    // Periksa kembali apakah AuthProvider membungkus seluruh aplikasi Anda di layout.tsx.
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Separate hooks for cleaner usage
export function useUserAuth() {
  const { user, userLoading, signIn, signOut, isUserAuthenticated } = useAuth()
  return { user, loading: userLoading, signIn, signOut, isAuthenticated: isUserAuthenticated }
}

export function useAdminAuth() {
  const { admin, adminLoading, adminSignIn, adminSignOut, isAdminAuthenticated } = useAuth()
  return {
    admin,
    loading: adminLoading,
    signIn: adminSignIn,
    signOut: adminSignOut,
    isAuthenticated: isAdminAuthenticated,
  }
}
