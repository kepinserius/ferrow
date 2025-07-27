"use client"

import { type ReactNode, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../context/AuthContext"
import { Shield } from "lucide-react"

interface ProtectedRouteProps {
  children: ReactNode
  requireAuth?: boolean
  redirectTo?: string
}

export default function ProtectedRoute({
  children,
  requireAuth = true,
  redirectTo = "/admin/login",
}: ProtectedRouteProps) {
  const { admin, loading, isAuthenticated } = useAuth()
  const [shouldRedirect, setShouldRedirect] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (!loading && requireAuth && !isAuthenticated) {
      console.log("[ProtectedRoute] User not authenticated, redirecting to login")
      setShouldRedirect(true)
      router.push(redirectTo)
    }
  }, [loading, requireAuth, isAuthenticated, router, redirectTo])

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-800 rounded-full mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-100"></div>
          </div>
          <h2 className="text-xl font-semibold text-green-800 mb-2">Checking Authentication</h2>
          <p className="text-green-600">Please wait...</p>
        </div>
      </div>
    )
  }

  // Not authenticated and auth is required
  if (requireAuth && !isAuthenticated && !shouldRedirect) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-yellow-200 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
              <Shield className="w-8 h-8 text-red-600" />
            </div>

            <h2 className="text-2xl font-bold text-green-800 mb-4">Access Denied</h2>
            <p className="text-green-600 mb-6">You need to be logged in as an administrator to access this page.</p>

            <div className="space-y-3">
              <button
                onClick={() => router.push(redirectTo)}
                className="w-full bg-green-800 text-yellow-100 py-3 px-4 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200"
              >
                Go to Login
              </button>

              <button
                onClick={() => router.push("/")}
                className="w-full bg-gray-100 text-green-800 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Authenticated or auth not required
  return <>{children}</>
}
