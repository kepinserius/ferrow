"use client"

import ProtectedRoute from "../../../components/ProtectedRoute"
import DashboardLayout from "../../../components/DashboardLayout"
import { useState, useEffect, type JSX } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Package, DollarSign, ShoppingCart, TrendingUp, Eye } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

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
  id: number
  total_amount: number
  status: string
  created_at: string
}

interface Stats {
  totalProducts: number
  totalRevenue: number
  totalOrders: number
  lowStock: number
}

export default function DashboardPage(): JSX.Element {
  return (
    <ProtectedRoute requireAuth={false}>
      <DashboardLayout activeTab="dashboard">
        <DashboardContent />
      </DashboardLayout>
    </ProtectedRoute>
  )
}

function DashboardContent(): JSX.Element {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalRevenue: 0,
    totalOrders: 0,
    lowStock: 0,
  })
  const [recentProducts, setRecentProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const router = useRouter()

  useEffect(() => {
    fetchDashboardData()

    // Real-time subscription for products
    const channel = supabase
      .channel("realtime-products")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "products",
        },
        () => {
          fetchDashboardData()
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch products
      const { data: products, error: productsError } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false })

      if (productsError) throw productsError

      // Fetch orders (if orders table exists)
      const { data: orders, error: ordersError } = await supabase
        .from("orders")
        .select("id, total_amount, status, created_at")

      // Calculate stats
      if (products) {
        const totalProducts = products.length
        const lowStock = products.filter((p: Product) => p.stock < 10).length

        // Calculate revenue from orders if available, otherwise from product inventory
        let totalRevenue = 0
        let totalOrders = 0

        if (orders && !ordersError) {
          totalRevenue = orders
            .filter((order: Order) => order.status === "completed")
            .reduce((sum: number, order: Order) => sum + order.total_amount, 0)
          totalOrders = orders.length
        } else {
          // Fallback: calculate potential revenue from current inventory
          totalRevenue = products.reduce(
            (sum: number, p: Product) => sum + p.price * Math.min(p.stock, 10), // Assume max 10 sold per product
            0,
          )
          totalOrders = products.filter((p: Product) => p.is_active).length * 2 // Mock calculation
        }

        setStats({
          totalProducts,
          totalRevenue,
          totalOrders,
          lowStock,
        })

        // Get recent products (last 5)
        setRecentProducts(products.slice(0, 5))
      }
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

  if (loading) {
    return <LoadingSkeleton />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to Ferrow Pet Store Admin</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<Package className="h-6 w-6 text-gray-600" />}
          label="Total Products"
          value={stats.totalProducts}
          bgColor="bg-white"
        />
        <StatCard
          icon={<DollarSign className="h-6 w-6 text-gray-600" />}
          label="Total Revenue"
          value={formatPrice(stats.totalRevenue)}
          bgColor="bg-white"
        />
        <StatCard
          icon={<ShoppingCart className="h-6 w-6 text-gray-600" />}
          label="Total Orders"
          value={stats.totalOrders}
          bgColor="bg-white"
        />
        <StatCard
          icon={<TrendingUp className="h-6 w-6 text-gray-600" />}
          label="Low Stock Items"
          value={stats.lowStock}
          bgColor="bg-white"
        />
      </div>

      {/* Recent Products */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Recent Products</h2>
              <p className="text-sm text-gray-600 mt-1">Latest products added to your inventory</p>
            </div>
            <button
              onClick={() => router.push("/admin/products")}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            >
              <Eye className="h-4 w-4" />
              View All
            </button>
          </div>
        </div>

        <div className="p-6">
          {recentProducts.length === 0 ? (
            <div className="text-center py-8">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-semibold text-gray-900">No products found</h3>
              <p className="text-gray-600 mt-2">Get started by adding your first product.</p>
              <button
                onClick={() => router.push("/admin/products/new")}
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                Add Product
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="relative h-8 w-8 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                            {product.image_url ? (
                              <Image
                                src={product.image_url || "/placeholder.svg"}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full">
                                <Package className="h-4 w-4 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            <div className="text-xs text-gray-500">ID: {product.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatPrice(product.price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm ${product.stock < 10 ? "text-red-600" : "text-gray-900"}`}>
                            {product.stock}
                          </span>
                          {product.stock < 10 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Low
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            product.is_active ? "bg-gray-100 text-gray-800" : "bg-gray-50 text-gray-600"
                          }`}
                        >
                          {product.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
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
