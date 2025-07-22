'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { FaShoppingCart, FaBars, FaTimes } from 'react-icons/fa';
import { useCart } from '@/context/CartContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartCount } = useCart();
  
  // Handle scroll event to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <motion.header
      className="fixed top-0 left-0 w-full z-50 transition-all duration-300"
      style={{ 
        backgroundColor: isScrolled ? '#EFE4C8' : 'transparent',
        padding: isScrolled ? '0.5rem 0' : '1rem 0',
        boxShadow: isScrolled ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' : 'none'
      }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="relative w-32 h-10">
              <Image 
                src={isScrolled ? "/images/LOGO/FINAL-MAIN LOGO-GREEN.png" : "/images/LOGO/FINAL-MAIN LOGO-WHITE.png"}
                alt="Ferrow Logo"
                fill
                sizes="128px"
                className="object-contain"
                priority
              />
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="hover:text-ferrow-yellow-400 transition-colors animated-underline" style={{ color: isScrolled ? '#333A2D' : '#FFFFFF' }}>
              Beranda
            </Link>
            <Link href="/products" className="hover:text-ferrow-yellow-400 transition-colors animated-underline" style={{ color: isScrolled ? '#333A2D' : '#FFFFFF' }}>
              Produk
            </Link>
            <Link href="#philosophy" className="hover:text-ferrow-yellow-400 transition-colors animated-underline" style={{ color: isScrolled ? '#333A2D' : '#FFFFFF' }}>
              Filosofi
            </Link>
            <Link href="#faq" className="hover:text-ferrow-yellow-400 transition-colors animated-underline" style={{ color: isScrolled ? '#333A2D' : '#FFFFFF' }}>
              FAQ
            </Link>
          </nav>
          
          {/* Cart Icon */}
          <Link href="/cart">
            <motion.div 
              className="relative p-2"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaShoppingCart className="text-xl" style={{ color: isScrolled ? '#333A2D' : '#FFFFFF' }} />
              {cartCount > 0 && (
                <span 
                  className="absolute -top-1 -right-1 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full"
                  style={{ backgroundColor: '#A53410' }}
                >
                  {cartCount}
                </span>
              )}
            </motion.div>
          </Link>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2"
            style={{ color: isScrolled ? '#333A2D' : '#FFFFFF' }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className="md:hidden shadow-lg"
            style={{ backgroundColor: isScrolled ? '#EFE4C8' : '#333A2D' }}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container mx-auto px-4 py-4">
              <nav className="flex flex-col space-y-4">
                <Link 
                  href="/" 
                  className="hover:text-ferrow-yellow-400 transition-colors py-2 border-b border-ferrow-cream-400/10"
                  style={{ color: isScrolled ? '#333A2D' : '#FFFFFF' }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Beranda
                </Link>
                <Link 
                  href="/products" 
                  className="hover:text-ferrow-yellow-400 transition-colors py-2 border-b border-ferrow-cream-400/10"
                  style={{ color: isScrolled ? '#333A2D' : '#FFFFFF' }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Produk
                </Link>
                <Link 
                  href="#philosophy" 
                  className="hover:text-ferrow-yellow-400 transition-colors py-2 border-b border-ferrow-cream-400/10"
                  style={{ color: isScrolled ? '#333A2D' : '#FFFFFF' }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Filosofi
                </Link>
                <Link 
                  href="#testimonials" 
                  className="hover:text-ferrow-yellow-400 transition-colors py-2 border-b border-ferrow-cream-400/10"
                  style={{ color: isScrolled ? '#333A2D' : '#FFFFFF' }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Testimonial
                </Link>
                <Link 
                  href="#faq" 
                  className="hover:text-ferrow-yellow-400 transition-colors py-2"
                  style={{ color: isScrolled ? '#333A2D' : '#FFFFFF' }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  FAQ
                </Link>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar; 