'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowUp } from 'react-icons/fa';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20,
            duration: 0.3 
          }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg group overflow-hidden"
          style={{ backgroundColor: '#A53410', border: '1px solid rgba(255, 255, 255, 0.1)' }}
          aria-label="Scroll to top"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {/* Background animation */}
          <motion.div 
            className="absolute inset-0"
            style={{ backgroundColor: 'rgba(239, 228, 200, 0.2)' }}
            initial={{ y: "100%" }}
            whileHover={{ y: 0 }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Icon animation */}
          <motion.div
            animate={{ 
              y: [0, -3, 0],
            }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
            className="relative z-10"
          >
            <FaArrowUp className="text-xl transition-colors" style={{ color: '#EFE4C8' }} />
          </motion.div>
          
          {/* Ripple effect on click */}
          <span className="absolute inset-0 rounded-full overflow-hidden">
            <span className="ripple-effect" style={{ backgroundColor: 'rgba(239, 228, 200, 0.3)' }}></span>
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop; 