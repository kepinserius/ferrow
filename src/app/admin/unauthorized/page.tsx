"use client"

import { useRouter } from "next/navigation"
import { ShieldX, Home, ArrowLeft } from "lucide-react"

export default function UnauthorizedPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mx-auto h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <ShieldX className="h-8 w-8 text-red-600" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>

          <p className="text-gray-600 mb-8">
            You don't have permission to access this page. Please contact an administrator if you believe this is an
            error.
          </p>

          <div className="space-y-3">
            <button
              onClick={() => router.back()}
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </button>

            <button
              onClick={() => router.push("/")}
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              <Home className="h-4 w-4 mr-2" />
              Go to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
