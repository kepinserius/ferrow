"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { FaShoppingCart, FaBars, FaTimes } from "react-icons/fa"
import { useCart } from "@/context/CartContext"
import { usePathname, useRouter } from "next/navigation"

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { subTotal } = useCart()
  const pathname = usePathname()
  const router = useRouter()

  // Function to handle navigation with scroll
  const handleNavigationWithScroll = (sectionId: string) => {
    if (pathname === "/") {
      // If already on home page, just scroll to section
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      // If on different page, navigate to home with hash
      router.push(`/#${sectionId}`)
    }
    setIsMobileMenuOpen(false)
  }

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Set isScrolled untuk styling
      setIsScrolled(currentScrollY > 50)

      // Logic untuk hide/show navbar - langsung responsif
      if (currentScrollY < 100) {
        // Selalu tampilkan navbar di bagian atas
        setIsVisible(true)
      } else if (currentScrollY > lastScrollY) {
        // Scroll ke bawah - langsung sembunyikan navbar
        setIsVisible(false)
        setIsMobileMenuOpen(false) // Tutup mobile menu jika terbuka
      } else if (currentScrollY < lastScrollY) {
        // Scroll ke atas - langsung tampilkan navbar
        setIsVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    if (pathname === "/") {
      // Hanya di halaman '/' baru dengar event scroll
      handleScroll() // supaya langsung deteksi saat refresh
      window.addEventListener("scroll", handleScroll)
      return () => window.removeEventListener("scroll", handleScroll)
    } else {
      // Di halaman lain, langsung set solid dan visible
      setIsScrolled(true)
      setIsVisible(true)
    }
  }, [pathname, lastScrollY])

  // Handle scroll on page load if there's a hash
  useEffect(() => {
    if (pathname === "/" && window.location.hash) {
      const sectionId = window.location.hash.substring(1)
      setTimeout(() => {
        const element = document.getElementById(sectionId)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100) // Small delay to ensure page is loaded
    }
  }, [pathname])

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.header
          className="fixed top-0 left-0 w-full z-50 transition-all duration-300"
          style={{
            backgroundColor: isScrolled ? "#333A2D" : "transparent",
            backdropFilter: isScrolled ? "blur(10px)" : "blur(2px)",
            padding: isScrolled ? "0.5rem 0" : "1rem 0",
            boxShadow: isScrolled ? "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" : "none",
          }}
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              {/* Enhanced Logo with Prominent Design */}
              <Link href="/" className="flex items-center relative z-60">
                <motion.div className="relative" whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                  {/* Main Logo Container */}
                  <div
                    className="relative bg-transparent rounded-lg shadow-lg p-3"
                    style={{
                      width: "180px",
                      height: "70px",
                    }}
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={
                          isScrolled
                            ? "/images/LOGO/FINAL-MAIN LOGO-CREAM.png"
                            : "/images/LOGO/FINAL-MAIN LOGO-CREAM.png"
                        }
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
              <nav
                className="hidden md:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2"
                style={{ fontFamily: "'AKKO', 'Montserrat', 'Inter', sans-serif" }}
              >
                <Link
                  href="/"
                  className="text-lg md:text-xl font-semibold hover:text-ferrow-yellow-400 transition-all duration-300 animated-underline tracking-wide"
                  style={{ color: isScrolled ? "#EAD49C" : "#F8F8F8" }}
                >
                  Beranda
                </Link>
                <Link
                  href="/products"
                  className="text-lg md:text-xl font-semibold hover:text-ferrow-yellow-400 transition-all duration-300 animated-underline tracking-wide"
                  style={{ color: isScrolled ? "#EAD49C" : "#F8F8F8" }}
                >
                  Produk
                </Link>
                <button
                  onClick={() => handleNavigationWithScroll('philosophy')}
                  className="text-lg md:text-xl font-semibold hover:text-ferrow-yellow-400 transition-all duration-300 animated-underline tracking-wide bg-transparent border-none cursor-pointer"
                  style={{ color: isScrolled ? "#EAD49C" : "#F8F8F8" }}
                >
                  Filosofi
                </button>
                <button
                  onClick={() => handleNavigationWithScroll('faq')}
                  className="text-lg md:text-xl font-semibold hover:text-ferrow-yellow-400 transition-all duration-300 animated-underline tracking-wide bg-transparent border-none cursor-pointer"
                  style={{ color: isScrolled ? "#EAD49C" : "#F8F8F8" }}
                >
                  FAQ
                </button>
              </nav>

              {/* Right Side - Cart & Mobile Menu */}
              <div className="flex items-center space-x-4">
                {/* Cart Icon */}
                <Link href="/cart">
                  <motion.div className="relative p-2" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <FaShoppingCart className="text-2xl" style={{ color: isScrolled ? "#EAD49C" : "#FFFFFF" }} />
                    {subTotal > 0 && (
                      <span
                        className="absolute -top-1 -right-1 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full"
                        style={{ backgroundColor: "#A53410" }}
                      >
                        {subTotal}
                      </span>
                    )}
                  </motion.div>
                </Link>

                {/* Mobile Menu Button */}
                <button
                  className="md:hidden p-2"
                  style={{ color: isScrolled ? "#EAD49C" : "#FFFFFF" }}
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  aria-label="Toggle mobile menu"
                >
                  {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                className="md:hidden shadow-lg"
                style={{ backgroundColor: isScrolled ? "#EFE4C8" : "#333A2D" }}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="container mx-auto px-4 py-4">
                  <nav
                    className="flex flex-col space-y-4"
                    style={{ fontFamily: "'AKKO', 'Montserrat', 'Inter', sans-serif" }}
                  >
                    <Link
                      href="/"
                      className="hover:text-ferrow-yellow-400 transition-all duration-300 py-2 border-b border-ferrow-cream-400/10 font-semibold tracking-wide"
                      style={{ color: isScrolled ? "#333A2D" : "#FFFFFF" }}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Beranda
                    </Link>
                    <Link
                      href="/products"
                      className="hover:text-ferrow-yellow-400 transition-all duration-300 py-2 border-b border-ferrow-cream-400/10 font-semibold tracking-wide"
                      style={{ color: isScrolled ? "#333A2D" : "#FFFFFF" }}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Produk
                    </Link>
                    <button
                      onClick={() => handleNavigationWithScroll('philosophy')}
                      className="hover:text-ferrow-yellow-400 transition-all duration-300 py-2 border-b border-ferrow-cream-400/10 font-semibold tracking-wide bg-transparent border-none text-left"
                      style={{ color: isScrolled ? "#333A2D" : "#FFFFFF" }}
                    >
                      Filosofi
                    </button>
                    <button
                      onClick={() => handleNavigationWithScroll('testimonials')}
                      className="hover:text-ferrow-yellow-400 transition-all duration-300 py-2 border-b border-ferrow-cream-400/10 font-semibold tracking-wide bg-transparent border-none text-left"
                      style={{ color: isScrolled ? "#333A2D" : "#FFFFFF" }}
                    >
                      Testimonial
                    </button>
                    <button
                      onClick={() => handleNavigationWithScroll('faq')}
                      className="hover:text-ferrow-yellow-400 transition-all duration-300 py-2 font-semibold tracking-wide bg-transparent border-none text-left"
                      style={{ color: isScrolled ? "#333A2D" : "#FFFFFF" }}
                    >
                      FAQ
                    </button>
                  </nav>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.header>
      )}
    </AnimatePresence>
  )
}

export default Navbar