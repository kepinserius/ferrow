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
  animated = true,
  className = ""
}: PawBackgroundProps) => {
  const [paws, setPaws] = useState<any[]>([])

  const config = {
    light: { opacity: 0.04, colors: ["#2d4a3e", "#3d5a4e"] },
    medium: { opacity: 0.07, colors: ["#1a2e23", "#2d4a3e"] },
    dark: { opacity: 0.12, colors: ["#0f1a14", "#1a2e23"] }
  }

  const pawCounts = { low: 8, medium: 15, high: 25 }
  const currentConfig = config[variant]
  const pawCount = pawCounts[density]

  const generatePaws = () => {
    const paws = []
    for (let i = 0; i < pawCount; i++) {
      paws.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        rotation: Math.random() * 360,
        scale: 0.3 + Math.random() * 0.7,
        delay: Math.random() * 15,
        duration: 12 + Math.random() * 18,
        type: Math.random() > 0.7 ? 'icon' : 'image',
        imageType: Math.random() > 0.5 ? 'simple' : 'logo',
        color: currentConfig.colors[Math.floor(Math.random() * currentConfig.colors.length)]
      })
    }
    return paws
  }

  useEffect(() => {
    setPaws(generatePaws())
  }, [])

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {paws.map((paw) => (
        <motion.div
          key={paw.id}
          className="absolute"
          style={{
            left: `${paw.x}%`,
            top: `${paw.y}%`,
            opacity: currentConfig.opacity,
          }}
          initial={{
            rotate: paw.rotation,
            scale: paw.scale,
          }}
          animate={animated ? {
            rotate: [paw.rotation, paw.rotation + 20, paw.rotation],
            scale: [paw.scale, paw.scale * 1.3, paw.scale],
            y: [0, -25, 0],
            x: [0, Math.sin(paw.id) * 15, 0],
          } : {}}
          transition={{
            duration: paw.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: paw.delay,
          }}
        >
          {paw.type === 'image' ? (
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
                  filter: `brightness(0) saturate(100%) invert(18%) sepia(15%) saturate(1647%) hue-rotate(88deg) brightness(94%) contrast(89%)`,
                }}
              />
            </div>
          ) : (
            <FaPaw 
              size={24} 
              style={{ 
                color: paw.color,
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
              }} 
            />
          )}
        </motion.div>
      ))}

      {density === "high" && (
        <>
          <motion.div
            className="absolute top-10 left-10 w-20 h-20 opacity-20"
            animate={animated ? {
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            } : {}}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo%20Mark%20-%20Black-P8iqXmj4rrZznrCL9Y5helGZTseGxf.png"
              alt="Large paw decoration"
              fill
              sizes="80px"
              className="object-contain"
              style={{
                filter: `brightness(0) saturate(100%) invert(18%) sepia(15%) saturate(1647%) hue-rotate(88deg) brightness(94%) contrast(89%)`,
              }}
            />
          </motion.div>

          <motion.div
            className="absolute bottom-20 right-20 w-24 h-24 opacity-15"
            animate={animated ? {
              rotate: [360, 0],
              scale: [1, 0.8, 1],
            } : {}}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/paw%20black-9roknOcb5cbfiKBVjIErzAg2fuk8ZB.png"
              alt="Large paw decoration"
              fill
              sizes="96px"
              className="object-contain"
              style={{
                filter: `brightness(0) saturate(100%) invert(18%) sepia(15%) saturate(1647%) hue-rotate(88deg) brightness(94%) contrast(89%)`,
              }}
            />
          </motion.div>
        </>
      )}
    </div>
  )
}

export default PawBackground
