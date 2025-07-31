"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useUserAuth } from "@/context/AuthContext"
import { motion, AnimatePresence } from "framer-motion"
import { X, Loader2, AlertCircle } from "lucide-react"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function LoginModal({ isOpen, onClose, onSuccess }: LoginModalProps) {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [isRegisterMode, setIsRegisterMode] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const { signIn } = useUserAuth()

  useEffect(() => {
    if (!isOpen) {
      // Reset form state when modal closes
      setEmail("")
      setName("")
      setPhone("")
      setIsRegisterMode(false)
      setError("")
      setIsLoading(false)
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (!email || !name) {
      setError("Email dan Nama lengkap wajib diisi.")
      setIsLoading(false)
      return
    }

    try {
      // The signIn function handles both registration and login based on user existence
      const result = await signIn(email, name, phone)

      if (result.success) {
        onSuccess() // Call onSuccess callback on successful login/registration
      } else {
        setError(result.message || "Login/Pendaftaran gagal. Silakan coba lagi.")
      }
    } catch (err) {
      console.error("Login/Pendaftaran error:", err)
      setError("Terjadi kesalahan tak terduga. Silakan coba lagi.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black bg-opacity-50"
        >
          <motion.div
            initial={{ scale: 0.9, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 50 }}
            className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-auto p-6"
          >
            <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-2xl font-bold text-center mb-6">{isRegisterMode ? "Daftar Akun" : "Masuk / Daftar"}</h2>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 mb-4">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                  disabled={isLoading}
                />
              </div>
              {isRegisterMode && (
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Nomor Telepon
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    disabled={isLoading}
                  />
                </div>
              )}
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Memproses...
                  </>
                ) : isRegisterMode ? (
                  "Daftar Sekarang"
                ) : (
                  "Masuk / Daftar"
                )}
              </button>
            </form>
            <div className="mt-4 text-center text-sm text-gray-600">
              {isRegisterMode ? (
                <>
                  Sudah punya akun?{" "}
                  <button
                    type="button"
                    onClick={() => setIsRegisterMode(false)}
                    className="text-green-600 hover:underline"
                  >
                    Masuk di sini
                  </button>
                </>
              ) : (
                <>
                  Belum punya akun?{" "}
                  <button
                    type="button"
                    onClick={() => setIsRegisterMode(true)}
                    className="text-green-600 hover:underline"
                  >
                    Daftar sekarang
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
