"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { useEffect, useState } from "react"
import { FaPaw } from "react-icons/fa"

interface PawBackgroundProps {
  variant?: "light" | "medium" | "dark"
  density?: "low" | "medium" | "high"
  animated?: boolean
  className?: string
  position?: "left" | "right" // Menambahkan prop position untuk mengatur posisi paw
}

const PawBackground = ({ 
  variant = "light", 
  density = "medium",
  animated = false, // Default ke false untuk tidak bergerak
  className = "",
  position = "right" // Default position ke kanan
}: PawBackgroundProps) => {
  const [paws, setPaws] = useState<any[]>([])

  const config = {
    light: { opacity: 0.3, colors: ["#d0d0d0", "#c0c0c0"] },
    medium: { opacity: 0.4, colors: ["#b8b8b8", "#a8a8a8"] },
    dark: { opacity: 0.5, colors: ["#a0a0a0", "#909090"] }
  }

  const currentConfig = config[variant]

  const generateLargePaws = () => {
    // Hanya 1 paw per section berdasarkan posisi
    const rightPositionedPaw = [
      {
        id: 1,
        x: 80, // Kanan
        y: 40, // Tengah section
        rotation: -15,
        scale: 1.5, // Ukuran lebih besar
        type: 'image',
        color: currentConfig.colors[0]
      }
    ]

    const leftPositionedPaw = [
      {
        id: 1,
        x: 5, // Kiri
        y: 40, // Tengah section
        rotation: 15,
        scale: 1.5, // Ukuran lebih besar
        type: 'image',
        color: currentConfig.colors[1]
      }
    ]

    return position === "right" ? rightPositionedPaw : leftPositionedPaw
  }

  useEffect(() => {
    setPaws(generateLargePaws())
  }, [variant])

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {paws.map((paw) => (
        <div
          key={paw.id}
          className="absolute"
          style={{
            left: `${paw.x}%`,
            top: `${paw.y}%`,
            opacity: currentConfig.opacity,
            transform: `rotate(${paw.rotation}deg) scale(${paw.scale})`,
            transformOrigin: 'center',
          }}
        >
          <div className="w-96 h-96 relative">
            <Image
              src="/paw2.png"
              alt="Paw pattern"
              fill
              sizes="384px"
              className="object-contain"
              priority
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export default PawBackground