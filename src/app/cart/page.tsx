"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { FaTrash, FaArrowLeft, FaShoppingCart, FaPlus, FaMinus } from "react-icons/fa"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { useCart } from "@/context/CartContext"

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, subtotal, shipping, total } = useCart()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  return (
    <main className="bg-ferrow-cream-400 text-ferrow-green-800 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 pt-32 pb-20">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold">
              Keranjang <span className="text-gradient">Belanja</span>
            </h1>
            <Link href="/products">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-[#A53410] hover:text-[#8a2c0d] transition-colors flex items-center gap-2"
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
                  className="absolute inset-0 rounded-full border-4 border-t-ferrow-red-500 border-r-transparent border-b-transparent border-l-transparent"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                />
              </div>
            </div>
          ) : cartItems.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="glass rounded-xl border border-ferrow-yellow-400/30 overflow-hidden">
                  <div className="p-6 border-b border-ferrow-yellow-400/20">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-bold">Item Produk ({cartItems.length})</h2>
                      <span className="text-ferrow-green-800/60 text-sm">Harga</span>
                    </div>
                  </div>
                  <div className="divide-y divide-ferrow-yellow-400/20">
                    {cartItems.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="p-6 flex flex-col md:flex-row items-start md:items-center gap-4"
                      >
                        {/* Product Image */}
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            fill
                            sizes="80px"
                            className="object-contain"
                          />
                          <div className="absolute top-0 right-0 bg-ferrow-red-500 text-xs font-bold px-1.5 py-0.5 rounded-bl-lg text-white">
                            {item.category}
                          </div>
                        </div>
                        {/* Product Info */}
                        <div className="flex-grow">
                          <h3 className="text-lg font-bold">{item.name}</h3>
                          <p className="text-ferrow-green-800/60 text-sm mb-2">{item.description}</p>
                          <div className="flex flex-wrap items-center gap-4">
                            {/* Quantity */}
                            <div className="flex items-center">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-8 h-8 flex items-center justify-center glass rounded-l-lg border border-ferrow-yellow-400/30 hover:bg-ferrow-yellow-400/10 transition-colors"
                              >
                                <FaMinus size={12} />
                              </button>
                              <div className="w-10 h-8 flex items-center justify-center border-y border-ferrow-yellow-400/30 bg-ferrow-cream-400/20">
                                {item.quantity}
                              </div>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-8 flex items-center justify-center glass rounded-r-lg border border-ferrow-yellow-400/30 hover:bg-ferrow-yellow-400/10 transition-colors"
                              >
                                <FaPlus size={12} />
                              </button>
                            </div>
                            {/* Remove Button */}
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => removeFromCart(item.id)}
                              className="text-ferrow-green-800/60 hover:text-ferrow-red-500 transition-colors flex items-center gap-1"
                            >
                              <FaTrash size={14} />
                              <span className="text-sm">Hapus</span>
                            </motion.button>
                          </div>
                        </div>
                        {/* Price */}
                        <div className="text-right flex-shrink-0 mt-2 md:mt-0">
                          <div className="text-lg font-bold text-ferrow-red-500">
                            Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                          </div>
                          <div className="text-ferrow-green-800/60 text-sm">
                            Rp {item.price.toLocaleString("id-ID")} / item
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
              {/* Order Summary */}
              <div className="lg:col-span-1">
                <motion.div
                  className="glass rounded-xl border border-ferrow-yellow-400/30 p-6 sticky top-24"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <FaShoppingCart className="text-ferrow-green-800" />
                    <span>Ringkasan Pesanan</span>
                  </h2>
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-ferrow-green-800/70">Subtotal</span>
                      <span>Rp {subtotal.toLocaleString("id-ID")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ferrow-green-800/70">Pengiriman</span>
                      {shipping > 0 ? (
                        <span>Rp {shipping.toLocaleString("id-ID")}</span>
                      ) : (
                        <span className="text-ferrow-red-500">Gratis</span>
                      )}
                    </div>
                    {shipping === 0 && subtotal > 0 && (
                      <div className="bg-ferrow-red-500/10 text-ferrow-red-500 text-sm rounded-lg p-2 text-center">
                        Anda mendapatkan pengiriman gratis!
                      </div>
                    )}
                    <div className="border-t border-ferrow-yellow-400/20 pt-4 flex justify-between font-bold">
                      <span>Total</span>
                      <span className="text-ferrow-red-500 text-xl">Rp {total.toLocaleString("id-ID")}</span>
                    </div>
                  </div>
                  <Link href="/checkout">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="btn btn-primary w-full py-3 text-lg"
                    >
                      Lanjutkan ke Pembayaran
                    </motion.button>
                  </Link>
                  <div className="mt-4 text-center text-ferrow-green-800/60 text-sm">
                    Dengan melanjutkan, Anda menyetujui{" "}
                    <Link href="/terms" className="text-ferrow-red-500 hover:underline">
                      Syarat & Ketentuan
                    </Link>{" "}
                    kami.
                  </div>
                </motion.div>
              </div>
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
                  <FaShoppingCart size={32} className="text-ferrow-green-800/50" />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-2">Keranjang Belanja Kosong</h2>
              <p className="text-ferrow-green-800/70 mb-8">
                Anda belum menambahkan produk apapun ke keranjang belanja.
              </p>
              <Link href="/products">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-primary inline-flex items-center gap-2"
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
