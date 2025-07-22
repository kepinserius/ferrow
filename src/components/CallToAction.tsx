'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaArrowRight, FaPaw } from 'react-icons/fa';

const CallToAction = () => {
  return (
    <section id="cta" className="py-24 bg-ferrow-green-800 relative overflow-hidden">
      {/* Background elements */}
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