"use client"
import { motion } from "framer-motion"
import type React from "react"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import { FaLeaf, FaHeart, FaShieldAlt, FaPaw, FaStar, FaUsers } from "react-icons/fa"
import { GiWolfHowl, GiForest, GiMountains } from "react-icons/gi"
import PawBackground from "./PawBackground"

interface PhilosophyFeature {
  icon: React.ReactNode
  title: string
  description: string
  benefit: string
}

const Philosophy = () => {
  const ref = useRef<HTMLDivElement>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Return early loading state if not mounted
  if (!isMounted) {
    return (
      <section className="relative py-20 bg-[#333A2D] overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="mb-6">
              <span className="inline-flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full text-sm font-medium text-ferrow-green-800 border border-ferrow-yellow-400/50">
                <GiWolfHowl className="w-5 h-5" />
                Filosofi FERROW
              </span>
            </div>
            <h2 className="text-5xl lg:text-7xl font-display font-bold text-[#F8F8F8] mb-6">
              <span className="block">FUEL THE</span>
              <span className="text-[#F8F8F8]">
                WILD
              </span>
            </h2>
          </div>
        </div>
      </section>
    )
  }

  const philosophyFeatures: PhilosophyFeature[] = [
    {
      icon: <FaPaw className="w-8 h-8" />,
      title: "Mengurangi Kerontokan Bulu",
      description: "Formula khusus dengan superfood untuk kesehatan kulit dan bulu",
      benefit: "Bulu lebih sehat & berkilau",
    },
    {
      icon: <FaShieldAlt className="w-8 h-8" />,
      title: "Menghilangkan Bau Kotoran",
      description: "Kandungan probiotik alami untuk sistem pencernaan optimal",
      benefit: "Pencernaan lebih sehat",
    },
    {
      icon: <FaHeart className="w-8 h-8" />,
      title: "Meredakan Stres",
      description: "Nutrisi khusus yang mendukung ketenangan dan kesejahteraan mental",
      benefit: "Hewan lebih tenang & bahagia",
    },
  ]

  return (
    <section ref={ref} className="relative py-20 bg-[#A53410] overflow-hidden">
      {/* Paw Background - Fixed to section, visible on red background */}
      <div className="absolute inset-0 z-0">
        <PawBackground 
          variant="light" 
          density="high" 
          animated={true}
          className="opacity-80"
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

      {/* Background Elements - Simple animations without scroll-based transforms */}
      <div className="absolute inset-0 z-2">
        <motion.div
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 right-20 w-64 h-64 rounded-full bg-white/5 blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-40 left-20 w-48 h-48 rounded-full bg-white/3 blur-2xl"
        />
      </div>

      {/* Wild Pattern Overlay */}
      <div className="absolute inset-0 opacity-8 z-3">
        <motion.div 
          className="absolute top-10 left-10"
          animate={{ rotate: [0, 5, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        >
          <GiForest className="w-32 h-32 text-white/20" />
        </motion.div>
        
        <motion.div 
          className="absolute bottom-20 right-20"
          animate={{ rotate: [0, -3, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <GiMountains className="w-40 h-40 text-white/15" />
        </motion.div>

        <motion.div 
          className="absolute top-1/2 left-1/4"
          animate={{
            rotate: [0, 10, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        >
          <GiWolfHowl className="w-24 h-24 text-white/25" />
        </motion.div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full text-sm font-medium text-ferrow-green-800 border border-ferrow-yellow-400/50">
              <GiWolfHowl className="w-5 h-5" />
              Filosofi FERROW
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-5xl lg:text-7xl font-display font-bold text-[#F8F8F8] mb-6"
          >
            <span className="block">FUEL THE</span>
            <span className="bg-clip-text text-[#F8F8F8]">
              WILD
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-xl text-[#F8F8F8] max-w-3xl mx-auto leading-relaxed"
          >
            Menghidupkan naluri alami hewan kesayangan dengan nutrisi premium yang terinspirasi dari alam liar
          </motion.p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-3xl font-bold text-[#F8F8F8]"
              >
                Passion & Kepedulian untuk Keluarga Berbulu
              </motion.h3>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="space-y-4 text-[#F8F8F8] text-lg leading-relaxed"
              >
                <p>
                  <strong className="text-[#F8F8F8]">FERROW</strong> adalah brand makanan anjing dan kucing yang
                  lahir dari passion dan kepedulian terhadap hewan peliharaan. Kami percaya bahwa hewan adalah bagian
                  dari keluarga yang layak mendapatkan perawatan terbaik.
                </p>
                <p>
                  Oleh karena itu, kami menghadirkan produk yang tidak hanya sekedar makanan atau camilan biasa, tetapi
                  memiliki <strong className="text-[#F8F8F8]">added value</strong> yang memberikan manfaat lebih
                  bagi kesehatan dan kesejahteraan mereka.
                </p>
              </motion.div>
            </div>

            {/* Brand Values */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <motion.div 
                className="bg-white/60 backdrop-blur-sm p-6 rounded-xl border border-ferrow-yellow-400/30"
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-ferrow-green-500/20 rounded-full flex items-center justify-center">
                    <FaHeart className="w-6 h-6 text-ferrow-green-600" />
                  </div>
                  <h4 className="font-bold text-ferrow-green-800">Keluarga</h4>
                </div>
                <p className="text-ferrow-green-800 text-sm">
                  Hewan adalah bagian dari keluarga yang berhak mendapat yang terbaik
                </p>
              </motion.div>

              <motion.div 
                className="bg-white/60 backdrop-blur-sm p-6 rounded-xl border border-ferrow-yellow-400/30"
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-ferrow-yellow-400/20 rounded-full flex items-center justify-center">
                    <FaStar className="w-6 h-6 text-ferrow-green-600" />
                  </div>
                  <h4 className="font-bold text-ferrow-green-800">Premium</h4>
                </div>
                <p className="text-ferrow-green-800 text-sm">Kualitas terbaik dengan superfood dan nutrisi optimal</p>
              </motion.div>

              <motion.div 
                className="bg-white/60 backdrop-blur-sm p-6 rounded-xl border border-ferrow-yellow-400/30"
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-ferrow-green-500/20 rounded-full flex items-center justify-center">
                    <FaLeaf className="w-6 h-6 text-ferrow-green-600" />
                  </div>
                  <h4 className="font-bold text-ferrow-green-800">Alami</h4>
                </div>
                <p className="text-ferrow-green-700 text-sm">Terinspirasi dari diet alami predator di alam liar</p>
              </motion.div>

              <motion.div 
                className="bg-white/60 backdrop-blur-sm p-6 rounded-xl border border-ferrow-yellow-400/30"
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-ferrow-yellow-400/20 rounded-full flex items-center justify-center">
                    <FaUsers className="w-6 h-6 text-ferrow-green-600" />
                  </div>
                  <h4 className="font-bold text-ferrow-green-800">Edukasi</h4>
                </div>
                <p className="text-ferrow-green-700 text-sm">
                  Mengedukasi pemilik tentang nutrisi melalui media sosial
                </p>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/images/pilosopi2.jpg"
                alt="FERROW Fuel The Wild Philosophy"
                width={600}
                height={500}
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ferrow-green-800/30 via-transparent to-transparent" />

              {/* Floating Quote */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                viewport={{ once: true }}
                className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-ferrow-yellow-400/50"
              >
                <p className="text-ferrow-green-800 font-medium text-center italic">
                  "Menghidupkan naluri alami dengan nutrisi yang terinspirasi dari alam liar"
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Superfood Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-[#F8F8F8] mb-4">Superfood dengan Manfaat Khusus</h3>
            <p className="text-xl text-[#F8F8F8] max-w-3xl mx-auto">
              Berbeda dari produk lain, FERROW mengandung superfood dengan manfaat khusus yang memberikan solusi nyata
              untuk kesehatan hewan kesayangan
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {philosophyFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-ferrow-yellow-400/30 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <motion.div 
                  className="w-16 h-16 bg-ferrow-green-500/20 rounded-full flex items-center justify-center mb-6 mx-auto"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="text-ferrow-green-600">{feature.icon}</div>
                </motion.div>
                <h4 className="text-xl font-bold text-ferrow-green-800 mb-3 text-center">{feature.title}</h4>
                <p className="text-ferrow-green-700 mb-4 text-center leading-relaxed">{feature.description}</p>
                <div className="bg-ferrow-yellow-400/20 px-4 py-2 rounded-full text-center">
                  <span className="text-ferrow-green-800 font-medium text-sm">{feature.benefit}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <motion.div
            className="bg-white/60 backdrop-blur-sm p-8 rounded-2xl border border-ferrow-yellow-400/30 max-w-4xl mx-auto"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-2xl font-bold text-ferrow-green-800 mb-4">Bergabunglah dengan Komunitas FERROW</h3>
            <p className="text-ferrow-green-700 mb-6 leading-relaxed">
              Dapatkan edukasi lengkap tentang kandungan produk dan tips perawatan hewan melalui media sosial kami.
              Bersama-sama kita wujudkan kesehatan optimal untuk hewan kesayangan.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 text-white rounded-lg font-semibold transition-colors"
                style={{ backgroundColor: "#333A2D" }}
              >
                Jelajahi Produk
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-white/80 text-ferrow-green-800 rounded-lg font-semibold border-2 border-ferrow-yellow-400/50 hover:border-ferrow-yellow-400 transition-colors"
              >
                Ikuti Media Sosial
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default Philosophy
