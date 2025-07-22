'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { FaArrowLeft, FaShoppingCart, FaPlus, FaMinus, FaCheck } from 'react-icons/fa';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart, CartItem } from '@/context/CartContext';

// Sample product data
const products = [
  {
    id: 1,
    name: "Wild Wolf Formula",
    description: "Makanan anjing premium dengan daging rusa dan bison, kaya akan protein dan nutrisi esensial. Formula ini dirancang khusus untuk memenuhi kebutuhan nutrisi anjing Anda sesuai dengan pola makan alami nenek moyang mereka di alam liar.",
    longDescription: `
      <p>Wild Wolf Formula adalah makanan anjing premium yang terinspirasi dari pola makan serigala di alam liar. Dengan kandungan protein hewani berkualitas tinggi dari daging rusa dan bison, formula ini memberikan nutrisi lengkap yang dibutuhkan anjing Anda untuk tetap sehat dan aktif.</p>
      <p>Keunggulan Wild Wolf Formula:</p>
      <ul>
        <li>80% protein hewani berkualitas tinggi</li>
        <li>Grain-free, cocok untuk anjing dengan sensitivitas makanan</li>
        <li>Diperkaya dengan omega-3 dan omega-6 untuk kesehatan kulit dan bulu</li>
        <li>Mengandung antioksidan alami untuk sistem kekebalan tubuh</li>
        <li>Tanpa pengawet, pewarna, atau perasa buatan</li>
      </ul>
      <p>Tersedia dalam kemasan 2kg, 5kg, dan 10kg.</p>
    `,
    image: "/images/DRIED FOOD/ORI-DOG-FRONT.png",
    category: "Anjing",
    price: 350000,
    weight: "2kg",
    stock: 15,
    rating: 4.8,
    ingredients: "Daging rusa, daging bison, ubi jalar, wortel, blueberry, minyak salmon, vitamin dan mineral esensial",
    nutritionalInfo: "Protein: 38%, Lemak: 18%, Serat: 3.5%, Kelembaban: 10%",
    relatedProducts: [2, 3, 4]
  },
  {
    id: 2,
    name: "Forest Hunter",
    description: "Formula kucing dengan salmon liar dan daging unggas bebas kandang, untuk bulu yang sehat dan berkilau.",
    longDescription: `
      <p>Forest Hunter adalah makanan kucing premium yang dirancang untuk memenuhi kebutuhan nutrisi kucing sebagai karnivora sejati. Dengan kandungan salmon liar dan daging unggas bebas kandang, formula ini memberikan protein berkualitas tinggi yang dibutuhkan kucing Anda.</p>
      <p>Keunggulan Forest Hunter:</p>
      <ul>
        <li>85% protein hewani berkualitas tinggi</li>
        <li>Grain-free, cocok untuk kucing dengan sensitivitas makanan</li>
        <li>Kaya akan omega-3 dari salmon liar untuk kesehatan kulit dan bulu</li>
        <li>Mengandung taurin untuk kesehatan jantung dan mata</li>
        <li>Tanpa pengawet, pewarna, atau perasa buatan</li>
      </ul>
      <p>Tersedia dalam kemasan 1kg, 2.5kg, dan 5kg.</p>
    `,
    image: "/images/DRIED FOOD/ORI-CAT-FRONT.png",
    category: "Kucing",
    price: 320000,
    weight: "1kg",
    stock: 20,
    rating: 4.7,
    ingredients: "Salmon liar, daging ayam bebas kandang, daging kalkun, kentang, cranberry, minyak ikan kod, vitamin dan mineral esensial",
    nutritionalInfo: "Protein: 42%, Lemak: 20%, Serat: 2.5%, Kelembaban: 9%",
    relatedProducts: [1, 3, 4]
  },
  {
    id: 3,
    name: "Prairie Guardian",
    description: "Nutrisi lengkap untuk anjing aktif dengan daging kambing dan rusa, diperkaya dengan sayuran organik.",
    longDescription: `
      <p>Prairie Guardian adalah makanan anjing premium untuk anjing aktif yang membutuhkan asupan energi tinggi. Dengan kandungan daging kambing dan rusa yang kaya protein, serta sayuran organik, formula ini memberikan nutrisi lengkap untuk aktivitas harian anjing Anda.</p>
      <p>Keunggulan Prairie Guardian:</p>
      <ul>
        <li>75% protein hewani berkualitas tinggi</li>
        <li>Grain-free, cocok untuk anjing dengan sensitivitas makanan</li>
        <li>Diperkaya dengan sayuran organik untuk vitamin dan mineral alami</li>
        <li>Mengandung glukosamin dan kondroitin untuk kesehatan sendi</li>
        <li>Tanpa pengawet, pewarna, atau perasa buatan</li>
      </ul>
      <p>Tersedia dalam kemasan 2kg, 5kg, dan 10kg.</p>
    `,
    image: "/images/DRIED FOOD/MIX-DOG-FRONT.png",
    category: "Anjing",
    price: 380000,
    weight: "2kg",
    stock: 12,
    rating: 4.9,
    ingredients: "Daging kambing, daging rusa, ubi jalar, brokoli organik, wortel organik, apel, minyak kelapa, vitamin dan mineral esensial",
    nutritionalInfo: "Protein: 36%, Lemak: 16%, Serat: 4%, Kelembaban: 10%",
    relatedProducts: [1, 2, 4]
  },
  {
    id: 4,
    name: "Mountain Prowler",
    description: "Formula kucing dengan daging kelinci dan bebek, ideal untuk sistem pencernaan yang sensitif.",
    longDescription: `
      <p>Mountain Prowler adalah makanan kucing premium yang dirancang khusus untuk kucing dengan sistem pencernaan sensitif. Dengan kandungan daging kelinci dan bebek yang mudah dicerna, formula ini memberikan nutrisi optimal tanpa menimbulkan masalah pencernaan.</p>
      <p>Keunggulan Mountain Prowler:</p>
      <ul>
        <li>82% protein hewani berkualitas tinggi</li>
        <li>Grain-free dan rendah alergen, ideal untuk kucing sensitif</li>
        <li>Mengandung prebiotik untuk kesehatan pencernaan</li>
        <li>Diperkaya dengan asam lemak omega untuk kulit dan bulu sehat</li>
        <li>Tanpa pengawet, pewarna, atau perasa buatan</li>
      </ul>
      <p>Tersedia dalam kemasan 1kg, 2.5kg, dan 5kg.</p>
    `,
    image: "/images/DRIED FOOD/MIX-CAT-FRONT.png",
    category: "Kucing",
    price: 340000,
    weight: "1kg",
    stock: 18,
    rating: 4.6,
    ingredients: "Daging kelinci, daging bebek, kentang manis, kacang polong, cranberry, minyak salmon, prebiotik, vitamin dan mineral esensial",
    nutritionalInfo: "Protein: 40%, Lemak: 18%, Serat: 3%, Kelembaban: 9%",
    relatedProducts: [1, 2, 3]
  }
];

export default function ProductDetail({ params }: { params: { id: string } }) {
  const productId = parseInt(params.id);
  const product = products.find(p => p.id === productId);
  
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');
  
  const { addToCart, cartItems } = useCart();
  
  // Get product quantity in cart
  const getProductQuantity = (): number => {
    if (!product) return 0;
    const item = cartItems.find(item => item.id === product.id);
    return item ? item.quantity : 0;
  };
  
  const isInCart = getProductQuantity() > 0;
  
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (!product && !isLoading) {
    return (
      <main className="bg-ferrow-cream-400 text-ferrow-green-800 min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 pt-32 pb-20">
          <div className="glass rounded-xl border border-ferrow-yellow-400/30 p-12 text-center">
            <h2 className="text-2xl font-bold mb-4">Produk tidak ditemukan</h2>
            <p className="text-ferrow-green-800/70 mb-8">Maaf, produk yang Anda cari tidak tersedia.</p>
            <Link href="/products">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-primary"
              >
                Kembali ke Produk
              </motion.button>
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }
  
  const handleAddToCart = () => {
    if (product) {
      const cartItem: CartItem = {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        quantity: quantity,
        image: product.image,
        category: product.category
      };
      
      addToCart(cartItem);
    }
  };
  
  const updateQuantity = (newQuantity: number) => {
    if (newQuantity < 1) return;
    if (product && newQuantity > product.stock) return;
    setQuantity(newQuantity);
  };
  
  const relatedProductsData = product ? 
    products.filter(p => product.relatedProducts.includes(p.id)) : [];

  return (
    <main className="bg-ferrow-cream-400 text-ferrow-green-800 min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-32 pb-20">
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
        ) : product ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-ferrow-green-800/60 mb-8">
              <Link href="/" className="hover:text-ferrow-red-500 transition-colors">
                Beranda
              </Link>
              <span>/</span>
              <Link href="/products" className="hover:text-ferrow-red-500 transition-colors">
                Produk
              </Link>
              <span>/</span>
              <span className="text-ferrow-red-500">{product.name}</span>
            </div>
            
            {/* Product Detail */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
              {/* Product Image */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden bg-white p-4"
              >
                <Image 
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain"
                  priority
                />
                <div className="absolute top-4 left-4 glass text-ferrow-green-800 text-sm font-bold px-3 py-1 rounded-full border border-ferrow-yellow-400/30">
                  {product.category}
                </div>
              </motion.div>
              
              {/* Product Info */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < Math.floor(product.rating) ? "text-ferrow-red-500" : "text-ferrow-green-800/30"}>
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-ferrow-green-800/60">({product.rating})</span>
                </div>
                
                <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
                  {product.name}
                </h1>
                
                <p className="text-ferrow-green-800/80 text-lg mb-6">
                  {product.description}
                </p>
                
                <div className="glass rounded-xl border border-ferrow-yellow-400/30 p-6 mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-ferrow-green-800/70">Harga</span>
                    <span className="text-2xl font-bold text-ferrow-red-500">
                      Rp {product.price.toLocaleString('id-ID')}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-ferrow-green-800/70">Ketersediaan</span>
                    {product.stock > 0 ? (
                      <span className="text-ferrow-red-500 font-medium">Tersedia ({product.stock} tersisa)</span>
                    ) : (
                      <span className="text-red-500">Stok Habis</span>
                    )}
                  </div>
                  
                  <div className="flex flex-col md:flex-row items-center gap-4">
                    {/* Quantity */}
                    {!isInCart && (
                      <div className="flex items-center">
                        <button 
                          onClick={() => updateQuantity(quantity - 1)}
                          className="w-10 h-10 flex items-center justify-center glass rounded-l-lg border border-ferrow-yellow-400/30 hover:bg-ferrow-yellow-400/10 transition-colors"
                        >
                          <FaMinus size={14} className="text-ferrow-green-800" />
                        </button>
                        <div className="w-14 h-10 flex items-center justify-center border-y border-ferrow-yellow-400/30 bg-ferrow-cream-300/20">
                          {quantity}
                        </div>
                        <button 
                          onClick={() => updateQuantity(quantity + 1)}
                          className="w-10 h-10 flex items-center justify-center glass rounded-r-lg border border-ferrow-yellow-400/30 hover:bg-ferrow-yellow-400/10 transition-colors"
                        >
                          <FaPlus size={14} className="text-ferrow-green-800" />
                        </button>
                      </div>
                    )}
                    
                    {/* Add to Cart Button */}
                    <Link href={isInCart ? "/cart" : "#"} className="flex-1">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={isInCart ? undefined : handleAddToCart}
                        style={{ backgroundColor: '#A53410' }}
                        className="w-full py-3 px-6 rounded-full flex items-center justify-center gap-2 hover:bg-ferrow-red-600"
                      >
                        {isInCart ? (
                          <>
                            <FaCheck style={{ color: '#EFE4C8' }} />
                            <span style={{ color: '#EFE4C8' }}>Lihat Keranjang ({getProductQuantity()})</span>
                          </>
                        ) : (
                          <>
                            <FaShoppingCart style={{ color: '#EFE4C8' }} />
                            <span style={{ color: '#EFE4C8' }}>Tambahkan ke Keranjang</span>
                          </>
                        )}
                      </motion.button>
                    </Link>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="glass rounded-lg border border-ferrow-yellow-400/30 p-4">
                    <span className="text-ferrow-green-800/60 block mb-1">Berat</span>
                    <span className="font-medium">{product.weight}</span>
                  </div>
                  <div className="glass rounded-lg border border-ferrow-yellow-400/30 p-4">
                    <span className="text-ferrow-green-800/60 block mb-1">Kategori</span>
                    <span className="font-medium">{product.category}</span>
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Product Details Tabs */}
            <div className="mb-16">
              <div className="flex border-b border-ferrow-yellow-400/30 mb-6 overflow-x-auto">
                <button 
                  onClick={() => setActiveTab('description')}
                  className={`px-6 py-3 font-medium transition-colors ${
                    activeTab === 'description' ? 'text-ferrow-red-500 border-b-2 border-ferrow-red-500' : 'text-ferrow-green-800/70 hover:text-ferrow-green-800'
                  }`}
                >
                  Deskripsi
                </button>
                <button 
                  onClick={() => setActiveTab('ingredients')}
                  className={`px-6 py-3 font-medium transition-colors ${
                    activeTab === 'ingredients' ? 'text-ferrow-red-500 border-b-2 border-ferrow-red-500' : 'text-ferrow-green-800/70 hover:text-ferrow-green-800'
                  }`}
                >
                  Bahan
                </button>
                <button 
                  onClick={() => setActiveTab('nutrition')}
                  className={`px-6 py-3 font-medium transition-colors ${
                    activeTab === 'nutrition' ? 'text-ferrow-red-500 border-b-2 border-ferrow-red-500' : 'text-ferrow-green-800/70 hover:text-ferrow-green-800'
                  }`}
                >
                  Informasi Nutrisi
                </button>
              </div>
              
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="glass rounded-xl border border-ferrow-yellow-400/30 p-6"
              >
                {activeTab === 'description' && (
                  <div className="text-ferrow-green-800/80" dangerouslySetInnerHTML={{ __html: product.longDescription }} />
                )}
                
                {activeTab === 'ingredients' && (
                  <div>
                    <h3 className="text-xl font-bold mb-4">Bahan-bahan</h3>
                    <p className="text-ferrow-green-800/80">{product.ingredients}</p>
                  </div>
                )}
                
                {activeTab === 'nutrition' && (
                  <div>
                    <h3 className="text-xl font-bold mb-4">Informasi Nutrisi</h3>
                    <p className="text-ferrow-green-800/80">{product.nutritionalInfo}</p>
                  </div>
                )}
              </motion.div>
            </div>
            
            {/* Related Products */}
            {relatedProductsData.length > 0 && (
              <div>
                <h2 className="text-2xl font-display font-bold mb-6">
                  Produk Terkait
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedProductsData.map((relatedProduct) => (
                    <motion.div 
                      key={relatedProduct.id}
                      whileHover={{ y: -5 }}
                      transition={{ duration: 0.2 }}
                      className="glass rounded-xl border border-ferrow-yellow-400/30 overflow-hidden hover-card"
                    >
                      <Link href={`/products/${relatedProduct.id}`}>
                        <div className="relative h-48 overflow-hidden bg-white p-2">
                          <Image 
                            src={relatedProduct.image}
                            alt={relatedProduct.name}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-contain transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute top-2 right-2 glass text-ferrow-green-800 text-xs font-bold px-2 py-0.5 rounded-full border border-ferrow-yellow-400/30">
                            {relatedProduct.category}
                          </div>
                        </div>
                        
                        <div className="p-4">
                          <h3 className="font-bold mb-1 text-ferrow-green-800">{relatedProduct.name}</h3>
                          <p className="text-ferrow-green-800/60 text-sm mb-2 line-clamp-1">{relatedProduct.description}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-ferrow-red-500 font-bold">
                              Rp {relatedProduct.price.toLocaleString('id-ID')}
                            </span>
                            <div className="text-xs flex items-center">
                              <span className="text-ferrow-red-500 mr-1">★</span>
                              <span>{relatedProduct.rating}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ) : null}
      </div>
      
      <Footer />
    </main>
  );
} 