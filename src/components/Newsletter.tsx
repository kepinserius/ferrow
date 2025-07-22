'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPaw } from 'react-icons/fa';

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
    <section className="py-16 bg-ferrow-green-800 relative overflow-hidden">
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
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-ferrow-red-500 text-ferrow-cream-400`}
                    />
                    {error && <p className="mt-1 text-red-500 text-sm">{error}</p>}
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="px-6 py-3 bg-ferrow-red-500 hover:bg-ferrow-red-600 text-white font-bold rounded-lg transition-colors flex items-center justify-center"
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