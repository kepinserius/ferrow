"use client"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { FaTrash, FaArrowLeft, FaShoppingCart, FaPlus, FaMinus, FaShieldAlt, FaTruck } from "react-icons/fa"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { useCart } from "@/context/CartContext"

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, subTotal, shipping, total } = useCart()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  return (
    <main className="bg-ferrow-cream-400 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 pt-32 pb-20">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-ferrow-green-800 mb-2">
                Keranjang <span className="text-ferrow-green-600">Belanja</span>
              </h1>
              <p className="text-ferrow-green-700">
                {cartItems.length > 0 ? `${cartItems.length} item dalam keranjang` : "Keranjang belanja Anda"}
              </p>
            </div>
            <Link href="/products">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm text-ferrow-green-800 font-semibold rounded-xl border border-ferrow-yellow-400/30 hover:border-ferrow-yellow-400 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <FaArrowLeft />
                <span>Lanjutkan Belanja</span>
              </motion.button>
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="relative w-20 h-20">
                <motion.div
                  className="absolute inset-0 rounded-full border-4 border-t-ferrow-green-500 border-r-transparent border-b-transparent border-l-transparent"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                />
              </div>
            </div>
          ) : cartItems.length > 0 ? (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="xl:col-span-2">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-ferrow-yellow-400/20 shadow-xl overflow-hidden">
                  {/* Header */}
                  <div className="px-8 py-6 border-b border-ferrow-yellow-400/20 bg-ferrow-yellow-400/5">
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-bold text-ferrow-green-800">Produk Pilihan ({cartItems.length})</h2>
                      <div className="text-ferrow-green-700 text-sm font-medium">Total Harga</div>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="divide-y divide-ferrow-yellow-400/10">
                    {cartItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="p-8 hover:bg-ferrow-yellow-400/5 transition-colors duration-300"
                      >
                        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                          {/* Product Image */}
                          <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 shadow-lg">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              fill
                              sizes="96px"
                              className="object-cover"
                            />
                            <div className="absolute -top-2 -right-2 bg-ferrow-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                              {item.category}
                            </div>
                          </div>

                          {/* Product Info */}
                          <div className="flex-grow min-w-0">
                            <h3 className="text-xl font-bold text-ferrow-green-800 mb-2">{item.name}</h3>
                            <p className="text-ferrow-green-700 text-sm mb-4 line-clamp-2">{item.description}</p>

                            <div className="flex flex-wrap items-center gap-4">
                              {/* Quantity Controls */}
                              <div className="flex items-center bg-white rounded-xl border border-ferrow-yellow-400/30 shadow-sm">
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="w-10 h-10 flex items-center justify-center text-ferrow-green-800 hover:bg-ferrow-yellow-400/10 rounded-l-xl transition-colors"
                                >
                                  <FaMinus size={12} />
                                </button>
                                <div className="w-12 h-10 flex items-center justify-center border-x border-ferrow-yellow-400/20 font-semibold text-ferrow-green-800">
                                  {item.quantity}
                                </div>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="w-10 h-10 flex items-center justify-center text-ferrow-green-800 hover:bg-ferrow-yellow-400/10 rounded-r-xl transition-colors"
                                >
                                  <FaPlus size={12} />
                                </button>
                              </div>

                              {/* Remove Button */}
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => removeFromCart(item.id)}
                                className="inline-flex items-center gap-2 px-4 py-2 text-ferrow-green-700 hover:text-ferrow-red-500 hover:bg-ferrow-red-500/10 rounded-lg transition-all duration-300"
                              >
                                <FaTrash size={14} />
                                <span className="text-sm font-medium">Hapus</span>
                              </motion.button>
                            </div>
                          </div>

                          {/* Price */}
                          <div className="text-right flex-shrink-0">
                            <div className="text-2xl font-bold text-ferrow-green-800 mb-1">
                              Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                            </div>
                            <div className="text-ferrow-green-600 text-sm">
                              Rp {item.price.toLocaleString("id-ID")} × {item.quantity}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="xl:col-span-1">
                <motion.div
                  className="bg-white/90 backdrop-blur-sm rounded-2xl border border-ferrow-yellow-400/20 shadow-xl overflow-hidden sticky top-24"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  {/* Header */}
                  <div className="px-6 py-5 border-b border-ferrow-yellow-400/20 bg-ferrow-yellow-400/5">
                    <h2 className="text-xl font-bold text-ferrow-green-800 flex items-center gap-3">
                      <div className="w-8 h-8 bg-ferrow-green-500/20 rounded-full flex items-center justify-center">
                        <FaShoppingCart className="w-4 h-4 text-ferrow-green-600" />
                      </div>
                      Ringkasan Pesanan
                    </h2>
                  </div>

                  <div className="p-6">
                    {/* Price Breakdown */}
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between items-center">
                        <span className="text-ferrow-green-700">Subtotal ({cartItems.length} item)</span>
                        <span className="font-semibold text-ferrow-green-800">
                          Rp {subTotal.toLocaleString("id-ID")}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <FaTruck className="w-4 h-4 text-ferrow-green-600" />
                          <span className="text-ferrow-green-700">Pengiriman</span>
                        </div>
                        {shipping > 0 ? (
                          <span className="font-semibold text-ferrow-green-800">
                            Rp {shipping.toLocaleString("id-ID")}
                          </span>
                        ) : (
                          <span className="font-semibold text-ferrow-green-500">Gratis</span>
                        )}
                      </div>

                      {shipping === 0 && subTotal > 0 && (
                        <div className="bg-ferrow-green-500/10 border border-ferrow-green-500/20 text-ferrow-green-700 text-sm rounded-xl p-3 flex items-center gap-2">
                          <FaShieldAlt className="w-4 h-4" />
                          <span>Selamat! Anda mendapatkan pengiriman gratis</span>
                        </div>
                      )}

                      <div className="border-t border-ferrow-yellow-400/20 pt-4">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-ferrow-green-800">Total Pembayaran</span>
                          <span className="text-2xl font-bold text-ferrow-green-800">
                            Rp {total.toLocaleString("id-ID")}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Checkout Button */}
                    <Link href="/checkout">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-4 px-6 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                        style={{ backgroundColor: "#333A2D" }}
                      >
                        Lanjutkan ke Pembayaran
                      </motion.button>
                    </Link>

                    {/* Security Notice */}
                    <div className="mt-4 p-4 bg-ferrow-yellow-400/10 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <FaShieldAlt className="w-4 h-4 text-ferrow-green-600" />
                        <span className="text-sm font-semibold text-ferrow-green-800">Pembayaran Aman</span>
                      </div>
                      <p className="text-xs text-ferrow-green-700 leading-relaxed">
                        Dengan melanjutkan, Anda menyetujui{" "}
                        <Link href="/terms" className="text-ferrow-green-600 hover:underline font-medium">
                          Syarat & Ketentuan
                        </Link>{" "}
                        kami.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          ) : (
            /* Empty Cart */
            <motion.div
              className="bg-white/90 backdrop-blur-sm rounded-2xl border border-ferrow-yellow-400/20 shadow-xl p-12 text-center max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex justify-center mb-8">
                <div className="w-24 h-24 bg-ferrow-yellow-400/20 rounded-full flex items-center justify-center">
                  <FaShoppingCart size={40} className="text-ferrow-green-600" />
                </div>
              </div>

              <h2 className="text-3xl font-bold text-ferrow-green-800 mb-4">Keranjang Belanja Kosong</h2>
              <p className="text-ferrow-green-700 text-lg mb-8 leading-relaxed">
                Anda belum menambahkan produk apapun ke keranjang belanja. Mari jelajahi koleksi makanan premium untuk
                hewan kesayangan Anda.
              </p>

              <Link href="/products">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-3 px-8 py-4 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  style={{ backgroundColor: "#333A2D" }}
                >
                  <span>Jelajahi Produk</span>
                  <FaArrowLeft className="rotate-180" />
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
