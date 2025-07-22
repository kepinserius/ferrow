'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { FaFilter, FaSearch, FaShoppingCart, FaStar, FaCheck } from 'react-icons/fa';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart, CartItem } from '@/context/CartContext';

// Sample products data
const products = [
  {
    id: 1,
    name: "Wild Wolf Formula",
    description: "Makanan anjing premium dengan daging rusa dan bison, kaya akan protein dan nutrisi esensial.",
    image: "/images/DRIED FOOD/ORI-DOG-FRONT.png",
    category: "Anjing",
    price: 350000,
    stock: 15,
    rating: 4.8,
    tags: ["premium", "grain-free", "high-protein"]
  },
  {
    id: 2,
    name: "Forest Hunter",
    description: "Formula kucing dengan salmon liar dan daging unggas bebas kandang, untuk bulu yang sehat dan berkilau.",
    image: "/images/DRIED FOOD/ORI-CAT-FRONT.png",
    category: "Kucing",
    price: 320000,
    stock: 20,
    rating: 4.7,
    tags: ["premium", "grain-free", "salmon"]
  },
  {
    id: 3,
    name: "Prairie Guardian",
    description: "Nutrisi lengkap untuk anjing aktif dengan daging kambing dan rusa, diperkaya dengan sayuran organik.",
    image: "/images/DRIED FOOD/MIX-DOG-FRONT.png",
    category: "Anjing",
    price: 380000,
    stock: 12,
    rating: 4.9,
    tags: ["premium", "active", "organic"]
  },
  {
    id: 4,
    name: "Mountain Prowler",
    description: "Formula kucing dengan daging kelinci dan bebek, ideal untuk sistem pencernaan yang sensitif.",
    image: "/images/DRIED FOOD/MIX-CAT-FRONT.png",
    category: "Kucing",
    price: 340000,
    stock: 18,
    rating: 4.6,
    tags: ["premium", "sensitive", "grain-free"]
  }
];

export default function Products() {
  const [isLoading, setIsLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  const { addToCart, cartItems } = useCart();
  
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    // Filter products based on search query and category
    let filtered = [...products];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.description.toLowerCase().includes(query) ||
        product.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    
    setFilteredProducts(filtered);
  }, [searchQuery, selectedCategory]);
  
  const handleAddToCart = (product: typeof products[0]) => {
    const cartItem: CartItem = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: 1,
      image: product.image,
      category: product.category
    };
    
    addToCart(cartItem);
  };
  
  // Get product quantity in cart
  const getProductQuantity = (productId: number): number => {
    const item = cartItems.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };
  
  const categories = Array.from(new Set(products.map(product => product.category)));

  return (
    <main className="bg-ferrow-cream-400 text-ferrow-green-800 min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Produk <span className="text-gradient">Premium</span> Kami
            </h1>
            <p className="text-ferrow-green-800/80 max-w-3xl">
              Makanan hewan premium berbahan alami, grain-free, terinspirasi dari diet predator liar untuk kesehatan optimal hewan kesayangan Anda.
            </p>
          </div>
          
          {/* Search and Filter */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-ferrow-green-800/50" />
                <input
                  type="text"
                  placeholder="Cari produk..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-3 pl-12 pr-4 glass border border-ferrow-green-800/10 rounded-xl focus:outline-none focus:border-ferrow-red-500 transition-colors text-ferrow-green-800"
                />
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:w-auto w-full glass border border-ferrow-green-800/10 rounded-xl px-6 py-3 flex items-center justify-center gap-2 hover:bg-ferrow-green-800/10 transition-colors"
              >
                <FaFilter />
                <span>Filter</span>
              </button>
            </div>
            
            {/* Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 glass border border-ferrow-green-800/10 rounded-xl p-6"
                >
                  <h3 className="font-bold mb-4">Kategori</h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className={`px-4 py-2 rounded-full transition-colors ${
                        selectedCategory === null 
                          ? 'bg-ferrow-red-500 text-white' 
                          : 'glass border border-ferrow-green-800/10 hover:bg-ferrow-green-800/10'
                      }`}
                    >
                      Semua
                    </button>
                    
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-full transition-colors ${
                          selectedCategory === category 
                            ? 'bg-ferrow-red-500 text-white' 
                            : 'glass border border-ferrow-green-800/10 hover:bg-ferrow-green-800/10'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Products Grid */}
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="relative w-20 h-20">
                <motion.div 
                  className="absolute inset-0 rounded-full border-4 border-t-ferrow-red-500 border-r-transparent border-b-transparent border-l-transparent"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              </div>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product, index) => {
                const quantity = getProductQuantity(product.id);
                const isInCart = quantity > 0;
                
                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    className="glass rounded-xl border border-ferrow-yellow-400/30 overflow-hidden hover-card"
                  >
                    <Link href={`/products/${product.id}`}>
                      <div className="relative h-64 overflow-hidden">
                        <Image 
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-contain transition-transform duration-700 ease-in-out group-hover:scale-110 p-4"
                          priority={index < 4}
                        />
                        
                        {/* Category badge */}
                        <div className="absolute top-4 left-4 glass text-ferrow-green-800 text-sm font-bold px-3 py-1 rounded-full border border-ferrow-yellow-400/30">
                          {product.category}
                        </div>
                        
                        {/* Rating */}
                        <div className="absolute bottom-4 left-4 flex items-center bg-white/60 backdrop-blur-sm px-2 py-1 rounded-full">
                          <FaStar className="text-ferrow-red-500 mr-1" />
                          <span className="text-ferrow-green-800 text-sm">{product.rating}</span>
                        </div>
                      </div>
                    </Link>
                    
                    <div className="p-6">
                      <Link href={`/products/${product.id}`}>
                        <h3 className="text-xl font-bold text-ferrow-green-800 mb-2 hover:text-ferrow-red-500 transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-ferrow-green-800/70 mb-4 line-clamp-2">{product.description}</p>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-ferrow-red-500">
                          Rp {product.price.toLocaleString('id-ID')}
                        </span>
                        
                        {isInCart ? (
                          <div className="flex items-center">
                            <span className="text-ferrow-green-800 mr-2 text-sm font-medium">
                              {quantity} di keranjang
                            </span>
                            <Link href="/cart">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-10 h-10 rounded-full bg-ferrow-green-800 flex items-center justify-center"
                              >
                                <FaShoppingCart className="text-ferrow-cream-400" />
                              </motion.button>
                            </Link>
                          </div>
                        ) : (
                          <motion.button
                            onClick={() => {
                              handleAddToCart(product);
                              window.location.href = '/cart';
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 bg-ferrow-green-800 rounded-full flex items-center gap-2 hover:bg-ferrow-green-700 transition-colors"
                          >
                            <FaShoppingCart size={14} className="text-ferrow-cream-400" />
                            <span className="text-ferrow-cream-400">Tambah</span>
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="mb-4 text-ferrow-green-800/50">
                <FaSearch size={48} className="mx-auto" />
              </div>
              <h3 className="text-xl font-bold mb-2">Tidak ada produk ditemukan</h3>
              <p className="text-ferrow-green-800/70 mb-6">
                Coba gunakan kata kunci lain atau reset filter pencarian Anda
              </p>
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory(null);
                }}
                className="px-4 py-2 bg-ferrow-red-500 text-white rounded-full hover:bg-ferrow-red-600 transition-colors"
              >
                Reset Filter
              </button>
            </div>
          )}
        </motion.div>
      </div>
      
      <Footer />
    </main>
  );
} 