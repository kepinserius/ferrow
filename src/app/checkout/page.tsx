"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { FaArrowLeft, FaShoppingCart, FaUser, FaMapMarkerAlt, FaCreditCard, FaTruck, FaPaw } from "react-icons/fa"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
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
  const { cartItems, subTotal, clearCart } = useCart()
  const { user, loading: authLoading } = useUserAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isMounted, setIsMounted] = useState(false)
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

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Redirect if no cart items
  useEffect(() => {
    if (isMounted && cartItems.length === 0) {
      router.push("/cart")
    }
  }, [cartItems, router, isMounted])

  // Auto-fill customer data if user is logged in
  useEffect(() => {
    if (user && !customerData.name && !customerData.email) {
      setCustomerData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
      }))
    }
  }, [user, customerData.name, customerData.email])

  // Set default shipping option
  useEffect(() => {
    if (shippingOptions.length > 0 && !selectedShipping) {
      setSelectedShipping(shippingOptions[0])
    }
  }, [shippingOptions, selectedShipping])

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

  const handleLoginRedirect = () => {
    // Store current checkout data in sessionStorage to restore after login
    sessionStorage.setItem(
      "checkoutData",
      JSON.stringify({
        customerData,
        selectedShipping,
        paymentMethod,
        returnUrl: "/checkout",
      }),
    )
    router.push("/user/login-user") // This should match your file path
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      handleLoginRedirect()
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
          user_id: user.id,
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
          subTotal,
          shipping_cost: selectedShipping?.cost || 0,
          total_amount: subTotal + (selectedShipping?.cost || 0),
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
      // Clear stored checkout data
      sessionStorage.removeItem("checkoutData")
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

  const total = subTotal + (selectedShipping?.cost || 0)

  if (!isMounted) {
    return <div className="h-screen bg-ferrow-cream-400" />
  }

  if (authLoading) {
    return (
      <main className="bg-ferrow-cream-400 min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 pt-32 pb-20">
          <div className="flex justify-center items-center py-20">
            <div className="relative w-20 h-20">
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-t-ferrow-green-500 border-r-transparent border-b-transparent border-l-transparent"
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
    <main className="bg-ferrow-cream-400 min-h-screen">
      <Navbar />

      {/* Paw Print Background Pattern */}
      <div className="absolute inset-0 opacity-3">
        <div className="absolute top-20 right-20 transform rotate-30">
          <FaPaw className="w-16 h-16 text-ferrow-green-500" />
        </div>
        <div className="absolute bottom-40 left-20 transform -rotate-45">
          <FaPaw className="w-12 h-12 text-ferrow-green-500" />
        </div>
        <div className="absolute top-1/2 right-1/4 transform rotate-60">
          <FaPaw className="w-10 h-10 text-ferrow-yellow-400" />
        </div>
      </div>

      <div className="container mx-auto px-4 pt-32 pb-20 relative z-10">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-ferrow-green-800">
              <span className="text-ferrow-green-600">Checkout</span>
            </h1>
            <Link href="/cart">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm text-ferrow-green-800 font-semibold rounded-xl border border-ferrow-yellow-400/30 hover:border-ferrow-yellow-400 transition-all duration-300"
              >
                <FaArrowLeft />
                <span>Kembali ke Keranjang</span>
              </motion.button>
            </Link>
          </div>

          {!user && (
            <motion.div
              className="bg-white/90 backdrop-blur-sm rounded-2xl border border-ferrow-yellow-400/20 shadow-xl p-8 mb-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="w-16 h-16 bg-ferrow-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaPaw className="w-8 h-8 text-ferrow-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-ferrow-green-800 mb-3">Silakan Masuk Terlebih Dahulu</h3>
              <p className="text-ferrow-green-700 mb-6 leading-relaxed">
                Untuk melanjutkan checkout dan menikmati pengalaman berbelanja yang lebih baik, silakan masuk ke akun
                Anda atau daftar jika belum memiliki akun.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLoginRedirect}
                  className="px-8 py-3 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  style={{ backgroundColor: "#333A2D" }}
                >
                  Masuk ke Akun
                </motion.button>
                <Link href="/user/register">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 bg-white/80 text-ferrow-green-800 font-bold rounded-xl border-2 border-ferrow-yellow-400/50 hover:border-ferrow-yellow-400 transition-all duration-300"
                  >
                    Daftar Sekarang
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="xl:col-span-2">
              <form onSubmit={handleSubmit}>
                {/* Customer Information */}
                <motion.div
                  className="bg-white/90 backdrop-blur-sm rounded-2xl border border-ferrow-yellow-400/20 shadow-xl p-8 mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-ferrow-green-800">
                    <div className="w-10 h-10 bg-ferrow-green-500/20 rounded-full flex items-center justify-center">
                      <FaUser className="w-5 h-5 text-ferrow-green-600" />
                    </div>
                    <span>Informasi Pelanggan</span>
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-ferrow-green-800 mb-2">
                        Nama Lengkap <span className="text-ferrow-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={customerData.name}
                        onChange={handleInputChange}
                        disabled={!user}
                        className={`w-full px-4 py-4 bg-white border rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ferrow-green-500/20 ${
                          errors.name
                            ? "border-ferrow-red-500 focus:border-ferrow-red-500"
                            : "border-ferrow-yellow-400/30 focus:border-ferrow-green-500"
                        } ${!user ? "opacity-50 cursor-not-allowed" : ""} text-ferrow-green-800 placeholder-ferrow-green-600/50`}
                        placeholder="Masukkan nama lengkap"
                        required
                      />
                      {errors.name && <p className="text-ferrow-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-ferrow-green-800 mb-2">
                        Email <span className="text-ferrow-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={customerData.email}
                        onChange={handleInputChange}
                        disabled={!user}
                        className={`w-full px-4 py-4 bg-white border rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ferrow-green-500/20 ${
                          errors.email
                            ? "border-ferrow-red-500 focus:border-ferrow-red-500"
                            : "border-ferrow-yellow-400/30 focus:border-ferrow-green-500"
                        } ${!user ? "opacity-50 cursor-not-allowed" : ""} text-ferrow-green-800 placeholder-ferrow-green-600/50`}
                        placeholder="nama@email.com"
                        required
                      />
                      {errors.email && <p className="text-ferrow-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-ferrow-green-800 mb-2">
                        Nomor Telepon <span className="text-ferrow-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={customerData.phone}
                        onChange={handleInputChange}
                        disabled={!user}
                        className={`w-full px-4 py-4 bg-white border rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ferrow-green-500/20 ${
                          errors.phone
                            ? "border-ferrow-red-500 focus:border-ferrow-red-500"
                            : "border-ferrow-yellow-400/30 focus:border-ferrow-green-500"
                        } ${!user ? "opacity-50 cursor-not-allowed" : ""} text-ferrow-green-800 placeholder-ferrow-green-600/50`}
                        placeholder="08xxxxxxxxxx"
                        required
                      />
                      {errors.phone && <p className="text-ferrow-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>
                  </div>
                </motion.div>

                {/* Shipping Information */}
                <motion.div
                  className="bg-white/90 backdrop-blur-sm rounded-2xl border border-ferrow-yellow-400/20 shadow-xl p-8 mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-ferrow-green-800">
                    <div className="w-10 h-10 bg-ferrow-green-500/20 rounded-full flex items-center justify-center">
                      <FaMapMarkerAlt className="w-5 h-5 text-ferrow-green-600" />
                    </div>
                    <span>Alamat Pengiriman</span>
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-ferrow-green-800 mb-2">
                        Alamat Lengkap <span className="text-ferrow-red-500">*</span>
                      </label>
                      <textarea
                        name="address"
                        value={customerData.address}
                        onChange={handleInputChange}
                        disabled={!user}
                        rows={3}
                        className={`w-full px-4 py-4 bg-white border rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ferrow-green-500/20 resize-none ${
                          errors.address
                            ? "border-ferrow-red-500 focus:border-ferrow-red-500"
                            : "border-ferrow-yellow-400/30 focus:border-ferrow-green-500"
                        } ${!user ? "opacity-50 cursor-not-allowed" : ""} text-ferrow-green-800 placeholder-ferrow-green-600/50`}
                        placeholder="Jalan, nomor rumah, RT/RW, kelurahan, kecamatan"
                        required
                      />
                      {errors.address && <p className="text-ferrow-red-500 text-sm mt-1">{errors.address}</p>}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-ferrow-green-800 mb-2">
                          Provinsi <span className="text-ferrow-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="province"
                          value={customerData.province}
                          onChange={handleInputChange}
                          disabled={!user}
                          className={`w-full px-4 py-4 bg-white border rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ferrow-green-500/20 ${
                            errors.province
                              ? "border-ferrow-red-500 focus:border-ferrow-red-500"
                              : "border-ferrow-yellow-400/30 focus:border-ferrow-green-500"
                          } ${!user ? "opacity-50 cursor-not-allowed" : ""} text-ferrow-green-800 placeholder-ferrow-green-600/50`}
                          placeholder="Contoh: Jawa Timur"
                          required
                        />
                        {errors.province && <p className="text-ferrow-red-500 text-sm mt-1">{errors.province}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-ferrow-green-800 mb-2">
                          ID Provinsi <span className="text-ferrow-green-600 text-xs">(Opsional)</span>
                        </label>
                        <input
                          type="number"
                          name="provinceId"
                          value={customerData.provinceId}
                          onChange={handleInputChange}
                          disabled={!user}
                          className={`w-full px-4 py-4 bg-white border rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ferrow-green-500/20 ${
                            errors.provinceId
                              ? "border-ferrow-red-500 focus:border-ferrow-red-500"
                              : "border-ferrow-yellow-400/30 focus:border-ferrow-green-500"
                          } ${!user ? "opacity-50 cursor-not-allowed" : ""} text-ferrow-green-800 placeholder-ferrow-green-600/50`}
                          placeholder="Untuk perhitungan ongkir"
                        />
                        {errors.provinceId && <p className="text-ferrow-red-500 text-sm mt-1">{errors.provinceId}</p>}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-ferrow-green-800 mb-2">
                          Kota <span className="text-ferrow-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={customerData.city}
                          onChange={handleInputChange}
                          disabled={!user}
                          className={`w-full px-4 py-4 bg-white border rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ferrow-green-500/20 ${
                            errors.city
                              ? "border-ferrow-red-500 focus:border-ferrow-red-500"
                              : "border-ferrow-yellow-400/30 focus:border-ferrow-green-500"
                          } ${!user ? "opacity-50 cursor-not-allowed" : ""} text-ferrow-green-800 placeholder-ferrow-green-600/50`}
                          placeholder="Contoh: Malang"
                          required
                        />
                        {errors.city && <p className="text-ferrow-red-500 text-sm mt-1">{errors.city}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-ferrow-green-800 mb-2">
                          ID Kota <span className="text-ferrow-green-600 text-xs">(Opsional)</span>
                        </label>
                        <input
                          type="number"
                          name="cityId"
                          value={customerData.cityId}
                          onChange={handleInputChange}
                          disabled={!user}
                          className={`w-full px-4 py-4 bg-white border rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ferrow-green-500/20 ${
                            errors.cityId
                              ? "border-ferrow-red-500 focus:border-ferrow-red-500"
                              : "border-ferrow-yellow-400/30 focus:border-ferrow-green-500"
                          } ${!user ? "opacity-50 cursor-not-allowed" : ""} text-ferrow-green-800 placeholder-ferrow-green-600/50`}
                          placeholder="Untuk perhitungan ongkir"
                        />
                        {errors.cityId && <p className="text-ferrow-red-500 text-sm mt-1">{errors.cityId}</p>}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-ferrow-green-800 mb-2">
                        Kode Pos <span className="text-ferrow-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={customerData.postalCode}
                        onChange={handleInputChange}
                        disabled={!user}
                        className={`w-full px-4 py-4 bg-white border rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ferrow-green-500/20 ${
                          errors.postalCode
                            ? "border-ferrow-red-500 focus:border-ferrow-red-500"
                            : "border-ferrow-yellow-400/30 focus:border-ferrow-green-500"
                        } ${!user ? "opacity-50 cursor-not-allowed" : ""} text-ferrow-green-800 placeholder-ferrow-green-600/50`}
                        placeholder="Contoh: 65141"
                        maxLength={5}
                        required
                      />
                      {errors.postalCode && <p className="text-ferrow-red-500 text-sm mt-1">{errors.postalCode}</p>}
                    </div>
                  </div>
                </motion.div>

                {/* Shipping Options */}
                <motion.div
                  className="bg-white/90 backdrop-blur-sm rounded-2xl border border-ferrow-yellow-400/20 shadow-xl p-8 mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-ferrow-green-800">
                    <div className="w-10 h-10 bg-ferrow-green-500/20 rounded-full flex items-center justify-center">
                      <FaTruck className="w-5 h-5 text-ferrow-green-600" />
                    </div>
                    <span>Pilih Pengiriman</span>
                  </h2>
                  <div className="space-y-4">
                    {shippingOptions.map((option, index) => (
                      <div
                        key={index}
                        className={`p-6 rounded-xl border transition-all duration-300 cursor-pointer ${
                          !user
                            ? "opacity-50 cursor-not-allowed"
                            : selectedShipping === option
                              ? "border-ferrow-green-500 bg-ferrow-green-500/10"
                              : "border-ferrow-yellow-400/30 hover:border-ferrow-yellow-400/50 hover:bg-ferrow-yellow-400/5"
                        }`}
                        onClick={() => user && handleShippingChange(option)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <input
                              type="radio"
                              name="shipping"
                              checked={selectedShipping === option}
                              onChange={() => handleShippingChange(option)}
                              disabled={!user}
                              className="w-5 h-5 text-ferrow-green-500"
                            />
                            <div>
                              <div className="font-bold text-ferrow-green-800 text-lg">
                                {option.courier} - {option.service}
                              </div>
                              <div className="text-ferrow-green-700">Estimasi: {option.estimatedDelivery}</div>
                            </div>
                          </div>
                          <div className="text-xl font-bold text-ferrow-green-800">
                            Rp {option.cost.toLocaleString("id-ID")}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {errors.shipping && <p className="text-ferrow-red-500 text-sm mt-2">{errors.shipping}</p>}
                </motion.div>

                {/* Payment Method */}
                <motion.div
                  className="bg-white/90 backdrop-blur-sm rounded-2xl border border-ferrow-yellow-400/20 shadow-xl p-8 mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-ferrow-green-800">
                    <div className="w-10 h-10 bg-ferrow-green-500/20 rounded-full flex items-center justify-center">
                      <FaCreditCard className="w-5 h-5 text-ferrow-green-600" />
                    </div>
                    <span>Metode Pembayaran</span>
                  </h2>
                  <div className="space-y-4">
                    <div
                      className={`p-6 rounded-xl border transition-all duration-300 cursor-pointer ${
                        !user
                          ? "opacity-50 cursor-not-allowed"
                          : paymentMethod === "midtrans"
                            ? "border-ferrow-green-500 bg-ferrow-green-500/10"
                            : "border-ferrow-yellow-400/30 hover:border-ferrow-yellow-400/50 hover:bg-ferrow-yellow-400/5"
                      }`}
                      onClick={() => user && setPaymentMethod("midtrans")}
                    >
                      <div className="flex items-center gap-4">
                        <input
                          type="radio"
                          name="payment"
                          value="midtrans"
                          checked={paymentMethod === "midtrans"}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          disabled={!user}
                          className="w-5 h-5 text-ferrow-green-500"
                        />
                        <div>
                          <div className="font-bold text-ferrow-green-800 text-lg">Midtrans Payment Gateway</div>
                          <div className="text-ferrow-green-700">Credit Card, Bank Transfer, E-Wallet, dll</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </form>
            </div>

            {/* Order Summary */}
            <div className="xl:col-span-1">
              <motion.div
                className="bg-white/90 backdrop-blur-sm rounded-2xl border border-ferrow-yellow-400/20 shadow-xl overflow-hidden sticky top-24"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="px-6 py-5 border-b border-ferrow-yellow-400/20 bg-ferrow-yellow-400/5">
                  <h2 className="text-xl font-bold text-ferrow-green-800 flex items-center gap-3">
                    <div className="w-8 h-8 bg-ferrow-green-500/20 rounded-full flex items-center justify-center">
                      <FaShoppingCart className="w-4 h-4 text-ferrow-green-600" />
                    </div>
                    Ringkasan Pesanan
                  </h2>
                </div>

                <div className="p-6">
                  {/* Order Items */}
                  <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-4 bg-ferrow-yellow-400/5 rounded-xl">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-grow min-w-0">
                          <h4 className="font-semibold text-ferrow-green-800 text-sm truncate">{item.name}</h4>
                          <p className="text-ferrow-green-700 text-xs">
                            {item.quantity}x Rp {item.price.toLocaleString("id-ID")}
                          </p>
                        </div>
                        <div className="text-sm font-bold text-ferrow-green-800">
                          Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Price Summary */}
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-ferrow-green-700">Subtotal ({cartItems.length} item)</span>
                      <span className="font-semibold text-ferrow-green-800">Rp {subTotal.toLocaleString("id-ID")}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-ferrow-green-700">Pengiriman</span>
                      {selectedShipping ? (
                        <div className="text-right">
                          <div className="font-semibold text-ferrow-green-800">
                            Rp {selectedShipping.cost.toLocaleString("id-ID")}
                          </div>
                          <div className="text-xs text-ferrow-green-600">
                            {selectedShipping.courier} - {selectedShipping.service}
                          </div>
                        </div>
                      ) : (
                        <span className="text-ferrow-green-600">Pilih pengiriman</span>
                      )}
                    </div>
                    <div className="border-t border-ferrow-yellow-400/20 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-ferrow-green-800">Total Pembayaran</span>
                        <span className="text-2xl font-bold text-ferrow-green-800">
                          Rp {total.toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Button */}
                  <motion.button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={!isFormValid || isLoading}
                    whileHover={{ scale: isFormValid && !isLoading ? 1.02 : 1 }}
                    whileTap={{ scale: isFormValid && !isLoading ? 0.98 : 1 }}
                    className={`w-full py-4 px-6 font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 ${
                      isFormValid && !isLoading
                        ? "text-white"
                        : "bg-ferrow-green-800/20 text-ferrow-green-800/50 cursor-not-allowed"
                    }`}
                    style={{
                      backgroundColor: isFormValid && !isLoading ? "#333A2D" : undefined,
                    }}
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

                  {/* Security Notice */}
                  <div className="mt-4 p-4 bg-ferrow-yellow-400/10 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <FaPaw className="w-4 h-4 text-ferrow-green-600" />
                      <span className="text-sm font-semibold text-ferrow-green-800">Pembayaran Aman</span>
                    </div>
                    <p className="text-xs text-ferrow-green-700 leading-relaxed">
                      Transaksi Anda dilindungi dengan enkripsi SSL dan sistem keamanan Midtrans yang terpercaya.
                    </p>
                  </div>
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
