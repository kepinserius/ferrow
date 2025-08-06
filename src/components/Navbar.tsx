'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { FaShoppingCart, FaBars, FaTimes } from 'react-icons/fa';
import { useCart } from '@/context/CartContext';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { subTotal } = useCart();
  const pathname = usePathname();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    if (pathname === '/') {
      // Hanya di halaman '/' baru dengar event scroll
      handleScroll(); // supaya langsung deteksi saat refresh
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    } else {
      // Di halaman lain, langsung set solid
      setIsScrolled(true);
    }
  }, [pathname]);
  
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
        backgroundColor: isScrolled ? 'transparent' : 'transparent',
        backdropFilter: 'blur(2px)',
        padding: isScrolled ? '0.5rem 0' : '1rem 0',
        boxShadow: isScrolled ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' : 'none'
      }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Enhanced Logo with Prominent Design */}
          <Link href="/" className="flex items-center relative z-60">
            <motion.div 
              className="relative"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              {/* Background Label/Badge */}
              <div 
                className="absolute inset-0 rounded-xl shadow-2xl transform -rotate-1 scale-110"
                style={{ 
                  backgroundColor: isScrolled ? '#EAD49C' : '#A53410',
                  opacity: 0.9,
                  top: '-8px',
                  bottom: '-8px',
                  left: '-12px',
                  right: '-12px'
                }}
              />
              
              {/* Main Logo Container */}
              <div 
                className="relative bg-white rounded-lg shadow-lg p-3"
                style={{ 
                  width: '180px',
                  height: '70px'
                }}
              >
                <div className="relative w-full h-full">
                  <Image 
                    src={isScrolled ? "/images/LOGO/FINAL-MAIN LOGO-GREEN.png" : "/images/LOGO/FINAL-MAIN LOGO-GREEN.png"}
                    alt="Ferrow Logo"
                    fill
                    sizes="180px"
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
            </motion.div>
          </Link>
          
          {/* Desktop Navigation - Centered */}
          <nav className="hidden md:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2" style={{ fontFamily: "'AKKO', 'Montserrat', 'Inter', sans-serif" }}>
            <Link href="/" className="text-lg md:text-xl font-semibold hover:text-ferrow-yellow-400 transition-all duration-300 animated-underline tracking-wide" style={{ color: isScrolled ? '#333A2D' : '#F8F8F8' }}>
              Beranda
            </Link>
            <Link href="/products" className="text-lg md:text-xl font-semibold hover:text-ferrow-yellow-400 transition-all duration-300 animated-underline tracking-wide" style={{ color: isScrolled ? '#333A2D' : '#F8F8F8' }}>
              Produk
            </Link>
            <Link href="#philosophy" className="text-lg md:text-xl font-semibold hover:text-ferrow-yellow-400 transition-all duration-300 animated-underline tracking-wide" style={{ color: isScrolled ? '#333A2D' : '#F8F8F8' }}>
              Filosofi
            </Link>
            <Link href="#faq" className="text-lg md:text-xl font-semibold hover:text-ferrow-yellow-400 transition-all duration-300 animated-underline tracking-wide" style={{ color: isScrolled ? '#333A2D' : '#F8F8F8' }}>
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
              <FaShoppingCart className="text-2xl" style={{ color: isScrolled ? '#333A2D' : '#FFFFFF' }} />
              {subTotal > 0 && (
                <span 
                  className="absolute -top-1 -right-1 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full"
                  style={{ backgroundColor: '#A53410' }}
                >
                  {subTotal}
                </span>
              )}
            </motion.div>
          </Link>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2"
            style={{ color: isScrolled ? '#EAD49C' : '#FFFFFF' }}
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
              <nav className="flex flex-col space-y-4" style={{ fontFamily: "'AKKO', 'Montserrat', 'Inter', sans-serif" }}>
                <Link 
                  href="/" 
                  className="hover:text-ferrow-yellow-400 transition-all duration-300 py-2 border-b border-ferrow-cream-400/10 font-semibold tracking-wide"
                  style={{ color: isScrolled ? '#333A2D' : '#FFFFFF' }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Beranda
                </Link>
                <Link 
                  href="/products" 
                  className="hover:text-ferrow-yellow-400 transition-all duration-300 py-2 border-b border-ferrow-cream-400/10 font-semibold tracking-wide"
                  style={{ color: isScrolled ? '#333A2D' : '#FFFFFF' }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Produk
                </Link>
                <Link 
                  href="#philosophy" 
                  className="hover:text-ferrow-yellow-400 transition-all duration-300 py-2 border-b border-ferrow-cream-400/10 font-semibold tracking-wide"
                  style={{ color: isScrolled ? '#333A2D' : '#FFFFFF' }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Filosofi
                </Link>
                <Link 
                  href="#testimonials" 
                  className="hover:text-ferrow-yellow-400 transition-all duration-300 py-2 border-b border-ferrow-cream-400/10 font-semibold tracking-wide"
                  style={{ color: isScrolled ? '#333A2D' : '#FFFFFF' }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Testimonial
                </Link>
                <Link 
                  href="#faq" 
                  className="hover:text-ferrow-yellow-400 transition-all duration-300 py-2 font-semibold tracking-wide"
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