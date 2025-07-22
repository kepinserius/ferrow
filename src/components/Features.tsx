'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { FaLeaf, FaSeedling, FaPaw, FaShieldAlt } from 'react-icons/fa';
import Image from 'next/image';

const features = [
  {
    icon: <FaLeaf size={32} className="text-ferrow-red-500" />,
    title: "100% Alami",
    description: "Bahan-bahan alami berkualitas tinggi tanpa pengawet, pewarna, atau perasa buatan."
  },
  {
    icon: <FaSeedling size={32} className="text-ferrow-red-500" />,
    title: "Grain-Free",
    description: "Bebas dari biji-bijian yang dapat menyebabkan alergi dan masalah pencernaan pada hewan."
  },
  {
    icon: <FaPaw size={32} className="text-ferrow-red-500" />,
    title: "Terinspirasi Alam Liar",
    description: "Formula yang dikembangkan berdasarkan pola makan alami predator di alam liar."
  },
  {
    icon: <FaShieldAlt size={32} className="text-ferrow-red-500" />,
    title: "Nutrisi Holistik",
    description: "Memberikan nutrisi lengkap dan seimbang untuk kesehatan optimal hewan kesayangan Anda."
  }
];

const Features = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });
  
  return (
    <section id="features" className="py-24 bg-ferrow-cream-400 relative overflow-hidden">
      {/* Background pattern */}
      {/* Background pattern removed */}
      
      {/* Decorative elements */}
      <motion.div 
        className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-ferrow-red-500/5 blur-3xl"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.2, 0.3]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      
      <motion.div 
        className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-ferrow-yellow-400/10 blur-3xl"
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.3, 0.2]
        }}
        transition={{ 
          duration: 10,
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
            className="inline-block px-4 py-1 mb-4 glass rounded-full text-sm font-medium border border-ferrow-yellow-400/30 text-ferrow-green-800"
          >
            KEUNGGULAN KAMI
          </motion.span>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-ferrow-green-800 mb-4"
          >
            Keunggulan <span className="text-gradient">Makanan Hewan</span> Kami
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg text-ferrow-green-800/80 max-w-2xl mx-auto"
          >
            Kami menghadirkan nutrisi terbaik untuk hewan kesayangan Anda dengan standar kualitas tertinggi
          </motion.p>
        </div>

        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
              className="glass p-8 rounded-2xl hover-card border border-ferrow-yellow-400/30 text-center h-full"
            >
              <div className="flex justify-center mb-6 relative">
                <div className="w-16 h-16 bg-ferrow-cream-300/50 rounded-full flex items-center justify-center shadow-inner relative overflow-hidden group">
                  {/* Animated background */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-ferrow-red-500/20 to-ferrow-yellow-400/20 opacity-50"
                    animate={{ 
                      rotate: [0, 360],
                    }}
                    transition={{ 
                      duration: 10, 
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                  
                  {/* Icon */}
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="relative z-10"
                  >
                    {feature.icon}
                  </motion.div>
                </div>
                
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-ferrow-red-500/10 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              
              <motion.h3 
                className="text-xl font-bold text-ferrow-green-800 mb-4"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                {feature.title}
              </motion.h3>
              
              <p className="text-ferrow-green-800/70">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features; 