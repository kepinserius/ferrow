"use client"
import type React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  FaUser,
  FaEnvelope,
  FaPaw,
  FaArrowRight,
  FaSpinner,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa"
import { useUserAuth, type UseUserAuthReturnType } from "@/context/AuthContext"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

const LoginPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const { signIn, isAuthenticated, loading: authLoading, user }: UseUserAuthReturnType = useUserAuth()

  useEffect(() => {
    setIsMounted(true)

    // Check for URL parameters
    const errorParam = searchParams?.get("error")
    const successParam = searchParams?.get("success")

    if (errorParam) {
      switch (errorParam) {
        case "invalid_token":
          setError("Token verifikasi tidak valid atau sudah kedaluwarsa.")
          break
        case "verification_failed":
          setError("Gagal memverifikasi akun. Silakan coba lagi.")
          break
        case "server_error":
          setError("Terjadi kesalahan server. Silakan coba lagi nanti.")
          break
        default:
          setError("Terjadi kesalahan. Silakan coba lagi.")
      }
    }

    if (successParam) {
      switch (successParam) {
        case "verified":
          setSuccess("✅ Akun Anda berhasil diverifikasi! Silakan masuk.")
          break
        case "already_verified":
          setSuccess("✅ Akun Anda sudah diverifikasi sebelumnya.")
          break
      }
    }
  }, [searchParams])

  // Handle checkout redirect after successful login
  useEffect(() => {
    if (user && user.email_verified) {
      const storedCheckoutData = sessionStorage.getItem("checkoutData")
      if (storedCheckoutData) {
        const { returnUrl } = JSON.parse(storedCheckoutData)
        if (returnUrl === "/checkout") {
          router.push("/checkout")
          return
        }
      }
      router.push("/checkout")
    }
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsLoading(true)

    const formData = { email, name }

    if (!formData.email.trim() || !formData.name.trim()) {
      setError("Email dan Nama lengkap wajib diisi.")
      setIsLoading(false)
      return
    }

    try {
      const result = await signIn(formData.email, formData.name)
      if (result.success) {
        if (result.user?.email_verified) {
          // User is verified, proceed to checkout
          const storedCheckoutData = sessionStorage.getItem("checkoutData")
          if (storedCheckoutData) {
            const { returnUrl } = JSON.parse(storedCheckoutData)
            router.push(returnUrl || "/checkout")
          } else {
            router.push("/checkout")
          }
        } else {
          // User needs verification
          setSuccess("📧 " + result.message + " Silakan periksa email Anda dan klik tautan verifikasi.")
        }
      } else {
        setError(result.message || "Login gagal. Silakan coba lagi.")
      }
    } catch (err) {
      console.error("Login error:", err)
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
        <div className="absolute top-20 left-10 transform rotate-12">
          <FaPaw className="w-16 h-16 text-ferrow-green-500" />
        </div>
        <div className="absolute top-40 right-20 transform -rotate-45">
          <FaPaw className="w-12 h-12 text-ferrow-green-500" />
        </div>
        <div className="absolute bottom-32 left-1/4 transform rotate-45">
          <FaPaw className="w-20 h-20 text-ferrow-green-500" />
        </div>
        <div className="absolute bottom-20 right-1/3 transform -rotate-12">
          <FaPaw className="w-14 h-14 text-ferrow-green-500" />
        </div>
        <div className="absolute top-1/3 left-1/2 transform rotate-90">
          <FaPaw className="w-10 h-10 text-ferrow-green-500" />
        </div>
        <div className="absolute top-60 left-1/3 transform -rotate-30">
          <FaPaw className="w-8 h-8 text-ferrow-green-500" />
        </div>
        <div className="absolute bottom-1/2 right-10 transform rotate-60">
          <FaPaw className="w-18 h-18 text-ferrow-green-500" />
        </div>

        <div className="absolute top-1/4 right-1/4 transform rotate-15">
          <FaPaw className="w-6 h-6 text-ferrow-yellow-400" />
        </div>
        <div className="absolute bottom-1/4 left-1/5 transform -rotate-60">
          <FaPaw className="w-8 h-8 text-ferrow-yellow-400" />
        </div>
        <div className="absolute top-3/4 right-1/5 transform rotate-30">
          <FaPaw className="w-7 h-7 text-ferrow-yellow-400" />
        </div>
      </div>

      <div className="container mx-auto px-4 pt-32 pb-20 relative z-10">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-20 h-20 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 border border-ferrow-yellow-400/30 shadow-lg"
            >
              <FaPaw className="w-10 h-10 text-ferrow-green-600" />
            </motion.div>

            <h1 className="text-4xl font-display font-bold text-ferrow-green-800 mb-3">
              Selamat <span className="text-ferrow-green-600">Datang</span>
            </h1>
            <p className="text-ferrow-green-700 text-lg">Silakan masukkan email dan nama Anda untuk melanjutkan</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl border border-ferrow-yellow-400/20 shadow-xl overflow-hidden"
          >
            <div className="p-8">
              {/* Success Message */}
              {success && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-6 p-4 bg-ferrow-green-500/10 border border-ferrow-green-500/20 text-ferrow-green-700 rounded-xl flex items-start gap-3"
                >
                  <FaCheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p className="text-sm font-medium">{success}</p>
                </motion.div>
              )}

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-6 p-4 bg-ferrow-red-500/10 border border-ferrow-red-500/20 text-ferrow-red-600 rounded-xl flex items-start gap-3"
                >
                  <FaExclamationTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">{error}</p>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-ferrow-green-800 mb-2">
                    Alamat Email
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

                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-ferrow-green-800 mb-2">
                    Nama Lengkap
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
                      <span>Memproses...</span>
                    </>
                  ) : (
                    <>
                      <span>Masuk ke Akun</span>
                      <FaArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </form>

              <div className="mt-6 pt-6 border-t border-ferrow-yellow-400/20">
                <div className="text-center">
                  <p className="text-ferrow-green-700 text-sm mb-3">
                    Belum punya akun?{" "}
                    <Link href="/user/register" className="text-ferrow-green-600 hover:underline font-semibold">
                      Daftar di sini
                    </Link>
                  </p>

                  <div className="flex items-center justify-center gap-2 text-ferrow-green-600">
                    <FaPaw className="w-4 h-4" />
                    <span className="text-sm font-medium">Untuk hewan kesayangan terbaik</span>
                    <FaPaw className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

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

export default LoginPage
