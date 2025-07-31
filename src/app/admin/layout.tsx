import type { ReactNode } from "react"
import { Inter } from "next/font/google"
import { Providers } from "../../components/Providers" // Sesuaikan path jika berbeda

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Admin Dashboard",
  description: "Admin dashboard for managing orders, products, and users.",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  console.log("Admin RootLayout is rendering") // Debugging log
  return (
    // Hapus tag <html> dan <body> di sini.
    // Konten ini akan dirender di dalam <body> dari app/layout.tsx.
    <div className="min-h-screen bg-gray-50">
      <Providers>{children}</Providers> {/* Gunakan Providers di sini */}
    </div>
  )
}
