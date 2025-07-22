'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaMapMarkerAlt, FaEnvelope, FaPhone } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-ferrow-green-800 text-ferrow-cream-400 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <div className="mb-6">
              <Link href="/" className="inline-block">
                <div className="relative w-40 h-12">
                  <Image 
                    src="/images/LOGO/FINAL-MAIN LOGO-GREEN.png"
                    alt="Ferrow Logo"
                    fill
                    sizes="160px"
                    className="object-contain"
                  />
                </div>
              </Link>
      </div>
            <p className="mb-6 text-ferrow-cream-400/80">
              Makanan hewan premium berbahan alami, grain-free, terinspirasi dari diet predator liar untuk kesehatan optimal hewan kesayangan Anda.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-ferrow-cream-400/80 hover:text-ferrow-yellow-400 transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-ferrow-cream-400/80 hover:text-ferrow-yellow-400 transition-colors">
                <FaInstagram size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-ferrow-cream-400/80 hover:text-ferrow-yellow-400 transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-ferrow-cream-400/80 hover:text-ferrow-yellow-400 transition-colors">
                <FaYoutube size={20} />
              </a>
              </div>
            </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6">Tautan Cepat</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-ferrow-cream-400/80 hover:text-ferrow-yellow-400 transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-ferrow-cream-400/80 hover:text-ferrow-yellow-400 transition-colors">
                  Produk
                </Link>
              </li>
              <li>
                <Link href="#philosophy" className="text-ferrow-cream-400/80 hover:text-ferrow-yellow-400 transition-colors">
                  Filosofi
                </Link>
              </li>
              <li>
                <Link href="#testimonials" className="text-ferrow-cream-400/80 hover:text-ferrow-yellow-400 transition-colors">
                  Testimonial
                </Link>
              </li>
              <li>
                <Link href="#faq" className="text-ferrow-cream-400/80 hover:text-ferrow-yellow-400 transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-lg font-bold mb-6">Produk Kami</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/products?category=Anjing" className="text-ferrow-cream-400/80 hover:text-ferrow-yellow-400 transition-colors">
                  Makanan Anjing
                </Link>
              </li>
              <li>
                <Link href="/products?category=Kucing" className="text-ferrow-cream-400/80 hover:text-ferrow-yellow-400 transition-colors">
                  Makanan Kucing
                </Link>
              </li>
              <li>
                <Link href="/products?tag=snack" className="text-ferrow-cream-400/80 hover:text-ferrow-yellow-400 transition-colors">
                  Snack Hewan
                </Link>
              </li>
              <li>
                <Link href="/products?tag=supplement" className="text-ferrow-cream-400/80 hover:text-ferrow-yellow-400 transition-colors">
                  Suplemen
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-6">Hubungi Kami</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <FaMapMarkerAlt className="text-ferrow-red-500 mt-1 mr-3 flex-shrink-0" />
                <span className="text-ferrow-cream-400/80">
                  Jl. Contoh No. 123, Jakarta Selatan, Indonesia 12345
                </span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="text-ferrow-red-500 mr-3 flex-shrink-0" />
                <a href="mailto:info@ferrow.id" className="text-ferrow-cream-400/80 hover:text-ferrow-yellow-400 transition-colors">
                  info@ferrow.id
                </a>
              </li>
              <li className="flex items-center">
                <FaPhone className="text-ferrow-red-500 mr-3 flex-shrink-0" />
                <a href="tel:+6281234567890" className="text-ferrow-cream-400/80 hover:text-ferrow-yellow-400 transition-colors">
                  +62 812-3456-7890
                </a>
              </li>
            </ul>
        </div>
      </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-ferrow-cream-400/10 text-center md:flex md:justify-between md:text-left">
          <p className="text-ferrow-cream-400/60 text-sm mb-4 md:mb-0">
            &copy; {currentYear} Ferrow. Hak Cipta Dilindungi.
          </p>
          <div className="flex justify-center md:justify-end space-x-6 text-sm">
            <Link href="/privacy" className="text-ferrow-cream-400/60 hover:text-ferrow-yellow-400 transition-colors">
              Kebijakan Privasi
            </Link>
            <Link href="/terms" className="text-ferrow-cream-400/60 hover:text-ferrow-yellow-400 transition-colors">
              Syarat & Ketentuan
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 