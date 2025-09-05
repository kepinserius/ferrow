'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaMapMarkerAlt, FaEnvelope, FaPhone, FaTiktok } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer id="footer" className="bg-[#333A2D] bg-ferrow-green-800 text-ferrow-cream-400 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <div className="mb-6">
              <Link href="/" className="inline-block">
                <div className="relative w-40 h-12">
                  <Image 
                    src="/images/LOGO/FINAL-MAIN LOGO-CREAM.png"
                    alt="Ferrow Logo"
                    fill
                    sizes="160px"
                    className="object-contain"
                  />
                </div>
              </Link>
      </div>
            <p className="mb-6 text-[#F8F8F8]">
              Makanan hewan premium berbahan alami, grain-free, terinspirasi dari diet predator liar untuk kesehatan optimal hewan kesayangan Anda.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/share/1DbEV35cLi/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="text-[#F8F8F8] hover:text-ferrow-yellow-400 transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="https://www.instagram.com/ferrowpetfood.id/" target="_blank" rel="noopener noreferrer" className="text-[#F8F8F8] hover:text-ferrow-yellow-400 transition-colors">
                <FaInstagram size={20} />
              </a>
              <a href="https://www.tiktok.com/@ferrow.petfood?_t=ZS-8zTAZUovEQb&_r=1" target="_blank" rel="noopener noreferrer" className="text-[#F8F8F8] hover:text-ferrow-yellow-400 transition-colors">
                <FaTiktok size={20} />
              </a>
              </div>
            </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg text-[#F8F8F8] font-bold mb-6">Tautan Cepat</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-[#F8F8F8] hover:text-ferrow-yellow-400 transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-[#F8F8F8] hover:text-ferrow-yellow-400 transition-colors">
                  Produk
                </Link>
              </li>
              <li>
                <Link href="#philosophy" className="text-[#F8F8F8] hover:text-ferrow-yellow-400 transition-colors">
                  Filosofi
                </Link>
              </li>
              <li>
                <Link href="#testimonials" className="text-[#F8F8F8] hover:text-ferrow-yellow-400 transition-colors">
                  Testimonial
                </Link>
              </li>
              <li>
                <Link href="#faq" className="text-[#F8F8F8] hover:text-ferrow-yellow-400 transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-lg text-[#F8F8F8] font-bold mb-6">Produk Kami</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/products?category=Anjing" className="text-[#F8F8F8] hover:text-ferrow-yellow-400 transition-colors">
                  Makanan Anjing
                </Link>
              </li>
              <li>
                <Link href="/products?category=Kucing" className="text-[#F8F8F8] hover:text-ferrow-yellow-400 transition-colors">
                  Makanan Kucing
                </Link>
              </li>
              <li>
                <Link href="/products?tag=snack" className="text-[#F8F8F8] hover:text-ferrow-yellow-400 transition-colors">
                  Snack Hewan
                </Link>
              </li>
              <li>
                <Link href="/products?tag=supplement" className="text-[#F8F8F8] hover:text-ferrow-yellow-400 transition-colors">
                  Suplemen
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg text-[#F8F8F8] font-bold mb-6">Hubungi Kami</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <FaInstagram className="text-[#F8F8F8] mt-1 mr-3 flex-shrink-0" />
                <span className="text-[#F8F8F8]">
                  ferrowpetfood.id
                </span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="text-[#F8F8F8] mr-3 flex-shrink-0" />
                <a href="mailto:info@ferrow.id" className="text-[#F8F8F8] hover:text-ferrow-yellow-400 transition-colors">
                  ferrowpetfoodid@gmail.com
                </a>
              </li>
              <li className="flex items-center">
                <FaPhone className="text-[#F8F8F8] mr-3 flex-shrink-0" />
                <a href="tel:+6281234567890" className="text-[#F8F8F8] hover:text-ferrow-yellow-400 transition-colors">
                  085124344064
                </a>
              </li>
            </ul>
        </div>
      </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-ferrow-cream-400/10 text-center md:flex md:justify-between md:text-left">
          <p className="text-[#F8F8F8] text-sm mb-4 md:mb-0">
            &copy; {currentYear} Ferrow. Hak Cipta Dilindungi.
          </p>
          <div className="flex justify-center md:justify-end space-x-6 text-sm">
            <Link href="/privacy" className="text-[#F8F8F8] hover:text-ferrow-yellow-400 transition-colors">
              Kebijakan Privasi
            </Link>
            <Link href="/terms" className="text-[#F8F8F8] hover:text-ferrow-yellow-400 transition-colors">
              Syarat & Ketentuan
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 