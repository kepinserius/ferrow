"use client"
import { AlertCircle } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function VerificationFailedPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const reason = searchParams.get("reason")
  const message = searchParams.get("message")

  let errorMessage = "Terjadi kesalahan saat memverifikasi akun Anda."
  if (reason === "no_token") {
    errorMessage = "Tautan verifikasi tidak valid atau hilang."
  } else if (reason === "invalid_token") {
    errorMessage = "Token verifikasi tidak valid atau sudah digunakan."
  } else if (reason === "update_failed") {
    errorMessage = "Gagal memperbarui status verifikasi akun Anda. Silakan coba lagi."
  } else if (message) {
    errorMessage = decodeURIComponent(message)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-rose-100 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-red-200 text-center max-w-md w-full">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Verifikasi Gagal</h2>
        <p className="text-gray-600 mb-6">{errorMessage}</p>
        <Button
          onClick={() => router.push("/admin/login")} // Atau halaman login utama Anda
          className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200"
        >
          Kembali ke Login
        </Button>
      </div>
    </div>
  )
}
