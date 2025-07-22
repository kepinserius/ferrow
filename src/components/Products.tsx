'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaShoppingCart, FaInfoCircle, FaStar } from 'react-icons/fa';

const products = [
  {
    id: 1,
    name: "Wild Wolf Formula",
    description: "Makanan anjing premium dengan daging rusa dan bison, kaya akan protein dan nutrisi esensial.",
    image: "/images/DRIED FOOD/ORI-DOG-FRONT.png",
    category: "Anjing",
    price: 350000,
    rating: 4.8
  },
  {
    id: 2,
    name: "Forest Hunter",
    description: "Formula kucing dengan salmon liar dan daging unggas bebas kandang, untuk bulu yang sehat dan berkilau.",
    image: "/images/DRIED FOOD/ORI-CAT-FRONT.png",
    category: "Kucing",
    price: 320000,
    rating: 4.7
  },
  {
    id: 3,
    name: "Prairie Guardian",
    description: "Nutrisi lengkap untuk anjing aktif dengan daging kambing dan rusa, diperkaya dengan sayuran organik.",
    image: "/images/DRIED FOOD/MIX-DOG-FRONT.png",
    category: "Anjing",
    price: 380000,
    rating: 4.9
  },
  {
    id: 4,
    name: "Mountain Prowler",
    description: "Formula kucing dengan daging kelinci dan bebek, ideal untuk sistem pencernaan yang sensitif.",
    image: "/images/DRIED FOOD/MIX-CAT-FRONT.png",
    category: "Kucing",
    price: 340000,
    rating: 4.6
  }
];

const Products = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <section id="products" className="py-24 bg-ferrow-cream-400 relative overflow-hidden">
      {/* Background elements */}
      <motion.div 
        className="absolute top-0 right-0 w-96 h-96 rounded-full bg-ferrow-yellow-400/10 blur-3xl"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse"
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

        {/* Product Grid - Modern Design */}
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="group glass rounded-2xl overflow-hidden shadow-lg hover-card h-full border border-ferrow-yellow-400/30"
              onMouseEnter={() => setHoveredId(product.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <Link href={`/products/${product.id}`} className="block">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                    priority={index < 2}
                  />
                  
                  {/* Category badge */}
                  <motion.div 
                    className="absolute top-4 left-4 glass text-ferrow-green-800 text-sm font-bold px-3 py-1 rounded-full border border-ferrow-yellow-400/30"
                    whileHover={{ scale: 1.05 }}
                  >
                    {product.category}
                  </motion.div>
                  
                  {/* Rating */}
                  <div className="absolute bottom-4 left-4 flex items-center bg-white/60 backdrop-blur-sm px-2 py-1 rounded-full">
                    <FaStar className="text-ferrow-red-500 mr-1" />
                    <span className="text-ferrow-green-800 text-sm">{product.rating}</span>
                  </div>
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
                  <span className="text-lg font-bold text-gradient">
                    Rp {product.price.toLocaleString('id-ID')}
                  </span>
                  
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
                        className="w-10 h-10 rounded-full bg-ferrow-green-800 flex items-center justify-center text-ferrow-yellow-400 hover:bg-ferrow-green-700 transition-colors"
                        aria-label="Lihat keranjang"
                      >
                        <FaShoppingCart />
                      </motion.button>
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* Hover overlay animation */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-t from-ferrow-cream-400/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: hoveredId === product.id ? 0.3 : 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/products">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-primary"
            >
              Lihat Semua Produk
            </motion.button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Products; 