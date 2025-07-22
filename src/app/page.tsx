'use client';

import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Philosophy from '@/components/Philosophy';
import Products from '@/components/Products';
import Testimonials from '@/components/Testimonials';
import FAQ from '@/components/FAQ';
import Newsletter from '@/components/Newsletter';
import CallToAction from '@/components/CallToAction';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';

export default function Home() {
  // Enable smooth scrolling
  useEffect(() => {
    // Handle anchor links for smooth scrolling
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]');
      
      if (anchor) {
        e.preventDefault();
        const targetId = anchor.getAttribute('href');
        if (targetId && targetId !== '#') {
          const targetElement = document.querySelector(targetId);
          if (targetElement) {
            targetElement.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    
    return () => {
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);
  
  return (
    <main className="bg-ferrow-cream-400 text-ferrow-green-800 overflow-hidden">
      <Navbar />
      <Hero />
      <Features />
      <Philosophy />
      <Products />
      <Testimonials />
      <FAQ />
      <Newsletter />
      <CallToAction />
      <Footer />
      <ScrollToTop />
    </main>
  );
}
