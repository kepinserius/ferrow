"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FaTimes, FaUser, FaEnvelope, FaPhone } from "react-icons/fa"
import { useUserAuth } from "@/context/AuthContext"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export default function LoginModal({ isOpen, onClose, onSuccess }: LoginModalProps) {
  const { signIn } = useUserAuth()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Nama wajib diisi"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email wajib diisi"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format email tidak valid"
    }

    if (formData.phone && !/^[0-9+\-\s()]+$/.test(formData.phone)) {
      newErrors.phone = "Format nomor telepon tidak valid"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const result = await signIn(formData.email, formData.name, formData.phone)

      if (result.success) {
        onSuccess?.()
        onClose()
        // Reset form
        setFormData({ name: "", email: "", phone: "" })
        setErrors({})
      } else {
        setErrors({ general: result.message || "Sign in failed" })
      }
    } catch (error) {
      console.error("Login error:", error)
      setErrors({ general: "Network error. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="glass rounded-xl border border-ferrow-yellow-400/30 p-6 w-full max-w-md"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-ferrow-green-800">Masuk / Daftar</h2>
              <button
                onClick={onClose}
                className="text-ferrow-green-800/60 hover:text-ferrow-green-800 transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {errors.general && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-ferrow-green-800">
                  <FaUser className="inline mr-2" />
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 glass rounded-lg border transition-colors ${
                    errors.name
                      ? "border-red-500 focus:border-red-500"
                      : "border-ferrow-yellow-400/30 focus:border-ferrow-red-500"
                  } focus:outline-none text-ferrow-green-800`}
                  placeholder="Masukkan nama lengkap"
                  required
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-ferrow-green-800">
                  <FaEnvelope className="inline mr-2" />
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 glass rounded-lg border transition-colors ${
                    errors.email
                      ? "border-red-500 focus:border-red-500"
                      : "border-ferrow-yellow-400/30 focus:border-ferrow-red-500"
                  } focus:outline-none text-ferrow-green-800`}
                  placeholder="Masukkan email"
                  required
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-ferrow-green-800">
                  <FaPhone className="inline mr-2" />
                  Nomor Telepon
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 glass rounded-lg border transition-colors ${
                    errors.phone
                      ? "border-red-500 focus:border-red-500"
                      : "border-ferrow-yellow-400/30 focus:border-ferrow-red-500"
                  } focus:outline-none text-ferrow-green-800`}
                  placeholder="Masukkan nomor telepon (opsional)"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: !isLoading ? 1.02 : 1 }}
                whileTap={{ scale: !isLoading ? 0.98 : 1 }}
                className={`w-full py-3 text-lg rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
                  !isLoading ? "btn btn-primary" : "bg-ferrow-green-800/20 text-ferrow-green-800/50 cursor-not-allowed"
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Memproses...</span>
                  </>
                ) : (
                  <span>Masuk / Daftar</span>
                )}
              </motion.button>
            </form>

            <div className="mt-4 text-center text-ferrow-green-800/60 text-sm">
              Dengan melanjutkan, Anda menyetujui{" "}
              <a href="/terms" className="text-ferrow-red-500 hover:underline">
                Syarat & Ketentuan
              </a>{" "}
              kami.
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
