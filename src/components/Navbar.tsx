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
  const [user, setUser] = useState<any>(null) // untuk deteksi login
  const { subtotal, clearCart } = useCart()
  const pathname = usePathname()
  const router = useRouter()

  // Ambil user dari localStorage saat awal load
  useEffect(() => {
    const storedUser = localStorage.getItem("ferrow-user")
    if (storedUser) setUser(JSON.parse(storedUser))
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("ferrow-user")
    localStorage.removeItem("ferrow-cart")
    clearCart()
    setUser(null)
    router.push("/user/login-user")
  }

  const handleNavigationWithScroll = (sectionId: string) => {
    if (pathname === "/") {
      const element = document.getElementById(sectionId)
      if (element) element.scrollIntoView({ behavior: "smooth" })
    } else {
      router.push(`/#${sectionId}`)
    }
    setIsMobileMenuOpen(false)
  }

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setIsScrolled(currentScrollY > 50)

      if (currentScrollY < 100) {
        setIsVisible(true)
      } else if (currentScrollY > lastScrollY) {
        setIsVisible(false)
        setIsMobileMenuOpen(false)
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    if (pathname === "/") {
      handleScroll()
      window.addEventListener("scroll", handleScroll)
      return () => window.removeEventListener("scroll", handleScroll)
    } else {
      setIsScrolled(true)
      setIsVisible(true)
    }
  }, [pathname, lastScrollY])

  useEffect(() => {
    if (pathname === "/" && window.location.hash) {
      const sectionId = window.location.hash.substring(1)
      setTimeout(() => {
        const element = document.getElementById(sectionId)
        if (element) element.scrollIntoView({ behavior: "smooth" })
      }, 100)
    }
  }, [pathname])

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
            boxShadow: isScrolled
              ? "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
              : "none",
          }}
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center relative z-60">
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    className="relative bg-transparent rounded-lg shadow-lg p-3"
                    style={{ width: "180px", height: "70px" }}
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src="/images/LOGO/FINAL-MAIN LOGO-CREAM.png"
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

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
                <Link href="/" style={{ color: isScrolled ? "#EAD49C" : "#FFF" }}>
                  Beranda
                </Link>
                <Link
                  href="/products"
                  style={{ color: isScrolled ? "#EAD49C" : "#FFF" }}
                >
                  Produk
                </Link>
                <button
                  onClick={() => handleNavigationWithScroll("philosophy")}
                  style={{ color: isScrolled ? "#EAD49C" : "#FFF" }}
                >
                  Filosofi
                </button>
                <button
                  onClick={() => handleNavigationWithScroll("faq")}
                  style={{ color: isScrolled ? "#EAD49C" : "#FFF" }}
                >
                  FAQ
                </button>
              </nav>

              {/* Right Side */}
              <div className="flex items-center space-x-4">
                {/* Cart */}
                <Link href="/cart">
                  <motion.div
                    className="relative p-2"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FaShoppingCart
                      className="text-2xl"
                      style={{ color: isScrolled ? "#EAD49C" : "#FFF" }}
                    />
                    {subtotal > 0 && (
                      <span
                        className="absolute -top-1 -right-1 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full"
                        style={{ backgroundColor: "#A53410" }}
                      >
                        {subtotal}
                      </span>
                    )}
                  </motion.div>
                </Link>

                {/* Logout Button (hanya muncul kalau login) */}
                {user && (
                  <button
                    onClick={handleLogout}
                    className="px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 transition"
                  >
                    Logout
                  </button>
                )}

                {/* Mobile Menu Toggle */}
                <button
                  className="md:hidden p-2"
                  style={{ color: isScrolled ? "#EAD49C" : "#FFF" }}
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
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
                  <nav className="flex flex-col space-y-4">
                    <Link
                      href="/"
                      onClick={() => setIsMobileMenuOpen(false)}
                      style={{ color: isScrolled ? "#333A2D" : "#FFF" }}
                    >
                      Beranda
                    </Link>
                    <Link
                      href="/products"
                      onClick={() => setIsMobileMenuOpen(false)}
                      style={{ color: isScrolled ? "#333A2D" : "#FFF" }}
                    >
                      Produk
                    </Link>
                    <button
                      onClick={() => handleNavigationWithScroll("philosophy")}
                      style={{ color: isScrolled ? "#333A2D" : "#FFF" }}
                    >
                      Filosofi
                    </button>
                    <button
                      onClick={() => handleNavigationWithScroll("faq")}
                      style={{ color: isScrolled ? "#333A2D" : "#FFF" }}
                    >
                      FAQ
                    </button>

                    {/* Logout di Mobile Menu */}
                    {user && (
                      <button
                        onClick={handleLogout}
                        className="px-3 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 transition"
                      >
                        Logout
                      </button>
                    )}
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
