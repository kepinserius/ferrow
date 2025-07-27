"use client"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import ProtectedRoute from "../../../../components/ProtectedRoute"
import DashboardLayout from "../../../../components/DashboardLayout"
import {
  ArrowLeft,
  Package,
  User,
  MapPin,
  CreditCard,
  Truck,
  Calendar,
  Phone,
  Mail,
  Edit,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  Clock,
  XCircle,
} from "lucide-react"

interface OrderItem {
  id: string
  product_name: string
  product_code: string
  product_image_url?: string
  quantity: number
  unit_price: number
  total_price: number
}

interface Order {
  id: string
  order_number: string
  customer_name: string
  customer_email: string
  customer_phone: string
  shipping_address: string
  shipping_city: string
  shipping_province: string
  shipping_postal_code: string
  subtotal: number
  shipping_cost: number
  total_amount: number
  courier?: string
  service?: string
  estimated_delivery?: string
  tracking_number?: string
  payment_method?: string
  payment_status: string
  status: string
  notes?: string
  created_at: string
  updated_at: string
  paid_at?: string
  order_items: OrderItem[]
}

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState(false)
  const [editData, setEditData] = useState({
    status: "",
    payment_status: "",
    tracking_number: "",
    notes: "",
  })

  useEffect(() => {
    if (params.id) {
      fetchOrder()
    }
  }, [params.id])

  const fetchOrder = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/orders/${params.id}`)
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Failed to fetch order")
      }

      setOrder(data.order)
      setEditData({
        status: data.order.status,
        payment_status: data.order.payment_status,
        tracking_number: data.order.tracking_number || "",
        notes: data.order.notes || "",
      })
    } catch (error: any) {
      console.error("Error fetching order:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const response = await fetch(`/api/orders/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editData),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Failed to update order")
      }

      setOrder(data.order)
      setEditing(false)
      setError(null)
    } catch (error: any) {
      console.error("Error updating order:", error)
      setError(error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleCreatePayment = async () => {
    try {
      setSaving(true)
      const response = await fetch("/api/payment/create-transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ order_id: order?.id }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Failed to create payment")
      }

      // Open payment URL in new tab
      if (data.redirect_url) {
        window.open(data.redirect_url, "_blank")
      }

      // Refresh order data
      fetchOrder()
    } catch (error: any) {
      console.error("Error creating payment:", error)
      setError(error.message)
    } finally {
      setSaving(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
      confirmed: { color: "bg-blue-100 text-blue-800", icon: CheckCircle },
      processing: { color: "bg-purple-100 text-purple-800", icon: Package },
      shipped: { color: "bg-indigo-100 text-indigo-800", icon: Truck },
      delivered: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      cancelled: { color: "bg-red-100 text-red-800", icon: XCircle },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    const Icon = config.icon

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        <Icon className="h-4 w-4" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
      paid: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      failed: { color: "bg-red-100 text-red-800", icon: XCircle },
      expired: { color: "bg-gray-100 text-gray-800", icon: AlertCircle },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    const Icon = config.icon

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        <Icon className="h-4 w-4" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout activeTab="orders">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  if (error || !order) {
    return (
      <ProtectedRoute>
        <DashboardLayout activeTab="orders">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/admin/orders")}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Orders
              </button>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
              <h3 className="text-lg font-medium text-red-900 mb-2">Error Loading Order</h3>
              <p className="text-red-700">{error || "Order not found"}</p>
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <DashboardLayout activeTab="orders">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/admin/orders")}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Orders
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{order.order_number}</h1>
                <p className="text-gray-600">Order placed on {formatDate(order.created_at)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {order.payment_status === "pending" && (
                <button
                  onClick={handleCreatePayment}
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
                >
                  <CreditCard className="h-4 w-4" />
                  Create Payment
                </button>
              )}
              {editing ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
                  >
                    <Save className="h-4 w-4" />
                    {saving ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                  Edit Order
                </button>
              )}
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Items */}
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Order Items</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {order.order_items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                        <div className="flex-shrink-0">
                          <div className="h-16 w-16 bg-gray-100 rounded-lg overflow-hidden">
                            {item.product_image_url ? (
                              <img
                                src={item.product_image_url || "/placeholder.svg"}
                                alt={item.product_name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center">
                                <Package className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-gray-900">{item.product_name}</h3>
                          <p className="text-sm text-gray-500">Code: {item.product_code}</p>
                          <p className="text-sm text-gray-500">
                            {formatCurrency(item.unit_price)} × {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{formatCurrency(item.total_price)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Summary */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="text-gray-900">{formatCurrency(order.subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Shipping</span>
                        <span className="text-gray-900">{formatCurrency(order.shipping_cost)}</span>
                      </div>
                      <div className="flex justify-between text-base font-medium pt-2 border-t border-gray-200">
                        <span className="text-gray-900">Total</span>
                        <span className="text-gray-900">{formatCurrency(order.total_amount)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Customer Information</h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-3">Contact Details</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{order.customer_name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{order.customer_email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{order.customer_phone}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-3">Shipping Address</h3>
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                        <div className="text-sm text-gray-900">
                          <p>{order.shipping_address}</p>
                          <p>
                            {order.shipping_city}, {order.shipping_province} {order.shipping_postal_code}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Order Status */}
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Order Status</h2>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Order Status</label>
                    {editing ? (
                      <select
                        value={editData.status}
                        onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    ) : (
                      getStatusBadge(order.status)
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
                    {editing ? (
                      <select
                        value={editData.payment_status}
                        onChange={(e) => setEditData({ ...editData, payment_status: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="failed">Failed</option>
                        <option value="expired">Expired</option>
                      </select>
                    ) : (
                      getPaymentStatusBadge(order.payment_status)
                    )}
                  </div>

                  {order.paid_at && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Paid At</label>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{formatDate(order.paid_at)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Shipping Information */}
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Shipping Information</h2>
                </div>
                <div className="p-6 space-y-4">
                  {order.courier && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Courier</label>
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-900">
                          {order.courier.toUpperCase()} - {order.service}
                        </span>
                      </div>
                    </div>
                  )}

                  {order.estimated_delivery && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Delivery</label>
                      <span className="text-sm text-gray-900">{order.estimated_delivery}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tracking Number</label>
                    {editing ? (
                      <input
                        type="text"
                        value={editData.tracking_number}
                        onChange={(e) => setEditData({ ...editData, tracking_number: e.target.value })}
                        placeholder="Enter tracking number"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <span className="text-sm text-gray-900">{order.tracking_number || "Not available"}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Notes</h2>
                </div>
                <div className="p-6">
                  {editing ? (
                    <textarea
                      value={editData.notes}
                      onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                      placeholder="Add notes about this order..."
                      rows={4}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-sm text-gray-900">{order.notes || "No notes available"}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
