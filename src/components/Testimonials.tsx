'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { FaStar, FaQuoteLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const testimonials = [
  {
    id: 1,
    name: "Budi Santoso",
    pet: "Bruno, Golden Retriever",
    image: "/images/testimonial-1.jpg",
    stars: 5,
    text: "Bruno sangat menyukai makanan dari Ferrow! Bulunya menjadi lebih berkilau dan energinya meningkat. Saya sangat merekomendasikan untuk semua pemilik anjing."
  },
  {
    id: 2,
    name: "Siti Rahayu",
    pet: "Milo, Persian Cat",
    image: "/images/testimonial-2.jpg",
    stars: 5,
    text: "Kucing saya sangat pemilih dalam makanan, tapi dia langsung menyukai Ferrow! Pencernaannya juga membaik dan tidak ada lagi masalah bulu rontok."
  },
  {
    id: 3,
    name: "Agus Wijaya",
    pet: "Rocky, Siberian Husky",
    image: "/images/testimonial-3.jpg",
    stars: 4,
    text: "Setelah beralih ke Ferrow, Rocky menjadi lebih aktif dan sehat. Saya senang menemukan makanan premium yang benar-benar alami untuk anjing saya."
  }
];

const Testimonials = () => {
  const [current, setCurrent] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  
  useEffect(() => {
    if (!autoplay) return;
    
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [autoplay]);

  const nextSlide = () => {
    setAutoplay(false);
    setCurrent((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setAutoplay(false);
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 bg-ferrow-cream-400 relative">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-display font-bold mb-4"
          >
            Apa Kata <span className="text-ferrow-red-500">Pelanggan Kami</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg text-ferrow-green-800/80 max-w-2xl mx-auto"
          >
            Pengalaman nyata dari pemilik hewan yang telah beralih ke nutrisi premium Ferrow
          </motion.p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Testimonial Slider */}
          <div className="relative h-[400px] md:h-[300px] overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <div className="bg-ferrow-green-800/10 p-8 md:p-10 rounded-xl border border-ferrow-green-800/20 h-full flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10">
                  <div className="flex-shrink-0">
                    <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-ferrow-red-500">
                      <Image
                        src={testimonials[current].image}
                        alt={testimonials[current].name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  
                  <div className="flex-grow text-center md:text-left">
                    <FaQuoteLeft className="text-ferrow-red-500/30 text-4xl mb-4 mx-auto md:mx-0" />
                    <p className="text-ferrow-green-800/90 italic text-lg mb-6">"{testimonials[current].text}"</p>
                    
                    <div>
                      <h3 className="text-xl font-bold text-ferrow-green-800">{testimonials[current].name}</h3>
                      <p className="text-ferrow-green-800/70">{testimonials[current].pet}</p>
                      <div className="flex mt-2 justify-center md:justify-start">
                        {[...Array(5)].map((_, i) => (
                          <FaStar 
                            key={i} 
                            className={`${
                              i < testimonials[current].stars ? 'text-ferrow-red-500' : 'text-ferrow-green-800/20'
                            } mr-1`} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-center mt-8 gap-4">
            <button 
              onClick={prevSlide}
              className="w-10 h-10 rounded-full bg-ferrow-green-800/10 hover:bg-ferrow-red-500 flex items-center justify-center text-ferrow-green-800 hover:text-white transition-colors"
            >
              <FaChevronLeft />
            </button>
            
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button 
                  key={index}
                  onClick={() => {
                    setAutoplay(false);
                    setCurrent(index);
                  }}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === current ? 'bg-ferrow-red-500' : 'bg-ferrow-green-800/20 hover:bg-ferrow-red-500/50'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            
            <button 
              onClick={nextSlide}
              className="w-10 h-10 rounded-full bg-ferrow-green-800/10 hover:bg-ferrow-red-500 flex items-center justify-center text-ferrow-green-800 hover:text-white transition-colors"
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials; 