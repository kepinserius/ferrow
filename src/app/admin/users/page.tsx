"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import ProtectedRoute from "../../../components/ProtectedRoute"
import DashboardLayout from "../../../components/DashboardLayout"
import {
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  AlertCircle,
  LayoutDashboard,
  User,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface UserData {
  id: string
  email: string
  name: string
  phone: string | null
  email_verified: boolean
  created_at: string
  updated_at: string
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  })

  const router = useRouter()

  useEffect(() => {
    fetchUsers()
  }, [pagination.page, searchTerm])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      params.append("page", String(pagination.page))
      params.append("limit", String(pagination.limit))
      if (searchTerm) {
        params.append("search", searchTerm)
      }

      const response = await fetch(`/api/users?${params.toString()}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch users from API.")
      }

      setUsers(result.users as UserData[])
      setPagination((prev) => ({
        ...prev,
        total: result.pagination.total || 0,
        totalPages: Math.ceil((result.pagination.total || 0) / prev.limit),
      }))
    } catch (error: any) {
      console.error("Error fetching users:", error)
      setError(error.message || "An unknown error occurred while fetching users.")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchTerm((e.target as HTMLFormElement).search.value)
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getVerificationBadge = (isVerified: boolean) => {
    if (isVerified) {
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          <CheckCircle className="h-3 w-3 mr-1" /> Verified
        </Badge>
      )
    }
    return (
      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
        <XCircle className="h-3 w-3 mr-1" /> Unverified
      </Badge>
    )
  }

  if (loading && users.length === 0) {
    return (
      <ProtectedRoute>
        <DashboardLayout activeTab="users">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  if (error) {
    return (
      <ProtectedRoute>
        <DashboardLayout activeTab="users">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => router.push("/admin/dashboard")}
                variant="ghost"
                className="inline-flex items-center gap-2"
              >
                <LayoutDashboard className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
              <h3 className="text-lg font-medium text-red-900 mb-2">Error Loading Users</h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <DashboardLayout activeTab="users">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">Users</h1>
              <p className="text-gray-600">Manage customer accounts</p>
            </div>
            <Button
              onClick={() => router.push("/admin/dashboard")}
              variant="outline"
              className="inline-flex items-center gap-2"
            >
              <LayoutDashboard className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
          {/* Stats Cards (Optional, can be added later if needed) */}
          {/* Filters and Search */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <form onSubmit={handleSearch} className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    id="search"
                    placeholder="Search by email or name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </form>
              <div className="flex items-center gap-3">
                <Button onClick={fetchUsers} disabled={loading} className="inline-flex items-center gap-2">
                  <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
              </div>
            </div>
          </div>
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}
          {/* Users Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Verified</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length === 0 && !loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        No users found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <TableRow key={user.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium text-xs">{user.id.substring(0, 8)}...</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.phone || "-"}</TableCell>
                        <TableCell>{getVerificationBadge(user.email_verified)}</TableCell>
                        <TableCell>{formatDate(user.created_at)}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            onClick={() => router.push(`/admin/users/${user.id}`)} // Link to user detail page
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            title="View Details"
                          >
                            <User className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border border-gray-200 rounded-lg">
              <div className="flex-1 flex justify-between sm:hidden">
                <Button
                  onClick={() => setPagination((prev) => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                  disabled={pagination.page === 1}
                  variant="outline"
                >
                  Previous
                </Button>
                <Button
                  onClick={() => setPagination((prev) => ({ ...prev, page: Math.min(prev.totalPages, prev.page + 1) }))}
                  disabled={pagination.page === pagination.totalPages}
                  variant="outline"
                >
                  Next
                </Button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{" "}
                    <span className="font-medium">
                      {Math.min(pagination.page * pagination.limit, pagination.total)}
                    </span>{" "}
                    of <span className="font-medium">{pagination.total}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <Button
                      onClick={() => setPagination((prev) => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                      disabled={pagination.page === 1}
                      variant="outline"
                      className="rounded-r-none"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    {[...Array(pagination.totalPages)].map((_, i) => {
                      const page = i + 1
                      const isCurrentPage = page === pagination.page
                      return (
                        <Button
                          key={page}
                          onClick={() => setPagination((prev) => ({ ...prev, page }))}
                          variant={isCurrentPage ? "default" : "outline"}
                          className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
                            isCurrentPage ? "z-10" : ""
                          } ${i === 0 ? "rounded-l-md" : ""} ${i === pagination.totalPages - 1 ? "rounded-r-md" : ""} ${
                            i > 0 && i < pagination.totalPages - 1 ? "border-l-0" : ""
                          }`}
                        >
                          {page}
                        </Button>
                      )
                    })}
                    <Button
                      onClick={() =>
                        setPagination((prev) => ({ ...prev, page: Math.min(prev.totalPages, prev.page + 1) }))
                      }
                      disabled={pagination.page === pagination.totalPages}
                      variant="outline"
                      className="rounded-l-none"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
