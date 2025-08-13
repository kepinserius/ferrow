"use client"
import ProfessionalProductDetail from "./professional-page"

interface Product {
  id: number
  name: string
  code: string
  price: number
  stock: number
  image_url?: string
  category: string
  is_active: boolean
  created_at?: string
  description?: string
  ingredients?: string
  health_benefits?: string
  protein?: number
  fat?: number
  fiber?: number
  moisture?: number
  ash?: number
  calcium?: number
  phosphorus?: number
  rating?: number
}

export default async function ProductDetail({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  // Await the params Promise
  const resolvedParams = await params
  
  return <ProfessionalProductDetail params={resolvedParams} />
}