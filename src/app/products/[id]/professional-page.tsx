"use client"
import React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { FaShoppingCart, FaPlus, FaMinus, FaCheck, FaLeaf, FaHeart, FaShieldAlt, FaTooth } from "react-icons/fa"
import { GiGears } from "react-icons/gi"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { useCart, type CartItem } from "@/context/CartContext"
import { supabase } from "@/lib/supabaseClient"

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

interface NutritionFact {
  label: string
  value: string
  unit: string
}

interface HealthBenefit {
  icon: React.ReactNode
  title: string
  description: string
}

export default function ProfessionalProductDetail({ params }: { params: { id: string } }) {
  const productId = Number.isNaN(Number.parseInt(params.id, 10)) ? null : Number.parseInt(params.id, 10)
  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { addToCart, cartItems } = useCart()

  useEffect(() => {
    if (productId !== null) {
      fetchProduct()
    }
  }, [productId])

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select(`
        id,
        name,
        code,
        price,
        stock,
        image_url,
        category,
        is_active,
        created_at,
        description,
        ingredients,
        health_benefits,
        protein,
        fat,
        fiber,
        moisture,
        ash,
        calcium,
        phosphorus,
        rating
      `)
        .eq("id", productId)
        .eq("is_active", true)
        .single()

      if (error) throw error
      if (data) {
        const productWithDefaults = {
          ...data,
          description:
            data.description ||
            `Premium ${data.category.toLowerCase()} food with high-quality ingredients for optimal nutrition and health.`,
          rating: data.rating || 4.5 + Math.random() * 0.4,
        }
        setProduct(productWithDefaults)
      }
    } catch (error) {
      console.error("Error fetching product:", error)
      setError("Failed to load product")
    } finally {
      setIsLoading(false)
    }
  }

  const getProductQuantity = (): number => {
    if (!product) return 0
    const item = cartItems.find((item) => item.id === product.id)
    return item ? item.quantity : 0
  }

  const isInCart = getProductQuantity() > 0

  const handleAddToCart = () => {
    if (product) {
      const cartItem: CartItem = {
        id: product.id,
        name: product.name,
        description: product.description || "",
        price: product.price,
        quantity: quantity,
        image: product.image_url || "/placeholder.svg",
        category: product.category,
      }
      addToCart(cartItem)
    }
  }

  const updateQuantity = (newQuantity: number) => {
    if (newQuantity < 1) return
    if (product && newQuantity > product.stock) return
    setQuantity(newQuantity)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID").format(price)
  }

  const getNutritionFacts = (product: Product): NutritionFact[] => {
    const facts: NutritionFact[] = []
    if (product.protein) facts.push({ label: "Crude Protein", value: `≥ ${product.protein}`, unit: "%" })
    if (product.fat) facts.push({ label: "Crude Fat", value: `≥ ${product.fat}`, unit: "%" })
    if (product.fiber) facts.push({ label: "Crude Fiber", value: `≤ ${product.fiber}`, unit: "%" })
    if (product.ash) facts.push({ label: "Course Ash", value: `≤ ${product.ash}`, unit: "%" })
    if (product.calcium) facts.push({ label: "Calcium", value: `≥ ${product.calcium}`, unit: "%" })
    if (product.phosphorus) facts.push({ label: "Total Phosphorus", value: `≥ ${product.phosphorus}`, unit: "%" })
    if (product.moisture) facts.push({ label: "Moisture", value: `≤ ${product.moisture}`, unit: "%" })
    // Add some additional standard facts
    facts.push({ label: "Taurine", value: "≥ 0.1", unit: "%" })
    facts.push({ label: "Sodium Chloride", value: "≥ 0.3", unit: "%" })
    return facts
  }

  const getHealthBenefits = (): HealthBenefit[] => [
    {
      icon: <FaLeaf className="w-8 h-8" />,
      title: "Healthy Skin",
      description: "& Coat",
    },
    {
      icon: <FaHeart className="w-8 h-8" />,
      title: "High Quality",
      description: "Meat Protein",
    },
    {
      icon: <FaShieldAlt className="w-8 h-8" />,
      title: "All Health Care",
      description: "Support Needs",
    },
    {
      icon: <FaTooth className="w-8 h-8" />,
      title: "Dental Support",
      description: "Digestive Health",
    },
  ]

  if (isLoading) {
    return (
      <main className="bg-ferrow-cream-400 min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 pt-32 pb-20">
          <div className="flex justify-center items-center py-20">
            <div className="relative w-20 h-20">
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-t-ferrow-green-500 border-r-transparent border-b-transparent border-l-transparent"
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

  if (error || !product) {
    return (
      <main className="bg-ferrow-cream-400 min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 pt-32 pb-20">
          <div className="bg-white rounded-xl border border-ferrow-yellow-400/30 p-12 text-center shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-ferrow-green-800">Product not found</h2>
            <p className="text-ferrow-green-700 mb-8">
              {error || "Sorry, the product you're looking for is not available."}
            </p>
            <Link href="/products">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 rounded-lg transition-colors text-white"
                style={{ backgroundColor: "#333A2D" }}
              >
                Back to Products
              </motion.button>
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  const nutritionFacts = getNutritionFacts(product)
  const healthBenefits = getHealthBenefits()

  return (
    <main className="bg-ferrow-cream-400 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 pt-32 pb-20">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          {/* Header Section */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <h1 className="text-4xl font-bold text-ferrow-green-800">Our Product</h1>
              <div
                className="text-white px-6 py-2 rounded-full text-xl font-medium"
                style={{ backgroundColor: "#333A2D" }}
              >
                {product.category}
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-20 h-20 rounded-full border-4 border-ferrow-green-800 flex items-center justify-center bg-white">
                <div className="text-center">
                  <div className="text-xs font-bold text-ferrow-green-800">GRAIN</div>
                  <div className="text-xs font-bold text-ferrow-green-800">FREE</div>
                </div>
              </div>
              <div className="w-20 h-20 rounded-full border-4 border-ferrow-green-800 flex items-center justify-center bg-white">
                <div className="text-center">
                  <FaLeaf className="w-6 h-6 mx-auto mb-1 text-ferrow-green-500" />
                  <div className="text-xs font-bold text-ferrow-green-800">NATURAL</div>
                  <div className="text-xs font-bold text-ferrow-green-800">100%</div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Number and Name */}
          <div className="mb-8">
            <div
              className="text-white px-6 py-3 rounded-full inline-flex items-center gap-3 text-xl font-medium"
              style={{ backgroundColor: "#333A2D" }}
            >
              <div className="w-8 h-8 bg-ferrow-yellow-400 text-ferrow-green-800 rounded-full flex items-center justify-center font-bold">
                1
              </div>
              {product.code} - {product.name}
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            {/* Left Column - Product Image and Processing Info */}
            <div className="space-y-6">
              <div className="relative">
                <Image
                  src={product.image_url || "/images/cat-kibble.png"}
                  alt={product.name}
                  width={600}
                  height={400}
                  className="w-full h-96 object-cover rounded-lg shadow-lg"
                  priority
                />
              </div>
              <div className="flex items-center gap-4 bg-white/80 backdrop-blur-sm p-4 rounded-lg border border-ferrow-yellow-400/30">
                <div className="w-12 h-12 bg-ferrow-yellow-400/20 rounded-full flex items-center justify-center">
                  <GiGears className="w-6 h-6 text-ferrow-green-500" />
                </div>
                <span className="text-lg font-medium text-ferrow-green-800">Processed using baking techniques</span>
              </div>

              {/* Add to Cart Section */}
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg border border-ferrow-yellow-400/30 shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-ferrow-green-700">Price</span>
                  <span className="text-2xl font-bold text-ferrow-green-500">Rp {formatPrice(product.price)}</span>
                </div>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-ferrow-green-700">Availability</span>
                  {product.stock > 0 ? (
                    <span className="text-ferrow-green-500 font-medium">In Stock ({product.stock} available)</span>
                  ) : (
                    <span className="text-ferrow-red-500">Out of Stock</span>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  {!isInCart && product.stock > 0 && (
                    <div className="flex items-center border border-ferrow-yellow-400/50 rounded-lg bg-white">
                      <button
                        onClick={() => updateQuantity(quantity - 1)}
                        className="w-10 h-10 flex items-center justify-center hover:bg-ferrow-yellow-400/20 transition-colors text-ferrow-green-800"
                      >
                        <FaMinus size={14} />
                      </button>
                      <div className="w-14 h-10 flex items-center justify-center border-x border-ferrow-yellow-400/50 text-ferrow-green-800 font-medium">
                        {quantity}
                      </div>
                      <button
                        onClick={() => updateQuantity(quantity + 1)}
                        className="w-10 h-10 flex items-center justify-center hover:bg-ferrow-yellow-400/20 transition-colors text-ferrow-green-800"
                      >
                        <FaPlus size={14} />
                      </button>
                    </div>
                  )}
                  <Link href={isInCart ? "/cart" : "#"} className="flex-1">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={isInCart ? undefined : handleAddToCart}
                      disabled={product.stock === 0}
                      className="w-full py-3 px-6 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      style={{ backgroundColor: product.stock === 0 ? "#9CA3AF" : "#333A2D" }}
                    >
                      {product.stock === 0 ? (
                        "Out of Stock"
                      ) : isInCart ? (
                        <>
                          <FaCheck className="inline mr-2" />
                          View Cart ({getProductQuantity()})
                        </>
                      ) : (
                        <>
                          <FaShoppingCart className="inline mr-2" />
                          Add to Cart
                        </>
                      )}
                    </motion.button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Column - Nutrition Facts */}
            <div className="space-y-6">
              <div className="text-white p-4 rounded-t-lg" style={{ backgroundColor: "#333A2D" }}>
                <h3 className="text-xl font-bold text-center">TABLE NUTRITION FACTS</h3>
              </div>
              <div className="border border-ferrow-yellow-400/30 rounded-b-lg overflow-hidden bg-white shadow-lg">
                <div className="grid grid-cols-3 gap-0">
                  {nutritionFacts.map((fact, index) => (
                    <React.Fragment key={index}>
                      <div className="p-3 border-b border-r border-ferrow-yellow-400/30 bg-ferrow-yellow-400/10 font-medium text-ferrow-green-800">
                        {fact.label}
                      </div>
                      <div className="p-3 border-b border-r border-ferrow-yellow-400/30 text-center font-bold text-ferrow-green-800">
                        {fact.value}
                        {fact.unit}
                      </div>
                      {index % 3 === 2 && (
                        <div className="p-3 border-b border-ferrow-yellow-400/30 bg-ferrow-yellow-400/10 font-medium text-ferrow-green-800">
                          {index === 2 ? "Taurine" : index === 5 ? "Moisture" : "Sodium Chloride"}
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Ingredients Section */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-ferrow-green-800 mb-4">INGREDIENTS :</h3>
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg border border-ferrow-yellow-400/30 shadow-lg">
              <p className="text-ferrow-green-700 text-lg leading-relaxed">
                {product.ingredients ||
                  "Tuna, Sardine, dehydrated chicken, dehydrated beef, salmon, chicken oil, butter, beet meal, fish oil, egg yolk powder, sheep milk powder, seaweed powder, spirulina, carrots, flaxseed, broccoli."}
              </p>
            </div>
          </div>

          {/* Health Benefits Section */}
          <div>
            <h3 className="text-2xl font-bold text-ferrow-green-800 mb-8">HEALTH BENEFITS :</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {healthBenefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 mx-auto mb-4 bg-ferrow-yellow-400/20 rounded-full flex items-center justify-center text-ferrow-green-500 border border-ferrow-yellow-400/30">
                    {benefit.icon}
                  </div>
                  <h4 className="font-bold text-ferrow-green-800 mb-1">{benefit.title}</h4>
                  <p className="text-ferrow-green-700 text-sm">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </main>
  )
}
