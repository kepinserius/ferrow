"use client"
import { useState, useEffect, type JSX } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Package, DollarSign, ShoppingCart, Users, BarChart3, Settings, Eye } from "lucide-react" // Add Eye icon
import { useRouter } from "next/navigation"
import { useAdminAuth } from "../../../context/AuthContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge" // Import Badge component
import { Button } from "@/components/ui/button" // Import Button component
import ProtectedRoute from "../../../components/ProtectedRoute" // Import ProtectedRoute
import DashboardLayout from "../../../components/DashboardLayout" // Import DashboardLayout

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
    <DashboardLayout activeTab="dashboard">
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-6">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="ml-4 space-y-2 flex-1">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </Card>
          ))}
        </div>
        <Card className="p-6">
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
        </Card>
      </div>
    </DashboardLayout>
  )

  if (loading || authLoading || !isAuthenticated) {
    return <LoadingSkeleton />
  }

  return (
    <ProtectedRoute>
      <DashboardLayout activeTab="dashboard">
        <div className="space-y-6">
          {/* Welcome Section */}
          <div className="space-y-1">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Welcome back, {admin?.username}!</h2>
            <p className="text-gray-600">Here's what's happening with your store today.</p>
          </div>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 rounded-lg border border-gray-200">
              <CardContent className="p-0 flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-medium text-gray-600">Total Orders</CardTitle>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                </div>
                <ShoppingCart className="h-8 w-8 text-green-600" />
              </CardContent>
            </Card>
            <Card className="p-6 rounded-lg border border-gray-200">
              <CardContent className="p-0 flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </CardContent>
            </Card>
            <Card className="p-6 rounded-lg border border-gray-200">
              <CardContent className="p-0 flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
                  <p className="text-2xl font-bold text-gray-900">Rp {stats.totalRevenue.toLocaleString("id-ID")}</p>
                </div>
                <DollarSign className="h-8 w-8 text-yellow-600" />
              </CardContent>
            </Card>
            <Card className="p-6 rounded-lg border border-gray-200">
              <CardContent className="p-0 flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-medium text-gray-600">Pending Orders</CardTitle>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
                </div>
                <Package className="h-8 w-8 text-red-600" />
              </CardContent>
            </Card>
          </div>
          {/* Quick Actions */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Button
                  onClick={() => router.push("/admin/orders")}
                  variant="outline"
                  className="flex items-center justify-center h-auto py-3"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Manage Orders
                </Button>
                <Button
                  onClick={() => router.push("/admin/products")}
                  variant="outline"
                  className="flex items-center justify-center h-auto py-3"
                >
                  <Package className="h-5 w-5 mr-2" />
                  Manage Products
                </Button>
                <Button
                  onClick={() => router.push("/admin/analytics")}
                  variant="outline"
                  className="flex items-center justify-center h-auto py-3"
                >
                  <BarChart3 className="h-5 w-5 mr-2" />
                  View Analytics
                </Button>
                <Button
                  onClick={() => router.push("/admin/settings")}
                  variant="outline"
                  className="flex items-center justify-center h-auto py-3"
                >
                  <Settings className="h-5 w-5 mr-2" />
                  Settings
                </Button>
              </div>
            </CardContent>
          </Card>

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
                            <Button
                              onClick={() => router.push(`/admin/orders/${order.id}`)}
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Recent Products Section */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Recent Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product Name</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentProducts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">
                          No recent products found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      recentProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>{formatPrice(product.price)}</TableCell>
                          <TableCell>{product.stock}</TableCell>
                          <TableCell>
                            <Badge variant={product.is_active ? "default" : "secondary"}>
                              {product.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(product.created_at || "")}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              onClick={() => router.push(`/admin/products/${product.id}`)}
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
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
      </DashboardLayout>
    </ProtectedRoute>
  )
}
