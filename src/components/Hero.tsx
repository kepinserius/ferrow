'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaArrowRight } from 'react-icons/fa';

const Hero = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const [isMounted, setIsMounted] = useState(false);
  
  // Parallax effect values
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.3]);
  
  // Decorative elements animation
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    setIsMounted(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      if (ref.current) {
        const { clientX, clientY } = e;
        const { width, height, left, top } = ref.current.getBoundingClientRect();
        
        const x = (clientX - left) / width - 0.5;
        const y = (clientY - top) / height - 0.5;
        
        setMousePosition({ x, y });
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  if (!isMounted) {
    return <div className="h-screen" />;
  }

  return (
    <div ref={ref} className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax */}
      <motion.div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: "url('/images/hero-bg.jpg')", 
          filter: "brightness(0.9)",
          y
        }}
      />

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-ferrow-cream-400 via-ferrow-cream-400/50 to-transparent"></div>

      {/* Animated Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute top-1/4 left-10 w-24 h-24 rounded-full bg-ferrow-red-500/20 blur-xl"
          animate={{
            x: mousePosition.x * -20,
            y: mousePosition.y * -20,
          }}
          transition={{ type: "spring", damping: 10 }}
        />
        <motion.div 
          className="absolute bottom-1/3 right-10 w-32 h-32 rounded-full bg-ferrow-green-500/20 blur-xl"
          animate={{
            x: mousePosition.x * 20,
            y: mousePosition.y * 20,
          }}
          transition={{ type: "spring", damping: 15 }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/4 w-16 h-16 rounded-full bg-ferrow-yellow-400/20 blur-lg"
          animate={{
            x: mousePosition.x * 15,
            y: mousePosition.y * 15,
          }}
          transition={{ type: "spring", damping: 20 }}
        />
      </div>

      {/* Content */}
      <motion.div 
        className="container mx-auto px-4 relative z-10 text-center"
        style={{ opacity }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6"
          >
            <motion.span 
              className="inline-block px-4 py-1 glass rounded-full text-sm font-medium mb-4 border border-ferrow-yellow-400/50 text-ferrow-green-800"
              whileHover={{ 
                scale: 1.05,
                backgroundColor: "rgba(234, 212, 156, 0.3)" 
              }}
            >
              PREMIUM PET NUTRITION
            </motion.span>
          </motion.div>
          
          <motion.h1 
            className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-ferrow-green-800 mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Nutrisi Alami dari <span className="text-gradient">Alam Liar</span>
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl mb-8 max-w-2xl mx-auto"
            style={{ color: '#F8F8F8' }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Makanan hewan premium berbahan alami, grain-free, terinspirasi dari diet predator liar untuk kesehatan optimal hewan kesayangan Anda.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row justify-center gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <Link href="/products">
              <motion.button
                className="btn btn-primary flex items-center justify-center gap-2 group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Jelajahi Produk</span>
                <motion.span
                  initial={{ x: 0 }}
                  animate={{ x: 5 }}
                  transition={{ 
                    repeat: Infinity, 
                    repeatType: "reverse", 
                    duration: 0.6 
                  }}
                >
                  <FaArrowRight />
                </motion.span>
              </motion.button>
            </Link>
            
            <Link href="#philosophy">
              <motion.button
                className="btn"
                style={{ backgroundColor: '#333A2D', color: '#EFE4C8' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Pelajari Filosofi Kami
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Hero; 