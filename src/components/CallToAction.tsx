'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaArrowRight, FaPaw } from 'react-icons/fa';
import PawBackground from './PawBackground';

const CallToAction = () => {
  return (
    <section id="cta" className="py-24 bg-ferrow-400 relative overflow-hidden">
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
      {/* Background pattern removed */}
      
      <motion.div 
        className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-ferrow-yellow-400/10 blur-3xl"
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
        <motion.div 
          className="max-w-4xl mx-auto glass rounded-3xl p-10 md:p-16 border border-ferrow-cream-400/20 shadow-xl relative overflow-hidden"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
          viewport={{ once: true }}
        >
          {/* Animated decorative elements */}
          <motion.div 
            className="absolute top-0 right-0 w-32 h-32"
            animate={{ 
              rotate: [0, 360],
            }}
            transition={{ 
              duration: 20, 
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <div className="w-full h-full bg-gradient-to-br from-ferrow-red-500/20 to-ferrow-yellow-400/20 rounded-full blur-xl"></div>
          </motion.div>
          
          <div className="text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="mb-6 inline-block"
            >
              <FaPaw className="text-ferrow-red-500 text-4xl mx-auto" />
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-ferrow-cream-400 mb-6"
            >
              Berikan yang <span className="text-gradient">Terbaik</span> untuk Hewan Kesayangan Anda
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-lg text-ferrow-cream-400/90 mb-10 max-w-2xl mx-auto"
            >
              Nutrisi premium berbahan alami, grain-free, dan terinspirasi dari alam liar untuk kesehatan optimal hewan kesayangan Anda. Mulai perjalanan menuju kehidupan yang lebih sehat untuk mereka sekarang.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row justify-center gap-6"
            >
              <Link href="/products">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-primary flex items-center gap-2 px-8 py-4 text-lg"
                >
                  <span>Jelajahi Produk Kami</span>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <FaArrowRight />
                  </motion.div>
                </motion.button>
              </Link>
              
              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn px-8 py-4 text-lg"
                  style={{ backgroundColor: '#333A2D', color: '#EFE4C8' }}
                >
                  Hubungi Kami
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction; 