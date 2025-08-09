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
}

const PawBackground = ({ 
  variant = "light", 
  density = "medium",
  animated = false, // Default ke false untuk tidak bergerak
  className = ""
}: PawBackgroundProps) => {
  const [paws, setPaws] = useState<any[]>([])

  const config = {
    light: { opacity: 0.05, colors: ["#d0d0d0", "#c0c0c0"] },
    medium: { opacity: 0.08, colors: ["#b8b8b8", "#a8a8a8"] },
    dark: { opacity: 0.12, colors: ["#a0a0a0", "#909090"] }
  }

  const currentConfig = config[variant]

  const generateLargePaws = () => {
    const paws = [
      {
        id: 1,
        x: 5, // Kiri atas
        y: 5,
        rotation: -25,
        scale: 8, // Lebih besar lagi
        type: 'image',
        imageType: 'simple',
        color: currentConfig.colors[0]
      },
      {
        id: 2,
        x: 75, // Kanan atas
        y: 8,
        rotation: 35,
        scale: 7.5,
        type: 'image',
        imageType: 'simple',
        color: currentConfig.colors[1]
      },
      {
        id: 3,
        x: 10, // Kiri bawah
        y: 70,
        rotation: 15,
        scale: 9,
        type: 'image',
        imageType: 'simple',
        color: currentConfig.colors[0]
      },
      {
        id: 4,
        x: 80, // Kanan bawah
        y: 75,
        rotation: -20,
        scale: 7,
        type: 'image',
        imageType: 'simple',
        color: currentConfig.colors[1]
      },
      {
        id: 5,
        x: 45, // Tengah atas
        y: 2,
        rotation: 10,
        scale: 6.5,
        type: 'image',
        imageType: 'simple',
        color: currentConfig.colors[0]
      },
      {
        id: 6,
        x: 40, // Tengah bawah
        y: 85,
        rotation: -30,
        scale: 8.5,
        type: 'image',
        imageType: 'simple',
        color: currentConfig.colors[1]
      }
    ]
    return paws
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
          <div className="w-16 h-16 relative">
            <Image
              src={paw.imageType === 'simple' 
                ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/paw%20black-9roknOcb5cbfiKBVjIErzAg2fuk8ZB.png" 
                : "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo%20Mark%20-%20Black-P8iqXmj4rrZznrCL9Y5helGZTseGxf.png"
              }
              alt="Paw pattern"
              fill
              sizes="64px"
              className="object-contain"
              style={{
                filter: `brightness(0) saturate(100%) invert(75%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%)`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export default PawBackground