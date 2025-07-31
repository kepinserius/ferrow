"use client"
import { useState, useEffect, type JSX } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Package, DollarSign, ShoppingCart, LogOut, Users, BarChart3, Bell, Settings } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAdminAuth } from "../../../context/AuthContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge" // Import Badge component

interface Product {
  id: number
  name: string
  price: number
  stock: number
  image_url?: string
  is_active: boolean
  created_at?: string
}

interface Order {
  id: string // Changed to string to match Supabase UUID
  order_number: string
  customer_name: string
  customer_email: string
  total_amount: number
  status: string
  payment_status: string
  created_at: string
}

interface Stats {
  totalProducts: number
  totalRevenue: number
  totalOrders: number
  lowStock: number
  totalUsers: number
  pendingOrders: number
}

export default function AdminDashboard(): JSX.Element {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalRevenue: 0,
    totalOrders: 0,
    lowStock: 0,
    totalUsers: 0,
    pendingOrders: 0,
  })
  const [recentProducts, setRecentProducts] = useState<Product[]>([])
  const [recentOrders, setRecentOrders] = useState<Order[]>([]) // New state for recent orders
  const [loading, setLoading] = useState<boolean>(true)
  const router = useRouter()

  const { admin, loading: authLoading, signOut, isAuthenticated } = useAdminAuth()

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/admin/login")
    }
  }, [isAuthenticated, authLoading, router])

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData()
      // Real-time subscription for products
      const productsChannel = supabase
        .channel("realtime-products")
        .on("postgres_changes", { event: "*", schema: "public", table: "products" }, () => {
          fetchDashboardData()
        })
        .subscribe()

      // Real-time subscription for orders
      const ordersChannel = supabase
        .channel("realtime-orders")
        .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => {
          fetchDashboardData()
        })
        .subscribe()

      return () => {
        supabase.removeChannel(productsChannel)
        supabase.removeChannel(ordersChannel)
      }
    }
  }, [isAuthenticated])

  const fetchDashboardData = async () => {
    try {
      // Fetch products
      const { data: products, error: productsError } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false })
      if (productsError) throw productsError

      // Fetch orders
      const { data: orders, error: ordersError } = await supabase
        .from("orders")
        .select("id, order_number, customer_name, customer_email, total_amount, status, payment_status, created_at")
        .order("created_at", { ascending: false }) // Order by creation date for recency

      if (ordersError) {
        console.error("Error fetching orders:", ordersError)
      }

      // Fetch total users from 'users' table
      const { count: userCount, error: usersCountError } = await supabase
        .from("users") // Assuming a 'users' table exists for user data
        .select("*", { count: "exact", head: true })

      if (usersCountError) {
        console.error("Error fetching user count:", usersCountError)
      }
      const totalUsers = userCount !== null ? userCount : 0

      // Calculate stats
      const totalProducts = products ? products.length : 0
      const lowStock = products ? products.filter((p: Product) => p.stock < 10).length : 0

      let totalRevenue = 0
      let totalOrders = 0
      let pendingOrders = 0

      if (orders) {
        totalRevenue = orders
          .filter((order: Order) => order.status === "completed" || order.payment_status === "paid")
          .reduce((sum: number, order: Order) => sum + order.total_amount, 0)
        totalOrders = orders.length
        pendingOrders = orders.filter((order: Order) => order.status === "pending").length
      }

      setStats({
        totalProducts,
        totalRevenue,
        totalOrders,
        lowStock,
        totalUsers,
        pendingOrders,
      })

      setRecentProducts(products ? products.slice(0, 5) : [])
      setRecentOrders(orders ? orders.slice(0, 5) : []) // Set recent orders
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(price)
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

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "delivered":
      case "paid":
        return "default"
      case "pending":
      case "processing":
        return "secondary"
      case "cancelled":
      case "failed":
      case "expired":
        return "destructive"
      case "shipped":
        return "outline"
      default:
        return "default"
    }
  }

  // Loading Skeleton
  const LoadingSkeleton = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="ml-4 space-y-2">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="space-y-2 flex-1">
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  if (loading || authLoading || !isAuthenticated) {
    return <LoadingSkeleton />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-green-800">Ferrow Admin</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Bell className="h-5 w-5" />
              </button>
              <button
                onClick={() => router.push("/admin/settings")}
                className="p-2 text-gray-400 hover:text-gray-600"
                title="Settings"
              >
                <Settings className="h-5 w-5" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{admin?.username}</p>
                  <p className="text-xs text-gray-500 capitalize">{admin?.role}</p>
                </div>
                <button
                  onClick={signOut}
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Welcome back, {admin?.username}!</h2>
            <p className="mt-2 text-gray-600">Here's what's happening with your store today.</p>
          </div>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ShoppingCart className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Orders</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.totalOrders}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.totalUsers}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <DollarSign className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                      <dd className="text-lg font-medium text-gray-900">
                        Rp {stats.totalRevenue.toLocaleString("id-ID")}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Package className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Pending Orders</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.pendingOrders}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Quick Actions */}
          <div className="bg-white shadow rounded-lg mb-8">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <button
                  onClick={() => router.push("/admin/orders")}
                  className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Manage Orders
                </button>
                <button
                  onClick={() => router.push("/admin/products")}
                  className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Package className="h-5 w-5 mr-2" />
                  Manage Products
                </button>
                <button
                  onClick={() => router.push("/admin/analytics")}
                  className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <BarChart3 className="h-5 w-5 mr-2" />
                  View Analytics
                </button>
                <button
                  onClick={() => router.push("/admin/settings")}
                  className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Settings className="h-5 w-5 mr-2" />
                  Settings
                </button>
              </div>
            </div>
          </div>

          {/* Recent Orders Section */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order Number</TableHead>
                      <TableHead>Customer Name</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment Status</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentOrders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4">
                          No recent orders found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      recentOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.order_number}</TableCell>
                          <TableCell>{order.customer_name}</TableCell>
                          <TableCell>{formatPrice(order.total_amount)}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(order.status)}>{order.status}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(order.payment_status)}>{order.payment_status}</Badge>
                          </TableCell>
                          <TableCell>{formatDate(order.created_at)}</TableCell>
                          <TableCell className="text-right">
                            <button
                              onClick={() => router.push(`/admin/orders/${order.id}`)}
                              className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                              title="View Details"
                            >
                              View
                            </button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

interface StatCardProps {
  icon: JSX.Element
  label: string
  value: number | string
  bgColor?: string
}

function StatCard({ icon, label, value, bgColor = "bg-white" }: StatCardProps): JSX.Element {
  return (
    <div className={`${bgColor} rounded-lg border border-gray-200 p-6`}>
      <div className="flex items-center">
        <div className="flex-shrink-0">{icon}</div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  )
}
