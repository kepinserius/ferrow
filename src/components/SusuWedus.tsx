"use client"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { FaArrowRight, FaLeaf, FaHeart, FaPaw } from "react-icons/fa"
import { GiMilkCarton } from "react-icons/gi"
import PawBackground from "./PawBackground"

const GoatMilkHero = () => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return <div className="h-screen" />
  }

  return (
    <section className="relative min-h-screen bg-[#A53410] overflow-hidden">
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
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-ferrow-green-500" />
        <div className="absolute bottom-40 right-32 w-24 h-24 rounded-full bg-ferrow-yellow-400" />
        <div className="absolute top-1/2 left-1/4 w-16 h-16 rounded-full bg-ferrow-red-500" />
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm font-medium text-ferrow-green-800 border border-ferrow-yellow-400/50">
                <GiMilkCarton className="w-4 h-4" />
                Panduan Kesehatan Premium
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <h1 className="text-5xl lg:text-6xl font-display text-[#F8F8F8] leading-tight">
                Makanan anjing & kucing yang <span className="italic text-ferrow-green-600 font-script">sehat</span>
              </h1>
            </motion.div>

            {/* Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <h2 className="text-xl lg:text-2xl font-semibold text-[#F8F8F8] mb-4">
                Diperkaya susu domba & kambing berkualitas tinggi untuk nutrisi optimal hewan kesayangan
              </h2>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="space-y-4"
            >
              <p className="text-[#F8F8F8] text-lg leading-relaxed">
                Susu domba dan kambing mengandung protein berkualitas tinggi, kalsium, dan nutrisi penting yang mudah
                dicerna untuk kesehatan optimal anjing dan kucing Anda.
              </p>
              <p className="text-[#F8F8F8] text-lg leading-relaxed">
                Dengan pengalaman bertahun-tahun dalam nutrisi hewan, kami menghadirkan formula premium yang
                menggabungkan bahan alami terbaik untuk mendukung pertumbuhan dan kesehatan hewan kesayangan.
              </p>
            </motion.div>

            {/* Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm p-4 rounded-lg border border-ferrow-yellow-400/30">
                <div className="w-10 h-10 bg-ferrow-green-500/20 rounded-full flex items-center justify-center">
                  <GiMilkCarton className="w-5 h-5 text-ferrow-green-600" />
                </div>
                <div>
                  <div className="font-semibold text-ferrow-green-800 text-sm">Susu Premium</div>
                  <div className="text-ferrow-green-600 text-xs">Domba & Kambing</div>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm p-4 rounded-lg border border-ferrow-yellow-400/30">
                <div className="w-10 h-10 bg-ferrow-green-500/20 rounded-full flex items-center justify-center">
                  <FaLeaf className="w-5 h-5 text-ferrow-green-600" />
                </div>
                <div>
                  <div className="font-semibold text-ferrow-green-800 text-sm">100% Natural</div>
                  <div className="text-ferrow-green-600 text-xs">Tanpa Pengawet</div>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm p-4 rounded-lg border border-ferrow-yellow-400/30">
                <div className="w-10 h-10 bg-ferrow-green-500/20 rounded-full flex items-center justify-center">
                  <FaHeart className="w-5 h-5 text-ferrow-green-600" />
                </div>
                <div>
                  <div className="font-semibold text-ferrow-green-800 text-sm">Mudah Dicerna</div>
                  <div className="text-ferrow-green-600 text-xs">Nutrisi Optimal</div>
                </div>
              </div>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <Link href="/products">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-white/90 backdrop-blur-sm text-ferrow-green-800 font-semibold rounded-lg border-2 border-ferrow-yellow-400/50 hover:border-ferrow-yellow-400 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <span>LIHAT SELENGKAPNYA</span>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                  >
                    <FaArrowRight className="w-4 h-4" />
                  </motion.div>
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative">
              {/* Main Image */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/susuDomba.jpg"
                  alt="Premium goat milk pet food ingredients"
                  width={600}
                  height={400}
                  className="w-full h-[500px] object-cover"
                  priority
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              </div>

              {/* Floating Elements */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="absolute -top-6 -left-6 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-ferrow-yellow-400/30"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-ferrow-green-500/20 rounded-full flex items-center justify-center">
                    <GiMilkCarton className="w-6 h-6 text-ferrow-green-600" />
                  </div>
                  <div>
                    <div className="font-bold text-ferrow-green-800">Susu Premium</div>
                    <div className="text-sm text-ferrow-green-600">Domba & Kambing</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="absolute -bottom-6 -right-6 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-ferrow-yellow-400/30"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-ferrow-yellow-400/20 rounded-full flex items-center justify-center">
                    <FaLeaf className="w-6 h-6 text-ferrow-green-600" />
                  </div>
                  <div>
                    <div className="font-bold text-ferrow-green-800">100% Natural</div>
                    <div className="text-sm text-ferrow-green-600">Grain Free</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1200 120" fill="none" className="w-full h-20">
          <path d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z" fill="white" fillOpacity="0.1" />
        </svg>
      </div>
    </section>
  )
}

export default GoatMilkHero;
