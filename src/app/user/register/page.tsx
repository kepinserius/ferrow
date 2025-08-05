"use client"
import type React from "react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { FaUser, FaEnvelope, FaPhone, FaPaw, FaArrowRight, FaSpinner, FaCheckCircle } from "react-icons/fa"
import { useUserAuth, type UseUserAuthReturnType } from "@/context/AuthContext"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

const RegisterPage = () => {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const { signIn, isAuthenticated, loading: authLoading }: UseUserAuthReturnType = useUserAuth()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccessMessage("")
    setIsLoading(true)

    const formData = { email, name, phone }

    if (!formData.name.trim() || !formData.email.trim()) {
      setError("Nama lengkap dan Email wajib diisi.")
      setIsLoading(false)
      return
    }

    try {
      const result = await signIn(formData.email, formData.name, formData.phone)
      if (result.success) {
        setSuccessMessage(result.message || "Pendaftaran berhasil! Silakan periksa email Anda untuk verifikasi.")
        setTimeout(() => {
          router.push("/login-user")
        }, 3000)
      } else {
        setError(result.message || "Pendaftaran gagal. Silakan coba lagi.")
      }
    } catch (err) {
      console.error("Registration error:", err)
      setError("Terjadi kesalahan tak terduga. Silakan coba lagi.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isMounted) {
    return <div className="h-screen bg-ferrow-cream-400" />
  }

  return (
    <main className="min-h-screen bg-ferrow-cream-400 relative overflow-hidden">
      <Navbar />

      {/* Paw Print Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        {/* Large paw prints */}
        <div className="absolute top-16 right-16 transform rotate-45">
          <FaPaw className="w-20 h-20 text-ferrow-green-500" />
        </div>
        <div className="absolute top-32 left-16 transform -rotate-30">
          <FaPaw className="w-14 h-14 text-ferrow-green-500" />
        </div>
        <div className="absolute bottom-40 right-1/4 transform rotate-60">
          <FaPaw className="w-16 h-16 text-ferrow-green-500" />
        </div>
        <div className="absolute bottom-24 left-1/3 transform -rotate-15">
          <FaPaw className="w-12 h-12 text-ferrow-green-500" />
        </div>
        <div className="absolute top-1/2 right-12 transform rotate-30">
          <FaPaw className="w-10 h-10 text-ferrow-green-500" />
        </div>
        <div className="absolute top-2/3 left-12 transform -rotate-45">
          <FaPaw className="w-18 h-18 text-ferrow-green-500" />
        </div>

        {/* Small scattered paw prints */}
        <div className="absolute top-1/5 left-1/4 transform rotate-75">
          <FaPaw className="w-8 h-8 text-ferrow-yellow-400" />
        </div>
        <div className="absolute bottom-1/3 right-1/5 transform -rotate-30">
          <FaPaw className="w-6 h-6 text-ferrow-yellow-400" />
        </div>
        <div className="absolute top-3/5 left-1/5 transform rotate-45">
          <FaPaw className="w-7 h-7 text-ferrow-yellow-400" />
        </div>
        <div className="absolute bottom-1/5 left-2/3 transform -rotate-60">
          <FaPaw className="w-9 h-9 text-ferrow-yellow-400" />
        </div>
      </div>

      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/3 right-10 w-28 h-28 rounded-full bg-ferrow-green-500/10 blur-xl"
          animate={{
            y: [0, -25, 0],
            x: [0, -10, 0],
          }}
          transition={{
            duration: 7,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 left-10 w-36 h-36 rounded-full bg-ferrow-yellow-400/10 blur-xl"
          animate={{
            y: [0, 20, 0],
            x: [0, 15, 0],
          }}
          transition={{
            duration: 9,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="container mx-auto px-4 pt-32 pb-20 relative z-10">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            {/* Logo/Icon */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-20 h-20 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 border border-ferrow-yellow-400/30 shadow-lg"
            >
              <FaPaw className="w-10 h-10 text-ferrow-green-600" />
            </motion.div>

            <h1 className="text-4xl font-display font-bold text-ferrow-green-800 mb-3">
              Bergabung <span className="text-ferrow-green-600">Bersama</span>
            </h1>
            <p className="text-ferrow-green-700 text-lg">Daftar sekarang untuk pengalaman berbelanja yang lebih baik</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl border border-ferrow-yellow-400/20 shadow-xl overflow-hidden"
          >
            <div className="p-8">
              {/* Success Message */}
              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-6 p-4 bg-ferrow-green-500/10 border border-ferrow-green-500/20 text-ferrow-green-700 rounded-xl flex items-center gap-3"
                >
                  <FaCheckCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm font-medium">{successMessage}</p>
                </motion.div>
              )}

              {/* Error Message */}
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-6 p-4 bg-ferrow-red-500/10 border border-ferrow-red-500/20 text-ferrow-red-600 rounded-xl text-sm"
                >
                  {errorMessage}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Input */}
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-ferrow-green-800 mb-2">
                    Nama Lengkap <span className="text-ferrow-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaUser className="w-5 h-5 text-ferrow-green-600" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Masukkan nama lengkap Anda"
                      required
                      className="w-full pl-12 pr-4 py-4 bg-white border border-ferrow-yellow-400/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-ferrow-green-500/20 focus:border-ferrow-green-500 transition-all duration-300 text-ferrow-green-800 placeholder-ferrow-green-600/50"
                    />
                  </div>
                </div>

                {/* Email Input */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-ferrow-green-800 mb-2">
                    Alamat Email <span className="text-ferrow-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaEnvelope className="w-5 h-5 text-ferrow-green-600" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nama@email.com"
                      required
                      className="w-full pl-12 pr-4 py-4 bg-white border border-ferrow-yellow-400/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-ferrow-green-500/20 focus:border-ferrow-green-500 transition-all duration-300 text-ferrow-green-800 placeholder-ferrow-green-600/50"
                    />
                  </div>
                </div>

                {/* Phone Input */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-ferrow-green-800 mb-2">
                    Nomor Telepon
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaPhone className="w-5 h-5 text-ferrow-green-600" />
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="08xxxxxxxxxx"
                      className="w-full pl-12 pr-4 py-4 bg-white border border-ferrow-yellow-400/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-ferrow-green-500/20 focus:border-ferrow-green-500 transition-all duration-300 text-ferrow-green-800 placeholder-ferrow-green-600/50"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isLoading || authLoading}
                  whileHover={{ scale: isLoading || authLoading ? 1 : 1.02 }}
                  whileTap={{ scale: isLoading || authLoading ? 1 : 0.98 }}
                  className="w-full py-4 px-6 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  style={{ backgroundColor: "#333A2D" }}
                >
                  {isLoading || authLoading ? (
                    <>
                      <FaSpinner className="w-5 h-5 animate-spin" />
                      <span>Mendaftar...</span>
                    </>
                  ) : (
                    <>
                      <span>Daftar Sekarang</span>
                      <FaArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </form>

              {/* Additional Info */}
              <div className="mt-6 pt-6 border-t border-ferrow-yellow-400/20">
                <div className="text-center space-y-4">
                  <p className="text-ferrow-green-700 text-sm">
                    Sudah punya akun?{" "}
                    <Link href="/login-user" className="text-ferrow-green-600 hover:underline font-semibold">
                      Masuk di sini
                    </Link>
                  </p>

                  <p className="text-ferrow-green-700 text-sm leading-relaxed">
                    Dengan mendaftar, Anda menyetujui{" "}
                    <Link href="/terms" className="text-ferrow-green-600 hover:underline font-medium">
                      Syarat & Ketentuan
                    </Link>{" "}
                    dan{" "}
                    <Link href="/privacy" className="text-ferrow-green-600 hover:underline font-medium">
                      Kebijakan Privasi
                    </Link>{" "}
                    kami.
                  </p>

                  <div className="flex items-center justify-center gap-2 text-ferrow-green-600">
                    <FaPaw className="w-4 h-4" />
                    <span className="text-sm font-medium">Bergabunglah dengan keluarga FERROW</span>
                    <FaPaw className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Back to Shopping */}
          <div className="text-center mt-8">
            <Link href="/products">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/60 backdrop-blur-sm text-ferrow-green-800 font-medium rounded-xl border border-ferrow-yellow-400/30 hover:border-ferrow-yellow-400 transition-all duration-300"
              >
                <span>Kembali ke Produk</span>
              </motion.button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}

export default RegisterPage
