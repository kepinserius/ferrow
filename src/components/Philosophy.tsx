'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import { FaLeaf, FaPaw } from 'react-icons/fa';

const Philosophy = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.2, 1]);
  const imageOpacity = useTransform(scrollYProgress, [0, 0.3, 0.6], [0.6, 0.8, 1]);
  const textY = useTransform(scrollYProgress, [0, 0.8], [60, 0]);
  
  return (
    <section id="philosophy" ref={ref} className="py-24 bg-ferrow-green-800 text-ferrow-cream-400 relative overflow-hidden">
      {/* Background elements */}
      <motion.div 
        className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-ferrow-yellow-400/10 blur-3xl"
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.3, 0.2]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image Column */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
            viewport={{ once: true }}
            className="relative h-[500px] rounded-2xl overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-ferrow-green-800/80 via-ferrow-green-800/30 to-transparent z-10 rounded-2xl"></div>
            
            <motion.div
              style={{ scale: imageScale, opacity: imageOpacity }}
              className="absolute inset-0"
            >
              <Image
                src="/images/hero-bg.jpg"
                alt="Filosofi Alam Liar"
                fill
                className="object-cover rounded-2xl transition-transform duration-1000 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </motion.div>
            
            {/* Floating elements */}
            <motion.div 
              className="absolute top-10 left-10 z-20 w-16 h-16 bg-ferrow-red-500/20 backdrop-blur-md rounded-full flex items-center justify-center"
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <FaPaw className="text-ferrow-red-400 text-2xl" />
            </motion.div>
            
            <motion.div 
              className="absolute bottom-10 right-10 z-20 w-16 h-16 bg-ferrow-yellow-400/20 backdrop-blur-md rounded-full flex items-center justify-center"
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
              <FaLeaf className="text-ferrow-yellow-400 text-2xl" />
            </motion.div>
          </motion.div>

          {/* Content Column */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
            viewport={{ once: true }}
            style={{ y: textY }}
          >
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1 mb-4 glass rounded-full text-sm font-medium border border-ferrow-yellow-400/30"
            >
              FILOSOFI KAMI
            </motion.span>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-6">
              Filosofi <span className="text-gradient">Alam Liar</span> Kami
            </h2>
            
            <p className="text-ferrow-cream-400/80 mb-6 text-lg">
              Di Ferrow, kami percaya bahwa nutrisi terbaik untuk hewan peliharaan Anda berasal dari alam. Terinspirasi oleh pola makan alami predator di alam liar, kami menciptakan makanan yang memenuhi kebutuhan biologis hewan kesayangan Anda.
            </p>
            
            <p className="text-ferrow-cream-400/80 mb-8 text-lg">
              Setiap formula kami dirancang untuk memberikan nutrisi holistik yang lengkap, dengan kandungan protein hewani berkualitas tinggi dan tanpa bahan-bahan yang tidak diperlukan seperti biji-bijian, pewarna buatan, dan pengawet.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div 
                className="glass p-6 rounded-xl border border-ferrow-yellow-400/30 hover-card"
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
              >
                <div className="w-12 h-12 bg-ferrow-red-500/20 rounded-full flex items-center justify-center mb-4">
                  <FaLeaf className="text-ferrow-red-400 text-xl" />
                </div>
                <h3 className="text-xl font-bold text-ferrow-cream-400 mb-3">Bahan Premium</h3>
                <p className="text-ferrow-cream-400/70">
                  Kami hanya menggunakan bahan-bahan berkualitas tertinggi dari sumber yang terpercaya dan berkelanjutan.
                </p>
              </motion.div>
              
              <motion.div 
                className="glass p-6 rounded-xl border border-ferrow-yellow-400/30 hover-card"
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
              >
                <div className="w-12 h-12 bg-ferrow-red-500/20 rounded-full flex items-center justify-center mb-4">
                  <FaPaw className="text-ferrow-red-400 text-xl" />
                </div>
                <h3 className="text-xl font-bold text-ferrow-cream-400 mb-3">Proses Alami</h3>
                <p className="text-ferrow-cream-400/70">
                  Proses produksi kami menjaga integritas nutrisi dari setiap bahan yang kami gunakan.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Philosophy; 