"use client"

import type React from "react"
import { AuthProvider } from "@/context/AuthContext"
import { CartProvider } from "@/context/CartContext"

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  console.log("Rendering Providers component") // Debugging log
  return (
    <AuthProvider>
      <CartProvider>{children}</CartProvider>
    </AuthProvider>
  )
}
