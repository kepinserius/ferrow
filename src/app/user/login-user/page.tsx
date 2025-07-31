"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUserAuth } from "@/context/AuthContext"
import { motion } from "framer-motion"
import { User, Mail, Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

export default function UserLoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    name: "", // Name is required by the signin API
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const { signIn, isAuthenticated, loading: authLoading } = useUserAuth()
  const router = useRouter()

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push("/checkout") // Or any other protected page
    }
  }, [isAuthenticated, authLoading, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (error) setError("") // Clear error on input change
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (!formData.email.trim() || !formData.name.trim()) {
      setError("Email dan Nama lengkap wajib diisi.")
      setIsLoading(false)
      return
    }

    try {
      // For login, we use the same signIn API. If user exists, it updates. If not, it creates.
      const result = await signIn(formData.email, formData.name)
      if (result.success) {
        router.push("/checkout") // Redirect to checkout or dashboard
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

  if (authLoading || isAuthenticated) {
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
      <div className="container mx-auto px-4 pt-32 pb-20 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-ferrow-green-800 mb-2">
              Masuk ke <span className="text-gradient">Akun Anda</span>
            </h1>
            <p className="text-ferrow-green-800/70">Silakan masukkan email dan nama Anda untuk masuk</p>
          </div>

          <div className="glass rounded-xl border border-ferrow-yellow-400/30 p-8 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-ferrow-green-800/60" size={18} />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pl-10 glass rounded-lg border border-ferrow-yellow-400/30 focus:border-ferrow-red-500 focus:outline-none transition-colors"
                    placeholder="Masukkan alamat email Anda"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Nama Lengkap *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-ferrow-green-800/60" size={18} />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pl-10 glass rounded-lg border border-ferrow-yellow-400/30 focus:border-ferrow-red-500 focus:outline-none transition-colors"
                    placeholder="Masukkan nama lengkap Anda"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="btn btn-primary w-full py-3 text-lg flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Masuk...</span>
                  </>
                ) : (
                  "Masuk"
                )}
              </motion.button>
            </form>

            <div className="mt-6 text-center text-ferrow-green-800/70">
              Belum punya akun?{" "}
              <Link href="/register" className="text-ferrow-red-500 hover:underline font-medium">
                Daftar sekarang
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </main>
  )
}
