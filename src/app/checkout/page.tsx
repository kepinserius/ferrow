"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { FaArrowLeft, FaShoppingCart, FaUser, FaMapMarkerAlt, FaCreditCard, FaTruck } from "react-icons/fa"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import LoginModal from "@/components/LoginModal"
import { useCart } from "@/context/CartContext"
import { useUserAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"

interface CustomerData {
  name: string
  email: string
  phone: string
  address: string
  city: string
  cityId: string
  province: string
  provinceId: string
  postalCode: string
}

interface ShippingOption {
  courier: string
  service: string
  cost: number
  estimatedDelivery: string
}

export default function Checkout() {
  const { cartItems, subtotal, clearCart } = useCart()
  const { user, loading: authLoading } = useUserAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [customerData, setCustomerData] = useState<CustomerData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    cityId: "",
    province: "",
    provinceId: "",
    postalCode: "",
  })
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null)
  const [paymentMethod, setPaymentMethod] = useState("midtrans")

  // Mock shipping options
  const shippingOptions: ShippingOption[] = [
    {
      courier: "JNE",
      service: "REG",
      cost: 15000,
      estimatedDelivery: "2-3 hari",
    },
    {
      courier: "JNE",
      service: "YES",
      cost: 25000,
      estimatedDelivery: "1-2 hari",
    },
    {
      courier: "TIKI",
      service: "REG",
      cost: 12000,
      estimatedDelivery: "2-4 hari",
    },
    {
      courier: "POS",
      service: "Nextday",
      cost: 20000,
      estimatedDelivery: "1 hari",
    },
  ]

  // Redirect if no cart items
  useEffect(() => {
    if (cartItems.length === 0) {
      router.push("/cart")
    }
  }, [cartItems, router])

  // Auto-fill customer data if user is logged in
  useEffect(() => {
    if (user && !customerData.name && !customerData.email) {
      setCustomerData((prev) => ({
        ...prev,
        name: user.name,
        email: user.email,
      }))
    }
  }, [user, customerData.name, customerData.email])

  // Set default shipping option
  useEffect(() => {
    if (shippingOptions.length > 0 && !selectedShipping) {
      setSelectedShipping(shippingOptions[0])
    }
  }, [shippingOptions, selectedShipping])

  // Show login modal if user is not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      setIsLoginModalOpen(true)
    }
  }, [authLoading, user])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!customerData.name.trim()) {
      newErrors.name = "Nama lengkap wajib diisi"
    }

    if (!customerData.email.trim()) {
      newErrors.email = "Email wajib diisi"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerData.email)) {
      newErrors.email = "Format email tidak valid"
    }

    if (!customerData.phone.trim()) {
      newErrors.phone = "Nomor telepon wajib diisi"
    } else if (!/^[0-9+\-\s()]+$/.test(customerData.phone)) {
      newErrors.phone = "Format nomor telepon tidak valid"
    }

    if (!customerData.address.trim()) {
      newErrors.address = "Alamat lengkap wajib diisi"
    }

    if (!customerData.city.trim()) {
      newErrors.city = "Kota wajib diisi"
    }

    if (!customerData.province.trim()) {
      newErrors.province = "Provinsi wajib diisi"
    }

    if (!customerData.postalCode.trim()) {
      newErrors.postalCode = "Kode pos wajib diisi"
    } else if (!/^[0-9]{5}$/.test(customerData.postalCode)) {
      newErrors.postalCode = "Kode pos harus 5 digit angka"
    }

    if (customerData.cityId && !/^[0-9]+$/.test(customerData.cityId)) {
      newErrors.cityId = "ID Kota harus berupa angka"
    }

    if (customerData.provinceId && !/^[0-9]+$/.test(customerData.provinceId)) {
      newErrors.provinceId = "ID Provinsi harus berupa angka"
    }

    if (!selectedShipping) {
      newErrors.shipping = "Pilih metode pengiriman"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setCustomerData((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const handleShippingChange = (option: ShippingOption) => {
    setSelectedShipping(option)
    if (errors.shipping) {
      setErrors((prev) => ({
        ...prev,
        shipping: "",
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      setIsLoginModalOpen(true)
      return
    }

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Create order with user ID
      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.id, // Add user ID to order
          customer_name: customerData.name.trim(),
          customer_email: customerData.email.trim(),
          customer_phone: customerData.phone.trim(),
          shipping_address: customerData.address.trim(),
          shipping_city: customerData.city.trim(),
          shipping_city_id: customerData.cityId ? Number.parseInt(customerData.cityId) : null,
          shipping_province: customerData.province.trim(),
          shipping_province_id: customerData.provinceId ? Number.parseInt(customerData.provinceId) : null,
          shipping_postal_code: customerData.postalCode.trim(),
          courier: selectedShipping?.courier,
          service: selectedShipping?.service,
          estimated_delivery: selectedShipping?.estimatedDelivery,
          payment_method: paymentMethod,
          items: cartItems,
          subtotal,
          shipping_cost: selectedShipping?.cost || 0,
          total_amount: subtotal + (selectedShipping?.cost || 0),
        }),
      })

      if (!orderResponse.ok) {
        const errorText = await orderResponse.text()
        console.error("Order API Error Response:", errorText)

        let errorMessage = "Failed to create order"
        try {
          const errorData = JSON.parse(errorText)
          errorMessage = errorData.error || errorMessage
        } catch (parseError) {
          errorMessage = `Server error: ${orderResponse.status} ${orderResponse.statusText}`
        }

        throw new Error(errorMessage)
      }

      let orderData
      try {
        const orderText = await orderResponse.text()
        orderData = JSON.parse(orderText)
      } catch (parseError) {
        console.error("Failed to parse order response")
        throw new Error("Invalid response from order API")
      }

      console.log("Order created successfully:", orderData)

      // Create payment transaction
      const paymentResponse = await fetch("/api/payment/create-transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order_id: orderData.order_id,
        }),
      })

      if (!paymentResponse.ok) {
        const errorText = await paymentResponse.text()
        console.error("Payment API Error Response:", errorText)

        let errorMessage = "Failed to create payment transaction"
        try {
          const errorData = JSON.parse(errorText)
          errorMessage = errorData.error || errorMessage
        } catch (parseError) {
          errorMessage = `Payment server error: ${paymentResponse.status} ${paymentResponse.statusText}`
        }

        throw new Error(errorMessage)
      }

      let paymentData
      try {
        const paymentText = await paymentResponse.text()
        console.log("Payment API Raw Response:", paymentText)
        paymentData = JSON.parse(paymentText)
      } catch (parseError) {
        console.error("Failed to parse payment response")
        throw new Error("Invalid response from payment API")
      }

      console.log("Payment data:", paymentData)

      if (!paymentData.redirect_url) {
        throw new Error("Payment redirect URL not found")
      }

      // Clear cart and redirect to payment
      clearCart()
      window.location.href = paymentData.redirect_url
    } catch (error: any) {
      console.error("Error processing checkout:", error)
      alert(`Terjadi kesalahan: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const isFormValid =
    user &&
    customerData.name.trim() &&
    customerData.email.trim() &&
    customerData.phone.trim() &&
    customerData.address.trim() &&
    customerData.city.trim() &&
    customerData.province.trim() &&
    customerData.postalCode.trim() &&
    selectedShipping &&
    Object.keys(errors).length === 0

  const total = subtotal + (selectedShipping?.cost || 0)

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

  if (cartItems.length === 0) {
    return null
  }

  return (
    <>
      <main className="bg-ferrow-cream-400 text-ferrow-green-800 min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 pt-32 pb-20">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl md:text-4xl font-display font-bold">
                <span className="text-gradient">Checkout</span>
              </h1>
              <Link href="/cart">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-ferrow-red-500 hover:text-ferrow-red-600 transition-colors flex items-center gap-2"
                >
                  <FaArrowLeft />
                  <span>Kembali ke Keranjang</span>
                </motion.button>
              </Link>
            </div>

            {!user && (
              <motion.div
                className="glass rounded-xl border border-ferrow-yellow-400/30 p-6 mb-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h3 className="text-lg font-bold mb-2">Silakan Masuk Terlebih Dahulu</h3>
                <p className="text-ferrow-green-800/70 mb-4">
                  Anda perlu masuk atau mendaftar untuk melanjutkan checkout
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsLoginModalOpen(true)}
                  className="btn btn-primary"
                >
                  Masuk / Daftar
                </motion.button>
              </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Checkout Form */}
              <div className="lg:col-span-2">
                <form onSubmit={handleSubmit}>
                  {/* Customer Information */}
                  <motion.div
                    className="glass rounded-xl border border-ferrow-yellow-400/30 p-6 mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                      <FaUser className="text-ferrow-green-800" />
                      <span>Informasi Pelanggan</span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Nama Lengkap *</label>
                        <input
                          type="text"
                          name="name"
                          value={customerData.name}
                          onChange={handleInputChange}
                          disabled={!user}
                          className={`w-full px-4 py-3 glass rounded-lg border transition-colors ${
                            errors.name
                              ? "border-red-500 focus:border-red-500"
                              : "border-ferrow-yellow-400/30 focus:border-ferrow-red-500"
                          } focus:outline-none ${!user ? "opacity-50 cursor-not-allowed" : ""}`}
                          required
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Email *</label>
                        <input
                          type="email"
                          name="email"
                          value={customerData.email}
                          onChange={handleInputChange}
                          disabled={!user}
                          className={`w-full px-4 py-3 glass rounded-lg border transition-colors ${
                            errors.email
                              ? "border-red-500 focus:border-red-500"
                              : "border-ferrow-yellow-400/30 focus:border-ferrow-red-500"
                          } focus:outline-none ${!user ? "opacity-50 cursor-not-allowed" : ""}`}
                          required
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-2">Nomor Telepon *</label>
                        <input
                          type="tel"
                          name="phone"
                          value={customerData.phone}
                          onChange={handleInputChange}
                          disabled={!user}
                          className={`w-full px-4 py-3 glass rounded-lg border transition-colors ${
                            errors.phone
                              ? "border-red-500 focus:border-red-500"
                              : "border-ferrow-yellow-400/30 focus:border-ferrow-red-500"
                          } focus:outline-none ${!user ? "opacity-50 cursor-not-allowed" : ""}`}
                          placeholder="Contoh: 081234567890"
                          required
                        />
                        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                      </div>
                    </div>
                  </motion.div>

                  {/* Shipping Information */}
                  <motion.div
                    className="glass rounded-xl border border-ferrow-yellow-400/30 p-6 mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                  >
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                      <FaMapMarkerAlt className="text-ferrow-green-800" />
                      <span>Alamat Pengiriman</span>
                    </h2>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Alamat Lengkap *</label>
                        <textarea
                          name="address"
                          value={customerData.address}
                          onChange={handleInputChange}
                          disabled={!user}
                          rows={3}
                          className={`w-full px-4 py-3 glass rounded-lg border transition-colors resize-none ${
                            errors.address
                              ? "border-red-500 focus:border-red-500"
                              : "border-ferrow-yellow-400/30 focus:border-ferrow-red-500"
                          } focus:outline-none ${!user ? "opacity-50 cursor-not-allowed" : ""}`}
                          placeholder="Jalan, nomor rumah, RT/RW, kelurahan, kecamatan"
                          required
                        />
                        {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Provinsi *</label>
                          <input
                            type="text"
                            name="province"
                            value={customerData.province}
                            onChange={handleInputChange}
                            disabled={!user}
                            className={`w-full px-4 py-3 glass rounded-lg border transition-colors ${
                              errors.province
                                ? "border-red-500 focus:border-red-500"
                                : "border-ferrow-yellow-400/30 focus:border-ferrow-red-500"
                            } focus:outline-none ${!user ? "opacity-50 cursor-not-allowed" : ""}`}
                            placeholder="Contoh: Jawa Timur"
                            required
                          />
                          {errors.province && <p className="text-red-500 text-sm mt-1">{errors.province}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">ID Provinsi</label>
                          <input
                            type="number"
                            name="provinceId"
                            value={customerData.provinceId}
                            onChange={handleInputChange}
                            disabled={!user}
                            className={`w-full px-4 py-3 glass rounded-lg border transition-colors ${
                              errors.provinceId
                                ? "border-red-500 focus:border-red-500"
                                : "border-ferrow-yellow-400/30 focus:border-ferrow-red-500"
                            } focus:outline-none ${!user ? "opacity-50 cursor-not-allowed" : ""}`}
                            placeholder="Opsional (untuk ongkir)"
                          />
                          {errors.provinceId && <p className="text-red-500 text-sm mt-1">{errors.provinceId}</p>}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Kota *</label>
                          <input
                            type="text"
                            name="city"
                            value={customerData.city}
                            onChange={handleInputChange}
                            disabled={!user}
                            className={`w-full px-4 py-3 glass rounded-lg border transition-colors ${
                              errors.city
                                ? "border-red-500 focus:border-red-500"
                                : "border-ferrow-yellow-400/30 focus:border-ferrow-red-500"
                            } focus:outline-none ${!user ? "opacity-50 cursor-not-allowed" : ""}`}
                            placeholder="Contoh: Malang"
                            required
                          />
                          {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">ID Kota</label>
                          <input
                            type="number"
                            name="cityId"
                            value={customerData.cityId}
                            onChange={handleInputChange}
                            disabled={!user}
                            className={`w-full px-4 py-3 glass rounded-lg border transition-colors ${
                              errors.cityId
                                ? "border-red-500 focus:border-red-500"
                                : "border-ferrow-yellow-400/30 focus:border-ferrow-red-500"
                            } focus:outline-none ${!user ? "opacity-50 cursor-not-allowed" : ""}`}
                            placeholder="Opsional (untuk ongkir)"
                          />
                          {errors.cityId && <p className="text-red-500 text-sm mt-1">{errors.cityId}</p>}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Kode Pos *</label>
                        <input
                          type="text"
                          name="postalCode"
                          value={customerData.postalCode}
                          onChange={handleInputChange}
                          disabled={!user}
                          className={`w-full px-4 py-3 glass rounded-lg border transition-colors ${
                            errors.postalCode
                              ? "border-red-500 focus:border-red-500"
                              : "border-ferrow-yellow-400/30 focus:border-ferrow-red-500"
                          } focus:outline-none ${!user ? "opacity-50 cursor-not-allowed" : ""}`}
                          placeholder="Contoh: 65141"
                          maxLength={5}
                          required
                        />
                        {errors.postalCode && <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>}
                      </div>
                    </div>
                  </motion.div>

                  {/* Shipping Options */}
                  <motion.div
                    className="glass rounded-xl border border-ferrow-yellow-400/30 p-6 mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  >
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                      <FaTruck className="text-ferrow-green-800" />
                      <span>Pilih Pengiriman</span>
                    </h2>

                    <div className="space-y-3">
                      {shippingOptions.map((option, index) => (
                        <div
                          key={index}
                          className={`p-4 rounded-lg border transition-all ${
                            !user
                              ? "opacity-50 cursor-not-allowed"
                              : selectedShipping === option
                                ? "border-ferrow-red-500 bg-ferrow-red-500/10 cursor-pointer"
                                : "border-ferrow-yellow-400/30 hover:border-ferrow-yellow-400/50 cursor-pointer"
                          }`}
                          onClick={() => user && handleShippingChange(option)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <input
                                type="radio"
                                name="shipping"
                                checked={selectedShipping === option}
                                onChange={() => handleShippingChange(option)}
                                disabled={!user}
                                className="text-ferrow-red-500"
                              />
                              <div>
                                <div className="font-bold">
                                  {option.courier} - {option.service}
                                </div>
                                <div className="text-sm text-ferrow-green-800/60">
                                  Estimasi: {option.estimatedDelivery}
                                </div>
                              </div>
                            </div>
                            <div className="text-lg font-bold text-ferrow-red-500">
                              Rp {option.cost.toLocaleString("id-ID")}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {errors.shipping && <p className="text-red-500 text-sm mt-2">{errors.shipping}</p>}
                  </motion.div>

                  {/* Payment Method */}
                  <motion.div
                    className="glass rounded-xl border border-ferrow-yellow-400/30 p-6 mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                  >
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                      <FaCreditCard className="text-ferrow-green-800" />
                      <span>Metode Pembayaran</span>
                    </h2>

                    <div className="space-y-3">
                      <div
                        className={`p-4 rounded-lg border transition-all ${
                          !user
                            ? "opacity-50 cursor-not-allowed"
                            : paymentMethod === "midtrans"
                              ? "border-ferrow-red-500 bg-ferrow-red-500/10 cursor-pointer"
                              : "border-ferrow-yellow-400/30 hover:border-ferrow-yellow-400/50 cursor-pointer"
                        }`}
                        onClick={() => user && setPaymentMethod("midtrans")}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="payment"
                            value="midtrans"
                            checked={paymentMethod === "midtrans"}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            disabled={!user}
                            className="text-ferrow-red-500"
                          />
                          <div>
                            <div className="font-bold">Midtrans Payment Gateway</div>
                            <div className="text-sm text-ferrow-green-800/60">
                              Credit Card, Bank Transfer, E-Wallet, dll
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </form>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <motion.div
                  className="glass rounded-xl border border-ferrow-yellow-400/30 p-6 sticky top-24"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <FaShoppingCart className="text-ferrow-green-800" />
                    <span>Ringkasan Pesanan</span>
                  </h2>

                  {/* Order Items */}
                  <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-3 glass rounded-lg">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            fill
                            sizes="48px"
                            className="object-contain"
                          />
                        </div>
                        <div className="flex-grow min-w-0">
                          <h4 className="font-medium text-sm truncate">{item.name}</h4>
                          <p className="text-xs text-ferrow-green-800/60">
                            {item.quantity}x Rp {item.price.toLocaleString("id-ID")}
                          </p>
                        </div>
                        <div className="text-sm font-bold text-ferrow-red-500">
                          Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Price Summary */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-ferrow-green-800/70">Subtotal</span>
                      <span>Rp {subtotal.toLocaleString("id-ID")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ferrow-green-800/70">Pengiriman</span>
                      {selectedShipping ? (
                        <div className="text-right">
                          <div>Rp {selectedShipping.cost.toLocaleString("id-ID")}</div>
                          <div className="text-xs text-ferrow-green-800/60">
                            {selectedShipping.courier} - {selectedShipping.service}
                          </div>
                        </div>
                      ) : (
                        <span className="text-ferrow-green-800/60">Pilih pengiriman</span>
                      )}
                    </div>
                    <div className="border-t border-ferrow-yellow-400/20 pt-3 flex justify-between font-bold">
                      <span>Total</span>
                      <span className="text-ferrow-red-500 text-xl">Rp {total.toLocaleString("id-ID")}</span>
                    </div>
                  </div>

                  {/* Payment Button */}
                  <motion.button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={!isFormValid || isLoading}
                    whileHover={{ scale: isFormValid && !isLoading ? 1.03 : 1 }}
                    whileTap={{ scale: isFormValid && !isLoading ? 0.97 : 1 }}
                    className={`w-full py-3 text-lg rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
                      isFormValid && !isLoading
                        ? "btn btn-primary"
                        : "bg-ferrow-green-800/20 text-ferrow-green-800/50 cursor-not-allowed"
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Memproses...</span>
                      </>
                    ) : !user ? (
                      <span>Masuk untuk Melanjutkan</span>
                    ) : (
                      <>
                        <FaCreditCard />
                        <span>Bayar Sekarang</span>
                      </>
                    )}
                  </motion.button>

                  <div className="mt-4 text-center text-ferrow-green-800/60 text-sm">
                    Pembayaran aman dengan Midtrans
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
        <Footer />
      </main>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={() => setIsLoginModalOpen(false)}
      />
    </>
  )
}
