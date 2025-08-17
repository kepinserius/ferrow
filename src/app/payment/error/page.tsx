"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { FaTimesCircle, FaSpinner } from "react-icons/fa"
import Link from "next/link"

export default function PaymentError() {
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string>("")

  useEffect(() => {
    const orderId = searchParams.get("order_id")
    const transactionStatus = searchParams.get("transaction_status")
    const statusMessage = searchParams.get("status_message")

    console.log("[v0] Payment error params:", { orderId, transactionStatus, statusMessage })

    let message = "Pembayaran tidak dapat diproses"
    if (statusMessage) {
      message = statusMessage
    } else if (transactionStatus === "deny") {
      message = "Pembayaran ditolak oleh bank atau penyedia layanan"
    } else if (transactionStatus === "cancel") {
      message = "Pembayaran dibatalkan"
    } else if (transactionStatus === "expire") {
      message = "Waktu pembayaran telah habis"
    }

    setErrorMessage(message)
    setLoading(false)
  }, [searchParams])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <motion.div className="text-center" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <FaSpinner className="w-12 h-12 text-red-500 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800">Memproses...</h2>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
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
          <FaTimesCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
        </motion.div>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">Pembayaran Gagal</h1>
        <p className="text-gray-600 mb-6">{errorMessage}</p>

        <div className="bg-yellow-50 rounded-xl p-4 mb-8">
          <h4 className="font-semibold text-yellow-800 mb-2">Apa yang bisa Anda lakukan?</h4>
          <ul className="text-yellow-700 text-sm text-left space-y-1">
            <li>• Periksa kembali informasi kartu atau rekening Anda</li>
            <li>• Pastikan saldo atau limit kartu mencukupi</li>
            <li>• Coba gunakan metode pembayaran lain</li>
            <li>• Hubungi customer service jika masalah berlanjut</li>
          </ul>
        </div>

        <div className="space-y-3">
          <Link href="/checkout">
            <button className="w-full bg-blue-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-600 transition-colors">
              Coba Lagi
            </button>
          </Link>
          <Link href="/cart">
            <button className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-colors">
              Kembali ke Keranjang
            </button>
          </Link>
          <Link href="/">
            <button className="w-full bg-gray-50 text-gray-600 py-3 px-6 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
              Kembali ke Beranda
            </button>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
