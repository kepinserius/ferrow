"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { FaSearch, FaFilter, FaEye, FaShoppingBag, FaCalendarAlt, FaLock } from "react-icons/fa"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import LoginModal from "@/components/LoginModal"
import { useUserAuth } from "@/context/AuthContext"

interface OrderItem {
  id: string
  product_name: string
  product_code: string
  product_image_url: string
  quantity: number
  unit_price: number
  total_price: number
}

interface Order {
  id: string
  order_number: string
  customer_name: string
  customer_email: string
  total_amount: number
  status: string
  payment_status: string
  created_at: string
  order_items: OrderItem[]
}

export default function Orders() {
  const { user, loading: authLoading } = useUserAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  const fetchOrders = async () => {
    if (!user) return

    try {
      setIsLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        user_id: user.id, // Filter by user ID
        ...(statusFilter !== "all" && { status: statusFilter }),
        ...(searchTerm && { search: searchTerm }),
      })

      const response = await fetch(`/api/orders?${params}`)
      const data = await response.json()

      if (data.success) {
        setOrders(data.orders)
        setTotalPages(data.pagination.totalPages)
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!authLoading && !user) {
      setIsLoginModalOpen(true)
    }
  }, [authLoading, user])

  useEffect(() => {
    if (user) {
      fetchOrders()
    }
  }, [currentPage, statusFilter, searchTerm, user])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "processing":
        return "bg-purple-100 text-purple-800"
      case "shipped":
        return "bg-indigo-100 text-indigo-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "paid":
        return "bg-green-100 text-green-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
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

  if (authLoading) {
    return (
      <main className="bg-ferrow-cream-400 text-ferrow-green-800 min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 pt-32 pb-20">
          <div className="flex justify-center items-center py-20">
            <div className="relative w-20 h-20">
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-t-ferrow-red-500 border-r-transparent border-b-transparent border-l-transparent"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              />
            </div>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  if (!user) {
    return (
      <>
        <main className="bg-ferrow-cream-400 text-ferrow-green-800 min-h-screen">
          <Navbar />
          <div className="container mx-auto px-4 pt-32 pb-20">
            <motion.div
              className="glass rounded-xl border border-ferrow-yellow-400/30 p-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 glass rounded-full flex items-center justify-center">
                  <FaLock size={32} className="text-ferrow-green-800/50" />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-2">Akses Terbatas</h2>
              <p className="text-ferrow-green-800/70 mb-8">
                Anda perlu masuk atau mendaftar untuk melihat riwayat pesanan.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsLoginModalOpen(true)}
                className="btn btn-primary inline-flex items-center gap-2"
              >
                <span>Masuk / Daftar</span>
              </motion.button>
            </motion.div>
          </div>
          <Footer />
        </main>

        <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} onSuccess={function (): void {
          throw new Error("Function not implemented.")
        } } />
      </>
    )
  }

  return (
    <main className="bg-ferrow-cream-400 text-ferrow-green-800 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 pt-32 pb-20">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold">
              Riwayat <span className="text-gradient">Pesanan</span>
            </h1>
            <div className="text-sm text-ferrow-green-800/60">
              Selamat datang, <span className="font-medium">{user.name}</span>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="glass rounded-xl border border-ferrow-yellow-400/30 p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ferrow-green-800/50" />
                <input
                  type="text"
                  placeholder="Cari berdasarkan nomor pesanan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 glass rounded-lg border border-ferrow-yellow-400/30 focus:border-ferrow-red-500 focus:outline-none transition-colors"
                />
              </div>
              <div className="relative">
                <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ferrow-green-800/50" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-8 py-3 glass rounded-lg border border-ferrow-yellow-400/30 focus:border-ferrow-red-500 focus:outline-none transition-colors appearance-none bg-transparent"
                >
                  <option value="all">Semua Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Dikonfirmasi</option>
                  <option value="processing">Diproses</option>
                  <option value="shipped">Dikirim</option>
                  <option value="delivered">Diterima</option>
                  <option value="cancelled">Dibatalkan</option>
                </select>
              </div>
            </div>
          </div>

          {/* Orders List */}
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="relative w-20 h-20">
                <motion.div
                  className="absolute inset-0 rounded-full border-4 border-t-ferrow-red-500 border-r-transparent border-b-transparent border-l-transparent"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                />
              </div>
            </div>
          ) : orders.length > 0 ? (
            <div className="space-y-6">
              {orders.map((order) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="glass rounded-xl border border-ferrow-yellow-400/30 overflow-hidden"
                >
                  {/* Order Header */}
                  <div className="p-6 border-b border-ferrow-yellow-400/20">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-bold mb-1">{order.order_number}</h3>
                        <div className="flex items-center gap-2 text-sm text-ferrow-green-800/60">
                          <FaCalendarAlt size={12} />
                          <span>{formatDate(order.created_at)}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(
                            order.payment_status,
                          )}`}
                        >
                          {order.payment_status === "paid" ? "Dibayar" : "Belum Dibayar"}
                        </span>
                        <Link href={`/orders/${order.id}`}>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="text-ferrow-red-500 hover:text-ferrow-red-600 transition-colors flex items-center gap-1 text-sm"
                          >
                            <FaEye size={12} />
                            <span>Detail</span>
                          </motion.button>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <FaShoppingBag className="text-ferrow-green-800/60" />
                      <span className="text-sm font-medium">
                        {order.order_items.length} item{order.order_items.length > 1 ? "s" : ""}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      {order.order_items.slice(0, 3).map((item) => (
                        <div key={item.id} className="flex items-center gap-3 p-3 glass rounded-lg">
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={item.product_image_url || "/placeholder.svg"}
                              alt={item.product_name}
                              fill
                              sizes="48px"
                              className="object-contain"
                            />
                          </div>
                          <div className="flex-grow min-w-0">
                            <h4 className="font-medium text-sm truncate">{item.product_name}</h4>
                            <p className="text-xs text-ferrow-green-800/60">
                              {item.quantity}x Rp {item.unit_price.toLocaleString("id-ID")}
                            </p>
                          </div>
                        </div>
                      ))}
                      {order.order_items.length > 3 && (
                        <div className="flex items-center justify-center p-3 glass rounded-lg">
                          <span className="text-sm text-ferrow-green-800/60">
                            +{order.order_items.length - 3} item lainnya
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-ferrow-yellow-400/20">
                      <span className="text-ferrow-green-800/70">Total Pesanan:</span>
                      <span className="text-lg font-bold text-ferrow-red-500">
                        Rp {order.total_amount.toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 glass rounded-lg border border-ferrow-yellow-400/30 hover:bg-ferrow-yellow-400/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Sebelumnya
                  </button>
                  <span className="px-4 py-2 text-sm">
                    Halaman {currentPage} dari {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 glass rounded-lg border border-ferrow-yellow-400/30 hover:bg-ferrow-yellow-400/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Selanjutnya
                  </button>
                </div>
              )}
            </div>
          ) : (
            <motion.div
              className="glass rounded-xl border border-ferrow-yellow-400/30 p-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 glass rounded-full flex items-center justify-center">
                  <FaShoppingBag size={32} className="text-ferrow-green-800/50" />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-2">Belum Ada Pesanan</h2>
              <p className="text-ferrow-green-800/70 mb-8">Anda belum memiliki riwayat pesanan.</p>
              <Link href="/products">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-primary inline-flex items-center gap-2"
                >
                  <span>Mulai Belanja</span>
                  <FaShoppingBag />
                </motion.button>
              </Link>
            </motion.div>
          )}
        </motion.div>
      </div>
      <Footer />
    </main>
  )
}
