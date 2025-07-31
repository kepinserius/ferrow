"use client"
import { CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function VerificationSuccessPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-green-200 text-center max-w-md w-full">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Verifikasi Berhasil!</h2>
        <p className="text-gray-600 mb-6">Akun Anda telah berhasil diverifikasi. Anda sekarang dapat masuk.</p>
        <Button
          onClick={() => router.push("/admin/login")} // Atau halaman login utama Anda
          className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200"
        >
          Lanjutkan ke Login
        </Button>
      </div>
    </div>
  )
}
