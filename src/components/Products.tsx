"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { FaShoppingCart, FaInfoCircle, FaStar, FaChevronLeft, FaChevronRight, FaPause, FaPlay, FaPaw } from "react-icons/fa"
import { supabase } from "@/lib/supabaseClient"
import PawBackground from "./PawBackground"

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

const Products = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.2 })
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Carousel states
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [itemsPerView, setItemsPerView] = useState(4)
  
  // Auto-slide interval
  useEffect(() => {
    let interval: NodeJS.Timeout
    
    if (isAutoPlaying && products.length > 0) {
      interval = setInterval(() => {
        setCurrentIndex(prev => {
          const maxIndex = Math.max(0, products.length - itemsPerView)
          return prev >= maxIndex ? 0 : prev + 1
        })
      }, 3000) // Auto slide every 3 seconds
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isAutoPlaying, products.length, itemsPerView])

  // Responsive items per view
  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth >= 1024) {
        setItemsPerView(4) // lg: 4 items
      } else if (window.innerWidth >= 768) {
        setItemsPerView(2) // md: 2 items
      } else {
        setItemsPerView(1) // sm: 1 item
      }
    }

    updateItemsPerView()
    window.addEventListener('resize', updateItemsPerView)
    return () => window.removeEventListener('resize', updateItemsPerView)
  }, [])

  useEffect(() => {
    fetchProducts()

    // Real-time subscription for products
    const channel = supabase
      .channel("realtime-products")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "products",
        },
        () => {
          fetchProducts()
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const fetchProducts = async () => {
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
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(12) // Increased limit for carousel

      if (error) throw error

      // Add default values for missing fields
      const productsWithDefaults =
        data?.map((product) => ({
          ...product,
          description:
            product.description ||
            `Premium ${product.category.toLowerCase()} product with high-quality ingredients for optimal nutrition.`,
          rating: product.rating || 4.5 + Math.random() * 0.4,
        })) || []

      setProducts(productsWithDefaults)
    } catch (error) {
      console.error("Error fetching products:", error)
      setError("Failed to load products")
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID").format(price)
  }

  const getCategoryInIndonesian = (category: string) => {
    const categoryMap: Record<string, string> = {
      "Food & Treats": "Makanan & Snack",
      Toys: "Mainan",
      Accessories: "Aksesoris",
      "Health & Care": "Kesehatan",
      Grooming: "Perawatan",
      Bedding: "Tempat Tidur",
      Training: "Pelatihan",
      Other: "Lainnya",
    }
    return categoryMap[category] || category
  }

  // Carousel navigation functions
  const goToPrevious = () => {
    setCurrentIndex(prev => prev === 0 ? Math.max(0, products.length - itemsPerView) : prev - 1)
  }

  const goToNext = () => {
    const maxIndex = Math.max(0, products.length - itemsPerView)
    setCurrentIndex(prev => prev >= maxIndex ? 0 : prev + 1)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying)
  }

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="flex gap-6">
      {[...Array(itemsPerView)].map((_, index) => (
        <div
          key={index}
          className="glass rounded-2xl overflow-hidden shadow-lg h-full border border-ferrow-yellow-400/30 flex-shrink-0"
          style={{ width: `calc(${100 / itemsPerView}% - ${(itemsPerView - 1) * 1.5}rem / ${itemsPerView})` }}
        >
          <div className="relative h-64 bg-gray-200 animate-pulse"></div>
          <div className="p-6 space-y-4">
            <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
            <div className="flex justify-between items-center">
              <div className="h-6 bg-gray-200 rounded animate-pulse w-24"></div>
              <div className="flex gap-2">
                <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  // Error state
  const ErrorState = () => (
    <div className="text-center py-12">
      <div className="text-ferrow-red-500 text-6xl mb-4">⚠️</div>
      <h3 className="text-xl font-bold text-ferrow-green-800 mb-2">Gagal Memuat Produk</h3>
      <p className="text-ferrow-green-800/70 mb-4">{error}</p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={fetchProducts}
        className="btn btn-primary"
      >
        Coba Lagi
      </motion.button>
    </div>
  )

  // Empty state
  const EmptyState = () => (
    <div className="text-center py-12">
      <div className="text-ferrow-yellow-400 text-6xl mb-4">📦</div>
      <h3 className="text-xl font-bold text-ferrow-green-800 mb-2">Belum Ada Produk</h3>
      <p className="text-ferrow-green-800/70">Produk akan segera tersedia. Silakan kembali lagi nanti.</p>
    </div>
  )

  const maxIndex = Math.max(0, products.length - itemsPerView)

  return (
    <section id="products" className="py-24 bg-ferrow-400 relative overflow-hidden">
      {/* Paw Background - Fixed to section, visible on red background */}
            <div className="absolute inset-0 z-0">
              <PawBackground 
                variant="light" 
                density="high" 
                animated={true}
                className="opacity-20"
              />
            </div>
      
            {/* Additional Paw Layer for better visibility on red background */}
            <div className="absolute inset-0 z-1">
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Custom paw prints optimized for red background */}
                <motion.div
                  className="absolute top-10 left-10 w-24 h-24 opacity-15"
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <FaPaw 
                    size={48}
                    style={{ 
                      color: "#F8F8F8", // White color for visibility on red
                      filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))"
                    }} 
                  />
                </motion.div>
      
                <motion.div
                  className="absolute top-1/3 right-10 w-20 h-20 opacity-12"
                  animate={{
                    rotate: [180, -180],
                    scale: [0.8, 1.1, 0.8],
                  }}
                  transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <FaPaw 
                    size={40}
                    style={{ 
                      color: "#EFE4C8", // Cream color for contrast
                      filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.4))"
                    }} 
                  />
                </motion.div>
      
                <motion.div
                  className="absolute bottom-20 left-1/4 w-28 h-28 opacity-10"
                  animate={{
                    rotate: [0, -360],
                    scale: [1.1, 0.9, 1.1],
                  }}
                  transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <FaPaw 
                    size={52}
                    style={{ 
                      color: "#F8F8F8",
                      filter: "drop-shadow(0 5px 10px rgba(0,0,0,0.3))"
                    }} 
                  />
                </motion.div>
      
                <motion.div
                  className="absolute top-2/3 left-10 w-16 h-16 opacity-18"
                  animate={{
                    rotate: [45, 405],
                    scale: [0.9, 1.3, 0.9],
                  }}
                  transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <FaPaw 
                    size={32}
                    style={{ 
                      color: "#A68A64", // Darker cream for variety
                      filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))"
                    }} 
                  />
                </motion.div>
      
                <motion.div
                  className="absolute bottom-1/3 right-1/4 w-22 h-22 opacity-14"
                  animate={{
                    rotate: [90, 450],
                    scale: [1, 0.8, 1],
                  }}
                  transition={{
                    duration: 22,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <FaPaw 
                    size={44}
                    style={{ 
                      color: "#F8F8F8",
                      filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.4))"
                    }} 
                  />
                </motion.div>
              </div>
            </div>
      {/* Background elements */}
      <motion.div
        className="absolute top-0 right-0 w-96 h-96 rounded-full bg-ferrow-yellow-400/10 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1 mb-4 glass rounded-full text-sm font-medium border border-ferrow-yellow-400/50 text-ferrow-green-800"
          >
            PRODUK PREMIUM
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-ferrow-green-800 mb-4"
          >
            Produk <span className="text-gradient">Unggulan</span> Kami
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg text-ferrow-green-800/80 max-w-2xl mx-auto"
          >
            Makanan premium berbahan alami untuk kesehatan optimal hewan kesayangan Anda
          </motion.p>
        </div>

        {/* Product Carousel */}
        <div ref={ref} className="relative">
          {loading ? (
            <LoadingSkeleton />
          ) : error ? (
            <ErrorState />
          ) : products.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="overflow-hidden">
              <motion.div
                className="flex gap-6"
                animate={{
                  x: `calc(-${currentIndex * (100 / itemsPerView)}% - ${currentIndex * 1.5}rem)`
                }}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 10
                }}
                onMouseEnter={() => setIsAutoPlaying(false)}
                onMouseLeave={() => setIsAutoPlaying(true)}
              >
                {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                    transition={{ duration: 0.5, delay: 0.05 * index }}
                    className="group glass rounded-2xl overflow-hidden shadow-lg hover-card h-full border border-ferrow-yellow-400/30 flex-shrink-0"
                    style={{
                      flex: `0 0 ${100 / itemsPerView}%`,
                      maxWidth: `${100 / itemsPerView}%`
                    }}
                    onMouseEnter={() => setHoveredId(product.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    <Link href={`/products/${product.id}`} className="block">
                      <div className="relative h-64 overflow-hidden">
                        <Image
                          src={product.image_url || "/placeholder.svg?height=256&width=256&query=pet food package"}
                          alt={product.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                          priority={index < itemsPerView}
                        />

                        {/* Category badge */}
                        <motion.div
                          className="absolute top-4 left-4 glass text-ferrow-green-800 text-sm font-bold px-3 py-1 rounded-full border border-ferrow-yellow-400/30"
                          whileHover={{ scale: 1.05 }}
                        >
                          {getCategoryInIndonesian(product.category)}
                        </motion.div>

                        {/* Product Code */}
                        <div className="absolute top-4 right-4 glass text-ferrow-green-800 text-xs font-mono px-2 py-1 rounded border border-ferrow-yellow-400/30">
                          {product.code}
                        </div>

                        {/* Rating */}
                        <div className="absolute bottom-4 left-4 flex items-center bg-white/60 backdrop-blur-sm px-2 py-1 rounded-full">
                          <FaStar className="text-ferrow-red-500 mr-1" />
                          <span className="text-ferrow-green-800 text-sm">{product.rating?.toFixed(1)}</span>
                        </div>

                        {/* Stock indicator */}
                        {product.stock < 10 && product.stock > 0 && (
                          <div className="absolute bottom-4 right-4 bg-ferrow-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            Stok Terbatas
                          </div>
                        )}

                        {product.stock === 0 && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="text-white font-bold text-lg">Stok Habis</span>
                          </div>
                        )}

                        {/* Nutrition info overlay on hover */}
                        {hoveredId === product.id && product.protein && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute inset-0 bg-black/80 flex items-center justify-center p-4"
                          >
                            <div className="text-white text-center">
                              <h4 className="font-bold mb-2 text-sm">Nutrition Facts</h4>
                              <div className="grid grid-cols-2 gap-1 text-xs">
                                {product.protein && <div>Protein: {product.protein}%</div>}
                                {product.fat && <div>Fat: {product.fat}%</div>}
                                {product.fiber && <div>Fiber: {product.fiber}%</div>}
                                {product.moisture && <div>Moisture: {product.moisture}%</div>}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </Link>

                    <div className="p-6 flex flex-col justify-between min-h-[260px] h-full">
                      <Link href={`/products/${product.id}`}>
                        <h3 className="text-xl font-bold text-ferrow-green-800 mb-2 group-hover:text-ferrow-red-500 transition-colors">
                          {product.name}
                        </h3>
                      </Link>

                      <p className="text-ferrow-green-800/70 mb-3 line-clamp-2 text-sm">{product.description}</p>

                      {/* Health Benefits Preview */}
                      {product.health_benefits && (
                        <p className="text-ferrow-green-800/60 mb-3 line-clamp-1 text-xs italic">
                          💚 {product.health_benefits.split(",")[0]}...
                        </p>
                      )}

                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-lg font-bold text-gradient">Rp {formatPrice(product.price)}</span>
                          {product.protein && (
                            <div className="text-xs text-ferrow-green-800/60 mt-1">Protein: {product.protein}%</div>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Link href={`/products/${product.id}`}>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="w-10 h-10 rounded-full glass flex items-center justify-center border border-ferrow-yellow-400/30 text-ferrow-green-800 hover:text-ferrow-red-500 transition-colors"
                              aria-label="Lihat detail produk"
                            >
                              <FaInfoCircle />
                            </motion.button>
                          </Link>

                          <Link href="/cart">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              disabled={product.stock === 0}
                              className="w-10 h-10 rounded-full bg-ferrow-green-800 flex items-center justify-center text-ferrow-yellow-400 hover:bg-ferrow-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              aria-label="Lihat keranjang"
                            >
                              <FaShoppingCart />
                            </motion.button>
                          </Link>
                        </div>
                      </div>

                      {/* Stock info */}
                      <div className="mt-2 text-xs text-ferrow-green-800/60">
                        {product.stock > 10
                          ? "Stok tersedia"
                          : product.stock > 0
                            ? `Tersisa ${product.stock} item`
                            : "Stok habis"}
                      </div>

                      {/* Ingredients preview */}
                      {product.ingredients && (
                        <div className="mt-2 pt-2 border-t border-ferrow-yellow-400/20">
                          <p className="text-xs text-ferrow-green-800/50 line-clamp-1">
                            <span className="font-medium">Ingredients:</span> {product.ingredients}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Hover overlay animation */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-ferrow-cream-400/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: hoveredId === product.id && !product.protein ? 0.3 : 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          )}
        </div>

        {/* Carousel Indicators */}
        {!loading && !error && products.length > itemsPerView && (
          <div className="flex justify-center mt-8 gap-2">
            {Array.from({ length: maxIndex + 1 }, (_, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentIndex === index 
                    ? 'bg-ferrow-green-800 scale-110' 
                    : 'bg-ferrow-green-800/30 hover:bg-ferrow-green-800/50'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link href="/products">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn btn-primary">
              Lihat Semua Produk
            </motion.button>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Products