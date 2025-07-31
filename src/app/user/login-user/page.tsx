"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useUserAuth, type UseUserAuthReturnType } from "@/context/AuthContext"

const LoginPage = () => {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [name, setName] = useState("") // Added state for name
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const { signIn, isAuthenticated, loading: authLoading }: UseUserAuthReturnType = useUserAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
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
        router.push("/checkout")
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

  return (
    <div>
      <h1>Login</h1>
      <p className="text-ferrow-green-800/70">Silakan masukkan email dan nama Anda untuk masuk</p>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama Lengkap" required />
        <button type="submit" disabled={isLoading || authLoading}>
          {isLoading || authLoading ? "Loading..." : "Login"}
        </button>
      </form>
    </div>
  )
}

export default LoginPage
