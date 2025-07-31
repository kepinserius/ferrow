"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAdminAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Package, Calendar, BarChart3 } from "lucide-react"

interface AnalyticsData {
  summary: {
    totalRevenue: number
    totalOrders: number
    completedOrders: number
    pendingOrders: number
    conversionRate: number
    averageOrderValue: number
  }
  timeSeriesData: Array<{
    date: string
    revenue: number
    orders: number
  }>
  topProducts: Array<{
    name: string
    quantity: number
    revenue: number
  }>
  statusDistribution: {
    pending: number
    completed: number
    cancelled: number
    processing: number
  }
  period: string
}

export default function AnalyticsPage() {
  const { isAuthenticated, loading } = useAdminAuth()
  const router = useRouter()
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState("7d")
  const [isLoading, setIsLoading] = useState(true)

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/admin/login")
    }
  }, [isAuthenticated, loading, router])

  // Fetch analytics data
  useEffect(() => {
    if (isAuthenticated) {
      fetchAnalyticsData()
    }
  }, [isAuthenticated, selectedPeriod])

  const fetchAnalyticsData = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/admin/analytics?period=${selectedPeriod}`)
      const result = await response.json()

      if (result.success) {
        setAnalyticsData(result.data)
      }
    } catch (error) {
      console.error("Error fetching analytics:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("id-ID").format(num)
  }

  const getPeriodLabel = (period: string) => {
    switch (period) {
      case "7d":
        return "Last 7 Days"
      case "30d":
        return "Last 30 Days"
      case "90d":
        return "Last 90 Days"
      case "1y":
        return "Last Year"
      default:
        return "Last 7 Days"
    }
  }

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-800 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button onClick={() => router.back()} className="text-gray-600 hover:text-gray-900">
                ← Back
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
            </div>

            {/* Period Selector */}
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-gray-400" />
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
                <option value="1y">Last Year</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <AnalyticsLoadingSkeleton />
        ) : analyticsData ? (
          <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <SummaryCard
                title="Total Revenue"
                value={formatCurrency(analyticsData.summary.totalRevenue)}
                icon={<DollarSign className="h-6 w-6" />}
                trend={12.5}
                trendLabel="vs last period"
                color="green"
              />
              <SummaryCard
                title="Total Orders"
                value={formatNumber(analyticsData.summary.totalOrders)}
                icon={<ShoppingCart className="h-6 w-6" />}
                trend={8.2}
                trendLabel="vs last period"
                color="blue"
              />
              <SummaryCard
                title="Conversion Rate"
                value={`${analyticsData.summary.conversionRate}%`}
                icon={<TrendingUp className="h-6 w-6" />}
                trend={-2.1}
                trendLabel="vs last period"
                color="purple"
              />
              <SummaryCard
                title="Avg Order Value"
                value={formatCurrency(analyticsData.summary.averageOrderValue)}
                icon={<BarChart3 className="h-6 w-6" />}
                trend={5.7}
                trendLabel="vs last period"
                color="orange"
              />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Revenue Chart */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
                <SimpleLineChart data={analyticsData.timeSeriesData} dataKey="revenue" />
              </div>

              {/* Orders Chart */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Orders Trend</h3>
                <SimpleLineChart data={analyticsData.timeSeriesData} dataKey="orders" />
              </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Top Products */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h3>
                <div className="space-y-4">
                  {analyticsData.topProducts.map((product, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <Package className="h-4 w-4 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.quantity} sold</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{formatCurrency(product.revenue)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Status Distribution */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status</h3>
                <div className="space-y-4">
                  {Object.entries(analyticsData.statusDistribution).map(([status, count]) => (
                    <div key={status} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            status === "completed"
                              ? "bg-green-500"
                              : status === "pending"
                                ? "bg-yellow-500"
                                : status === "processing"
                                  ? "bg-blue-500"
                                  : "bg-red-500"
                          }`}
                        />
                        <span className="text-sm font-medium text-gray-900 capitalize">{status}</span>
                      </div>
                      <span className="text-sm text-gray-600">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900">No analytics data available</h3>
            <p className="text-gray-600 mt-2">Analytics data will appear here once you have orders.</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Summary Card Component
interface SummaryCardProps {
  title: string
  value: string
  icon: React.ReactNode
  trend: number
  trendLabel: string
  color: "green" | "blue" | "purple" | "orange"
}

function SummaryCard({ title, value, icon, trend, trendLabel, color }: SummaryCardProps) {
  const colorClasses = {
    green: "text-green-600 bg-green-50",
    blue: "text-blue-600 bg-blue-50",
    purple: "text-purple-600 bg-purple-50",
    orange: "text-orange-600 bg-orange-50",
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>{icon}</div>
        <div className="flex items-center space-x-1">
          {trend > 0 ? (
            <TrendingUp className="h-4 w-4 text-green-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500" />
          )}
          <span className={`text-sm ${trend > 0 ? "text-green-600" : "text-red-600"}`}>{Math.abs(trend)}%</span>
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-xs text-gray-500 mt-1">{trendLabel}</p>
      </div>
    </div>
  )
}

// Simple Line Chart Component (you can replace with a proper chart library)
function SimpleLineChart({ data, dataKey }: { data: any[]; dataKey: string }) {
  const maxValue = Math.max(...data.map((d) => d[dataKey]))

  return (
    <div className="h-64 flex items-end space-x-1">
      {data.map((item, index) => (
        <div key={index} className="flex-1 flex flex-col items-center">
          <div
            className="w-full bg-blue-500 rounded-t"
            style={{
              height: `${(item[dataKey] / maxValue) * 200}px`,
              minHeight: "4px",
            }}
          />
          <div className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-left">
            {new Date(item.date).toLocaleDateString("id-ID", { month: "short", day: "numeric" })}
          </div>
        </div>
      ))}
    </div>
  )
}

// Loading Skeleton
function AnalyticsLoadingSkeleton() {
  return (
    <div className="space-y-8">
      {/* Summary Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                <div className="w-16 h-4 bg-gray-200 rounded"></div>
              </div>
              <div className="w-24 h-8 bg-gray-200 rounded mb-2"></div>
              <div className="w-32 h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="animate-pulse">
              <div className="w-32 h-6 bg-gray-200 rounded mb-4"></div>
              <div className="w-full h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
