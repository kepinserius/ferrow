"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { useParams } from "next/navigation"
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaUser,
  FaMapMarkerAlt,
  FaShoppingBag,
  FaCreditCard,
  FaTruck,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

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
  customer_phone: string
  shipping_address: string
  shipping_city: string
  shipping_city_id?: number
  shipping_province: string
  shipping_province_id?: number
  shipping_postal_code: string
  courier?: string
  service?: string
  estimated_delivery?: string
  payment_method?: string
  subtotal: number
  shipping_cost: number
  total_amount: number
  status: string
  payment_status: string
  tracking_number?: string
  notes?: string
  created_at: string
  updated_at: string
  paid_at?: string
  order_items: OrderItem[]
}

export default function OrderDetail() {
  const params = useParams()
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${params.id}`)
        const data = await response.json()

        if (data.success) {
          setOrder(data.order)
        }
      } catch (error) {
        console.error("Error fetching order:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchOrder()
    }
  }, [params.id])

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

  if (isLoading) {
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

  if (!order) {
    return (
      <main className="bg-ferrow-cream-400 text-ferrow-green-800 min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 pt-32 pb-20">
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold mb-4">Pesanan Tidak Ditemukan</h1>
            <Link href="/orders">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn btn-primary">
                Kembali ke Riwayat Pesanan
              </motion.button>
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="bg-ferrow-cream-400 text-ferrow-green-800 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 pt-32 pb-20">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold">
              Detail <span className="text-gradient">Pesanan</span>
            </h1>
            <Link href="/orders">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-ferrow-red-500 hover:text-ferrow-red-600 transition-colors flex items-center gap-2"
              >
                <FaArrowLeft />
                <span>Kembali</span>
              </motion.button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Header */}
              <motion.div
                className="glass rounded-xl border border-ferrow-yellow-400/30 p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{order.order_number}</h2>
                    <div className="flex items-center gap-2 text-sm text-ferrow-green-800/60">
                      <FaCalendarAlt size={12} />
                      <span>Dibuat: {formatDate(order.created_at)}</span>
                    </div>
                    {order.paid_at && (
                      <div className="flex items-center gap-2 text-sm text-ferrow-green-800/60 mt-1">
                        <FaCreditCard size={12} />
                        <span>Dibayar: {formatDate(order.paid_at)}</span>
                      </div>
                    )}
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
                  </div>
                </div>

                {/* Shipping Info */}
                {(order.courier || order.service || order.estimated_delivery) && (
                  <div className="bg-ferrow-cream-400/50 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FaTruck className="text-ferrow-green-800" />
                      <span className="font-medium">Informasi Pengiriman:</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                      {order.courier && (
                        <div>
                          <span className="text-ferrow-green-800/60">Kurir: </span>
                          <span className="font-medium">{order.courier}</span>
                        </div>
                      )}
                      {order.service && (
                        <div>
                          <span className="text-ferrow-green-800/60">Layanan: </span>
                          <span className="font-medium">{order.service}</span>
                        </div>
                      )}
                      {order.estimated_delivery && (
                        <div>
                          <span className="text-ferrow-green-800/60">Estimasi: </span>
                          <span className="font-medium">{order.estimated_delivery}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {order.tracking_number && (
                  <div className="bg-ferrow-cream-400/50 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FaTruck className="text-ferrow-green-800" />
                      <span className="font-medium">Nomor Resi:</span>
                    </div>
                    <span className="font-mono text-lg">{order.tracking_number}</span>
                  </div>
                )}

                {order.payment_method && (
                  <div className="bg-ferrow-cream-400/50 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FaCreditCard className="text-ferrow-green-800" />
                      <span className="font-medium">Metode Pembayaran:</span>
                    </div>
                    <span className="font-medium capitalize">{order.payment_method}</span>
                  </div>
                )}

                {order.notes && (
                  <div className="bg-ferrow-cream-400/50 rounded-lg p-4">
                    <h4 className="font-medium mb-2">Catatan:</h4>
                    <p className="text-sm">{order.notes}</p>
                  </div>
                )}
              </motion.div>

              {/* Customer Information */}
              <motion.div
                className="glass rounded-xl border border-ferrow-yellow-400/30 p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <FaUser className="text-ferrow-green-800" />
                  <span>Informasi Pelanggan</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-ferrow-green-800/70 mb-1">Nama</label>
                    <p className="font-medium">{order.customer_name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ferrow-green-800/70 mb-1">Email</label>
                    <div className="flex items-center gap-2">
                      <FaEnvelope size={12} className="text-ferrow-green-800/60" />
                      <p className="font-medium">{order.customer_email}</p>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-ferrow-green-800/70 mb-1">Telepon</label>
                    <div className="flex items-center gap-2">
                      <FaPhone size={12} className="text-ferrow-green-800/60" />
                      <p className="font-medium">{order.customer_phone}</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Shipping Information */}
              <motion.div
                className="glass rounded-xl border border-ferrow-yellow-400/30 p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-ferrow-green-800" />
                  <span>Alamat Pengiriman</span>
                </h3>
                <div className="space-y-2">
                  <p className="font-medium">{order.shipping_address}</p>
                  <p className="text-ferrow-green-800/70">
                    {order.shipping_city}, {order.shipping_province} {order.shipping_postal_code}
                  </p>
                  {(order.shipping_city_id || order.shipping_province_id) && (
                    <div className="text-sm text-ferrow-green-800/60">
                      {order.shipping_city_id && <span>ID Kota: {order.shipping_city_id} </span>}
                      {order.shipping_province_id && <span>ID Provinsi: {order.shipping_province_id}</span>}
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Order Items */}
              <motion.div
                className="glass rounded-xl border border-ferrow-yellow-400/30 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <div className="p-6 border-b border-ferrow-yellow-400/20">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <FaShoppingBag className="text-ferrow-green-800" />
                    <span>Item Pesanan ({order.order_items.length})</span>
                  </h3>
                </div>
                <div className="divide-y divide-ferrow-yellow-400/20">
                  {order.order_items.map((item) => (
                    <div key={item.id} className="p-6 flex items-center gap-4">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.product_image_url || "/placeholder.svg"}
                          alt={item.product_name}
                          fill
                          sizes="64px"
                          className="object-contain"
                        />
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-bold text-lg">{item.product_name}</h4>
                        <p className="text-ferrow-green-800/60 text-sm">Kode: {item.product_code}</p>
                        <p className="text-ferrow-green-800/60 text-sm">
                          {item.quantity}x Rp {item.unit_price.toLocaleString("id-ID")}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-ferrow-red-500">
                          Rp {item.total_price.toLocaleString("id-ID")}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                className="glass rounded-xl border border-ferrow-yellow-400/30 p-6 sticky top-24"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <h3 className="text-xl font-bold mb-6">Ringkasan Pesanan</h3>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-ferrow-green-800/70">Subtotal</span>
                    <span>Rp {order.subtotal.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ferrow-green-800/70">Pengiriman</span>
                    {order.shipping_cost > 0 ? (
                      <span>Rp {order.shipping_cost.toLocaleString("id-ID")}</span>
                    ) : (
                      <span className="text-ferrow-red-500">Gratis</span>
                    )}
                  </div>
                  <div className="border-t border-ferrow-yellow-400/20 pt-4 flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-ferrow-red-500 text-xl">Rp {order.total_amount.toLocaleString("id-ID")}</span>
                  </div>
                </div>

                {order.payment_status === "pending" && (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="btn btn-primary w-full py-3 text-lg mb-4"
                    onClick={() => {
                      // Implement payment retry logic
                      alert("Fitur pembayaran ulang akan segera tersedia")
                    }}
                  >
                    Bayar Sekarang
                  </motion.button>
                )}

                <div className="text-center text-ferrow-green-800/60 text-sm">
                  Butuh bantuan?{" "}
                  <Link href="/contact" className="text-ferrow-red-500 hover:underline">
                    Hubungi kami
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </main>
  )
}
