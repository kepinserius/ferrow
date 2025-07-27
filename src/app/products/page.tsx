"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { FaSearch, FaFilter, FaStar, FaShoppingCart, FaInfoCircle } from "react-icons/fa"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { supabase } from "@/lib/supabaseClient"

interface Product {
  id: number
  name: string
  price: number
  stock: number
  image_url?: string
  category: string
  is_active: boolean
  created_at?: string
  description?: string
  rating?: number
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("newest")

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    filterAndSortProducts()
  }, [products, searchTerm, selectedCategory, sortBy])

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })

      if (error) throw error

      if (data) {
        // Add default values for missing fields
        const productsWithDefaults = data.map((product) => ({
          ...product,
          description:
            product.description ||
            `Premium ${product.category.toLowerCase()} product with high-quality ingredients for optimal care.`,
          rating: product.rating || 4.5 + Math.random() * 0.4, // Random rating between 4.5-4.9 if not set
        }))

        setProducts(productsWithDefaults)

        // Extract unique categories
        const uniqueCategories = [...new Set(data.map((product) => product.category))]
        setCategories(uniqueCategories)
      }
    } catch (error) {
      console.error("Error fetching products:", error)
      setError("Failed to load products")
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortProducts = () => {
    let filtered = [...products]

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter((product) => product.category === selectedCategory)
    }

    // Sort products
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "rating":
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      case "newest":
      default:
        filtered.sort((a, b) => new Date(b.created_at || "").getTime() - new Date(a.created_at || "").getTime())
        break
    }

    setFilteredProducts(filtered)
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

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, index) => (
        <div key={index} className="glass rounded-2xl overflow-hidden shadow-lg border border-ferrow-yellow-400/30">
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

  return (
    <main className="bg-ferrow-cream-400 text-ferrow-green-800 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 pt-32 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-ferrow-green-800 mb-4">
            Semua <span className="text-gradient">Produk</span>
          </h1>
          <p className="text-lg text-ferrow-green-800/80 max-w-2xl mx-auto">
            Temukan produk terbaik untuk hewan kesayangan Anda
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass rounded-xl border border-ferrow-yellow-400/30 p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ferrow-green-800/50" />
              <input
                type="text"
                placeholder="Cari produk..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-ferrow-cream-300/50 border border-ferrow-yellow-400/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-ferrow-red-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ferrow-green-800/50" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-ferrow-cream-300/50 border border-ferrow-yellow-400/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-ferrow-red-500 focus:border-transparent appearance-none"
              >
                <option value="All">Semua Kategori</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {getCategoryInIndonesian(category)}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 bg-ferrow-cream-300/50 border border-ferrow-yellow-400/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-ferrow-red-500 focus:border-transparent appearance-none"
              >
                <option value="newest">Terbaru</option>
                <option value="name">Nama A-Z</option>
                <option value="price-low">Harga Terendah</option>
                <option value="price-high">Harga Tertinggi</option>
                <option value="rating">Rating Tertinggi</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Products Grid */}
        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
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
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-ferrow-yellow-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-ferrow-green-800 mb-2">Tidak Ada Produk Ditemukan</h3>
            <p className="text-ferrow-green-800/70">Coba ubah kata kunci pencarian atau filter yang Anda gunakan.</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * (index % 8) }}
                className="group glass rounded-2xl overflow-hidden shadow-lg hover-card h-full border border-ferrow-yellow-400/30"
              >
                <Link href={`/products/${product.id}`} className="block">
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={product.image_url || "/placeholder.svg?height=256&width=256&query=pet product"}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                    />

                    {/* Category badge */}
                    <motion.div
                      className="absolute top-4 left-4 glass text-ferrow-green-800 text-sm font-bold px-3 py-1 rounded-full border border-ferrow-yellow-400/30"
                      whileHover={{ scale: 1.05 }}
                    >
                      {getCategoryInIndonesian(product.category)}
                    </motion.div>

                    {/* Rating */}
                    <div className="absolute bottom-4 left-4 flex items-center bg-white/60 backdrop-blur-sm px-2 py-1 rounded-full">
                      <FaStar className="text-ferrow-red-500 mr-1" />
                      <span className="text-ferrow-green-800 text-sm">{product.rating?.toFixed(1)}</span>
                    </div>

                    {/* Stock indicator */}
                    {product.stock < 10 && product.stock > 0 && (
                      <div className="absolute top-4 right-4 bg-ferrow-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        Stok Terbatas
                      </div>
                    )}

                    {product.stock === 0 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">Stok Habis</span>
                      </div>
                    )}
                  </div>
                </Link>

                <div className="p-6">
                  <Link href={`/products/${product.id}`}>
                    <h3 className="text-xl font-bold text-ferrow-green-800 mb-2 group-hover:text-ferrow-red-500 transition-colors">
                      {product.name}
                    </h3>
                  </Link>

                  <p className="text-ferrow-green-800/70 mb-4 line-clamp-2">{product.description}</p>

                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gradient">Rp {formatPrice(product.price)}</span>

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
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Results count */}
        {!loading && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center mt-8 text-ferrow-green-800/70"
          >
            Menampilkan {filteredProducts.length} dari {products.length} produk
          </motion.div>
        )}
      </div>
      <Footer />
    </main>
  )
}
