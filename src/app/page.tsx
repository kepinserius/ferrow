"use client"
import { useEffect } from "react"
import Navbar from "@/components/Navbar"
import Hero from "@/components/Hero"
import Features from "@/components/Features"
import Philosophy from "@/components/Philosophy"
import Products from "@/components/Products"
import SusuWedus from "@/components/SusuWedus"
import FAQ from "@/components/FAQ"
import Newsletter from "@/components/Newsletter"
import CallToAction from "@/components/CallToAction"
import Footer from "@/components/Footer"
import ScrollToTop from "@/components/ScrollToTop"
import PawBackground from "@/components/PawBackground"

export default function Home() {
  // Smooth scroll for anchor links
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const anchor = target.closest('a[href^="#"]')
      if (anchor) {
        e.preventDefault()
        const targetId = anchor.getAttribute("href")
        if (targetId && targetId !== "#") {
          const targetElement = document.querySelector(targetId)
          if (targetElement) {
            targetElement.scrollIntoView({
              behavior: "smooth",
              block: "start",
            })
          }
        }
      }
    }
    document.addEventListener("click", handleAnchorClick)
    return () => {
      document.removeEventListener("click", handleAnchorClick)
    }
  }, [])

  return (
    <main className="bg-ferrow-cream-400 text-ferrow-green-800 relative min-h-screen">
      {/* Global Paw Background - Always visible across all sections */}
      <div className="fixed inset-0 z-0">
        <PawBackground variant="light" density="low" animated={true} />
      </div>

      {/* Navigation */}
      <div className="relative z-50">
        <Navbar />
      </div>

      {/* Hero Section with enhanced pattern */}
      <section className="relative z-10">
        <div className="absolute inset-0 z-0">
          <PawBackground variant="medium" density="medium" />
        </div>
        <div className="relative z-10">
          <Hero />
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10">
        <div className="absolute inset-0 z-0">
          <PawBackground variant="light" density="medium" />
        </div>
        <div className="relative z-10">
          <Features />
        </div>
      </section>

      {/* Philosophy Section with high density pattern */}
      <section className="relative z-10">
        <div className="absolute inset-0 z-0">
          <PawBackground variant="medium" density="high" />
        </div>
        <div className="relative z-10">
          <Philosophy />
        </div>
      </section>

      {/* Products Section */}
      <section className="relative z-10">
        <div className="absolute inset-0 z-0">
          <PawBackground variant="light" density="medium" />
        </div>
        <div className="relative z-10">
          <Products />
        </div>
      </section>

      {/* SusuWedus Section with dark pattern */}
      <section className="relative z-10">
        <div className="absolute inset-0 z-0">
          <PawBackground variant="dark" density="high" />
        </div>
        <div className="relative z-10">
          <SusuWedus />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative z-10">
        <div className="absolute inset-0 z-0">
          <PawBackground variant="medium" density="low" />
        </div>
        <div className="relative z-10">
          <FAQ />
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="relative z-10">
        <div className="absolute inset-0 z-0">
          <PawBackground variant="dark" density="medium" />
        </div>
        <div className="relative z-10">
          <Newsletter />
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="relative z-10">
        <div className="absolute inset-0 z-0">
          <PawBackground variant="dark" density="low" />
        </div>
        <div className="relative z-10">
          <CallToAction />
        </div>
      </section>

      {/* Footer */}
      <div className="relative z-10">
        <Footer />
      </div>

      {/* Scroll to Top */}
      <div className="relative z-50">
        <ScrollToTop />
      </div>
    </main>
  )
}
