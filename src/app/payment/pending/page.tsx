"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { FaClock, FaSpinner, FaInfoCircle } from "react-icons/fa"
import Link from "next/link"

export default function PaymentPending() {
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [orderDetails, setOrderDetails] = useState<any>(null)

  useEffect(() => {
    const orderId = searchParams.get("order_id")
    const transactionStatus = searchParams.get("transaction_status")
    const paymentType = searchParams.get("payment_type")

    console.log("[v0] Payment pending params:", { orderId, transactionStatus, paymentType })

    setOrderDetails({
      order_id: orderId,
      transaction_status: transactionStatus,
      payment_type: paymentType,
    })
    setLoading(false)
  }, [searchParams])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center">
        <motion.div className="text-center" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <FaSpinner className="w-12 h-12 text-yellow-500 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800">Memproses...</h2>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center p-4">
      <motion.div
        className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <FaClock className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
        </motion.div>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">Pembayaran Pending</h1>
        <p className="text-gray-600 mb-6">Pembayaran Anda sedang diproses</p>

        {orderDetails && (
          <div className="bg-yellow-50 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <FaInfoCircle className="text-yellow-600" />
              <h4 className="font-semibold text-yellow-800">Informasi Pembayaran</h4>
            </div>
            <div className="space-y-2 text-sm text-left">
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-semibold">{orderDetails.order_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-semibold text-yellow-600 capitalize">{orderDetails.transaction_status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Metode:</span>
                <span className="font-semibold capitalize">{orderDetails.payment_type}</span>
              </div>
            </div>
          </div>
        )}

        <div className="bg-blue-50 rounded-xl p-4 mb-8">
          <h4 className="font-semibold text-blue-800 mb-2">Langkah Selanjutnya</h4>
          <ul className="text-blue-700 text-sm text-left space-y-1">
            <li>• Selesaikan pembayaran sesuai instruksi yang diberikan</li>
            <li>• Pembayaran akan dikonfirmasi otomatis setelah berhasil</li>
            <li>• Anda akan menerima email konfirmasi</li>
            <li>• Periksa status pesanan secara berkala</li>
          </ul>
        </div>

        <div className="space-y-3">
          <Link href="/orders">
            <button className="w-full bg-blue-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-600 transition-colors">
              Cek Status Pesanan
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
