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
        <><Navbar /><Hero /><Features /><Philosophy /><Products /><SusuWedus /><FAQ /><Newsletter /><CallToAction /><Footer /><ScrollToTop /></>
  )
}
