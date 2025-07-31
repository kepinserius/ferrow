"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useUserAuth, type UseUserAuthReturnType } from "@/context/AuthContext"
import { CheckCircle } from "lucide-react"

const RegisterPage = () => {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const { signIn, isAuthenticated, loading: authLoading }: UseUserAuthReturnType = useUserAuth()

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

  return (
    <div>
      <h1>Register</h1>
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <CheckCircle className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm">{successMessage}</p>
        </div>
      )}
      {errorMessage && <p>{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama Lengkap" />
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Nomor Telepon" />
        <button type="submit" disabled={isLoading || authLoading}>
          {isLoading || authLoading ? "Loading..." : "Register"}
        </button>
      </form>
    </div>
  )
}

export default RegisterPage
