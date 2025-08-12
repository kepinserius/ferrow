'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown, FaPaw, FaQuestionCircle } from 'react-icons/fa';
import PawBackground from './PawBackground';

const faqs = [
  {
    question: "Apa yang membuat makanan Ferrow berbeda?",
    answer: "Ferrow menggunakan bahan-bahan alami premium yang terinspirasi dari pola makan alami hewan di alam liar. Semua produk kami bebas dari biji-bijian (grain-free), tidak mengandung pengawet, pewarna, atau perasa buatan, dan diperkaya dengan nutrisi esensial untuk kesehatan optimal hewan kesayangan Anda."
  },
  {
    question: "Apakah makanan Ferrow cocok untuk semua jenis anjing dan kucing?",
    answer: "Ya, kami memiliki berbagai formula yang dirancang khusus untuk berbagai jenis, ukuran, dan usia anjing dan kucing. Setiap formula mempertimbangkan kebutuhan nutrisi spesifik hewan peliharaan Anda, memastikan mereka mendapatkan semua nutrisi yang dibutuhkan untuk hidup sehat dan aktif."
  },
  {
    question: "Bagaimana cara beralih ke makanan Ferrow?",
    answer: "Kami menyarankan untuk beralih secara bertahap selama 7-10 hari. Mulailah dengan mencampurkan 25% Ferrow dengan 75% makanan lama pada hari 1-3, lalu 50:50 pada hari 4-6, 75:25 pada hari 7-9, dan 100% Ferrow pada hari ke-10. Transisi bertahap ini membantu sistem pencernaan hewan Anda beradaptasi dengan baik."
  },
  {
    question: "Di mana saya bisa membeli produk Ferrow?",
    answer: "Produk Ferrow tersedia di toko kami secara online, serta di berbagai toko hewan peliharaan terpilih di seluruh Indonesia. Kunjungi halaman 'Lokasi' kami untuk menemukan pengecer terdekat, atau belanja langsung melalui website kami untuk pengiriman ke seluruh Indonesia."
  },
  {
    question: "Apakah Ferrow menawarkan sampel produk?",
    answer: "Ya, kami menawarkan paket sampel untuk membantu Anda menentukan formula mana yang paling disukai oleh hewan kesayangan Anda. Kunjungi halaman 'Produk' kami dan cari paket sampel, atau hubungi tim layanan pelanggan kami untuk informasi lebih lanjut."
  }
];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-ferrow-400 relative overflow-hidden">
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
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-ferrow-red-500/0 via-ferrow-red-500 to-ferrow-red-500/0 opacity-30"></div>
      
      <motion.div 
        className="absolute top-20 right-0 w-64 h-64 rounded-full bg-ferrow-yellow-400/10 blur-3xl"
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
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1 mb-4 glass rounded-full text-sm font-medium border border-ferrow-yellow-400/30 text-ferrow-cream-400"
          >
            FAQ
          </motion.span>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-ferrow-cream-400 mb-4"
          >
            Pertanyaan yang Sering <span className="text-gradient">Ditanyakan</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg text-ferrow-cream-400/80 max-w-2xl mx-auto"
          >
            Temukan jawaban untuk pertanyaan umum tentang produk Ferrow
          </motion.p>
        </div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              viewport={{ once: true }}
              className="mb-6"
            >
              <motion.button
                onClick={() => toggleAccordion(index)}
                className={`w-full text-left p-6 rounded-xl flex justify-between items-center transition-all duration-300 ${
                  activeIndex === index 
                    ? 'glass border border-ferrow-red-500/50 shadow-lg shadow-ferrow-red-500/10' 
                    : 'glass border border-ferrow-cream-400/20 hover:border-ferrow-cream-400/40'
                }`}
                whileHover={{ scale: activeIndex === index ? 1 : 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <span className="font-bold text-lg flex items-center">
                  {activeIndex === index ? (
                    <FaQuestionCircle className="text-ferrow-red-500 mr-3" />
                  ) : (
                    <FaQuestionCircle className="text-ferrow-cream-400/50 mr-3" />
                  )}
                  <span className={activeIndex === index ? 'text-ferrow-red-500' : 'text-ferrow-cream-400'}>
                    {faq.question}
                  </span>
                </span>
                <motion.div
                  animate={{ rotate: activeIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
                  className={`w-6 h-6 flex items-center justify-center rounded-full ${
                    activeIndex === index ? 'bg-ferrow-red-500' : 'bg-ferrow-cream-400/10'
                  }`}
                >
                  <FaChevronDown className={`text-sm ${activeIndex === index ? 'text-ferrow-cream-400' : 'text-ferrow-cream-400'}`} />
                </motion.div>
              </motion.button>
              
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, type: "spring", stiffness: 100 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 glass border-x border-b border-ferrow-red-500/20 rounded-b-xl text-ferrow-cream-400/80 mt-1">
                      <motion.p
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                      >
                        {faq.answer}
                      </motion.p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ; 