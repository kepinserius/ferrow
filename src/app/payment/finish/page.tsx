"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { FaCheckCircle, FaSpinner, FaExclamationTriangle } from "react-icons/fa"
import Link from "next/link"

interface OrderDetails {
  order_number: string
  total_amount: number
  customer_name: string
  customer_email: string
  payment_status: string
  transaction_id: string
  payment_method: string
}

export default function PaymentFinish() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const orderId = searchParams.get("order_id")
        const transactionStatus = searchParams.get("transaction_status")
        const transactionId = searchParams.get("transaction_id")
        const statusCode = searchParams.get("status_code")

        console.log("[v0] Payment finish params:", { orderId, transactionStatus, transactionId, statusCode })

        if (!orderId) {
          throw new Error("Order ID tidak ditemukan")
        }

        const response = await fetch("/api/payment/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            order_id: orderId,
            transaction_status: transactionStatus,
            transaction_id: transactionId,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Gagal memverifikasi pembayaran")
        }

        const data = await response.json()
        console.log("[v0] Payment verification result:", data)

        setOrderDetails(data.order)
      } catch (err: any) {
        console.error("[v0] Payment verification error:", err.message)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    verifyPayment()
  }, [searchParams])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <motion.div className="text-center" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <FaSpinner className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800">Memverifikasi Pembayaran...</h2>
          <p className="text-gray-600 mt-2">Mohon tunggu sebentar</p>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <FaExclamationTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Terjadi Kesalahan</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <Link href="/cart">
              <button className="w-full bg-blue-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-600 transition-colors">
                Kembali ke Keranjang
              </button>
            </Link>
            <Link href="/">
              <button className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-colors">
                Kembali ke Beranda
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <motion.div
        className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <FaCheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Pembayaran Berhasil!</h1>
          <p className="text-gray-600">Terima kasih atas pembelian Anda</p>
        </div>

        {orderDetails && (
          <div className="space-y-4 mb-8">
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Detail Pesanan</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Nomor Pesanan:</span>
                  <span className="font-semibold">{orderDetails.order_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Pembayaran:</span>
                  <span className="font-bold text-green-600">
                    Rp {orderDetails.total_amount.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-semibold text-green-600 capitalize">{orderDetails.payment_status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ID Transaksi:</span>
                  <span className="font-mono text-xs">{orderDetails.transaction_id}</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Informasi Selanjutnya</h4>
              <p className="text-blue-700 text-sm">
                Konfirmasi pesanan telah dikirim ke email <strong>{orderDetails.customer_email}</strong>. Pesanan Anda
                akan segera diproses dan dikirim sesuai alamat yang telah ditentukan.
              </p>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <Link href="/orders">
            <button className="w-full bg-blue-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-600 transition-colors">
              Lihat Pesanan Saya
            </button>
          </Link>
          <Link href="/">
            <button className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-colors">
              Lanjut Belanja
            </button>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
