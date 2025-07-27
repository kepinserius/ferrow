"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { FaClock, FaHome, FaReceipt } from "react-icons/fa"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { useSearchParams } from "next/navigation"

export default function PaymentPending() {
  const searchParams = useSearchParams()
  const [orderData, setOrderData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const orderId = searchParams.get("order_id")
    const statusCode = searchParams.get("status_code")
    const transactionStatus = searchParams.get("transaction_status")

    setTimeout(() => {
      setOrderData({
        order_id: orderId,
        status_code: statusCode,
        transaction_status: transactionStatus,
        order_number: `ORD-${Date.now()}`,
        total_amount: 150000,
      })
      setIsLoading(false)
    }, 1000)
  }, [searchParams])

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

  return (
    <main className="bg-ferrow-cream-400 text-ferrow-green-800 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 pt-32 pb-20">
        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="glass rounded-xl border border-ferrow-yellow-400/30 p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex justify-center mb-6"
            >
              <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center">
                <FaClock size={40} className="text-white" />
              </div>
            </motion.div>

            <h1 className="text-3xl font-bold mb-4 text-yellow-600">Pembayaran Tertunda</h1>

            <p className="text-ferrow-green-800/70 mb-6">
              Pembayaran Anda sedang diproses. Silakan tunggu konfirmasi atau selesaikan pembayaran sesuai instruksi
              yang diberikan.
            </p>

            {orderData && (
              <div className="bg-ferrow-cream-400/50 rounded-lg p-4 mb-6 text-left">
                <h3 className="font-bold mb-3">Detail Pesanan:</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Nomor Pesanan:</span>
                    <span className="font-mono">{orderData.order_number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status Transaksi:</span>
                    <span className="capitalize text-yellow-600 font-medium">{orderData.transaction_status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Pembayaran:</span>
                    <span className="font-bold text-ferrow-red-500">
                      Rp {orderData.total_amount?.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-yellow-800 text-sm">
                <strong>Catatan:</strong> Jika Anda menggunakan transfer bank atau e-wallet, silakan selesaikan
                pembayaran sesuai instruksi yang telah diberikan. Status pesanan akan diperbarui secara otomatis setelah
                pembayaran dikonfirmasi.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-primary flex items-center gap-2"
                >
                  <FaHome />
                  <span>Kembali ke Beranda</span>
                </motion.button>
              </Link>

              <Link href="/orders">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="glass border border-ferrow-yellow-400/30 px-6 py-3 rounded-lg hover:bg-ferrow-yellow-400/10 transition-colors flex items-center gap-2"
                >
                  <FaReceipt />
                  <span>Lihat Pesanan</span>
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </main>
  )
}
