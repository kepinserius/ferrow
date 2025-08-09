'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPaw } from 'react-icons/fa';
import PawBackground from './PawBackground';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Basic email validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Mohon masukkan alamat email yang valid');
      return;
    }
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setEmail('');
    }, 1500);
  };

  return (
    <section className="py-16 bg-ferrow-400 relative overflow-hidden">
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
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto bg-ferrow-cream-400/10 rounded-2xl p-8 md:p-10 border border-ferrow-cream-400/30 backdrop-blur-sm">
          {!submitted ? (
            <div>
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-ferrow-red-500/20 mb-4"
                >
                  <FaPaw className="text-3xl text-ferrow-red-500" />
                </motion.div>
                
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="text-2xl md:text-3xl font-display font-bold text-ferrow-cream-400 mb-3"
                >
                  Bergabunglah dengan Keluarga Ferrow
                </motion.h2>
                
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="text-ferrow-cream-400/80 max-w-lg mx-auto"
                >
                  Dapatkan tips perawatan hewan, diskon eksklusif, dan informasi produk terbaru langsung ke inbox Anda.
                </motion.p>
              </div>
              
              <motion.form 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                onSubmit={handleSubmit}
                className="max-w-lg mx-auto"
              >
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-grow">
                    <input 
                      type="email" 
                      placeholder="Alamat Email Anda" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full px-4 py-3 bg-ferrow-cream-400/5 border ${
                        error ? 'border-red-500' : 'border-ferrow-cream-400/30'
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-ferrow-red-500 text-ferrow-cream-800`}
                    />
                    {error && <p className="mt-1 text-red-500 text-sm">{error}</p>}
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="px-6 py-3 bg-ferrow-red-500 hover:bg-ferrow-red-600 text-ferrow-red-500 font-bold rounded-lg transition-colors flex items-center justify-center"
                  >
                    {loading ? (
                      <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      'Berlangganan'
                    )}
                  </button>
                </div>
              </motion.form>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-ferrow-yellow-400/20 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-ferrow-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h2 className="text-2xl md:text-3xl font-display font-bold text-ferrow-cream-400 mb-3">
                Terima Kasih Telah Berlangganan!
              </h2>
              
              <p className="text-ferrow-cream-400/80 max-w-lg mx-auto">
                Kami telah mengirimkan email konfirmasi. Periksa inbox Anda untuk mengonfirmasi langganan.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Newsletter; 