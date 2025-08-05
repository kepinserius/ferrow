'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import { FaLeaf, FaPaw } from 'react-icons/fa';

const Philosophy = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.2, 1]);
  const imageOpacity = useTransform(scrollYProgress, [0, 0.3, 0.6], [0.6, 0.8, 1]);
  const textY = useTransform(scrollYProgress, [0, 0.8], [60, 0]);
  
  return (
    <section id="philosophy" ref={ref} className="py-24 bg-ferrow-green-800 text-ferrow-cream-400 relative overflow-hidden">
      {/* Background elements */}
      <motion.div 
        className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-ferrow-yellow-400/10 blur-3xl"
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.3, 0.2]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image Column */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
            viewport={{ once: true }}
            className="relative h-[500px] rounded-2xl overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-ferrow-green-800/80 via-ferrow-green-800/30 to-transparent z-10 rounded-2xl"></div>
            
            <motion.div
              style={{ scale: imageScale, opacity: imageOpacity }}
              className="absolute inset-0"
            >
              <Image
                src="/images/pilosopi.jpg"
                alt="Filosofi Alam Liar"
                fill
                className="object-cover rounded-2xl transition-transform duration-1000 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </motion.div>
            
            {/* Floating elements */}
            <motion.div 
              className="absolute top-10 left-10 z-20 w-16 h-16 bg-ferrow-red-500/20 backdrop-blur-md rounded-full flex items-center justify-center"
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <FaPaw className="text-ferrow-red-400 text-2xl" />
            </motion.div>
            
            <motion.div 
              className="absolute bottom-10 right-10 z-20 w-16 h-16 bg-ferrow-yellow-400/20 backdrop-blur-md rounded-full flex items-center justify-center"
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
              <FaLeaf className="text-ferrow-yellow-400 text-2xl" />
            </motion.div>
          </motion.div>

          {/* Content Column */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
            viewport={{ once: true }}
            style={{ y: textY }}
          >
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1 mb-4 glass rounded-full text-sm font-medium border border-ferrow-yellow-400/30"
            >
              FILOSOFI KAMI
            </motion.span>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-6">
              Filosofi <span className="text-gradient">Alam Liar</span> Kami
            </h2>
            
            <p className="text-ferrow-cream-400/80 mb-6 text-lg">
              Di Ferrow, kami percaya bahwa nutrisi terbaik untuk hewan peliharaan Anda berasal dari alam. Terinspirasi oleh pola makan alami predator di alam liar, kami menciptakan makanan yang memenuhi kebutuhan biologis hewan kesayangan Anda.
            </p>
            
            <p className="text-ferrow-cream-400/80 mb-8 text-lg">
              Setiap formula kami dirancang untuk memberikan nutrisi holistik yang lengkap, dengan kandungan protein hewani berkualitas tinggi dan tanpa bahan-bahan yang tidak diperlukan seperti biji-bijian, pewarna buatan, dan pengawet.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div 
                className="glass p-6 rounded-xl border border-ferrow-yellow-400/30 hover-card"
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
              >
                <div className="w-12 h-12 bg-ferrow-red-500/20 rounded-full flex items-center justify-center mb-4">
                  <FaLeaf className="text-ferrow-red-400 text-xl" />
                </div>
                <h3 className="text-xl font-bold text-ferrow-cream-400 mb-3">Bahan Premium</h3>
                <p className="text-ferrow-cream-400/70">
                  Kami hanya menggunakan bahan-bahan berkualitas tertinggi dari sumber yang terpercaya dan berkelanjutan.
                </p>
              </motion.div>
              
              <motion.div 
                className="glass p-6 rounded-xl border border-ferrow-yellow-400/30 hover-card"
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
              >
                <div className="w-12 h-12 bg-ferrow-red-500/20 rounded-full flex items-center justify-center mb-4">
                  <FaPaw className="text-ferrow-red-400 text-xl" />
                </div>
                <h3 className="text-xl font-bold text-ferrow-cream-400 mb-3">Proses Alami</h3>
                <p className="text-ferrow-cream-400/70">
                  Proses produksi kami menjaga integritas nutrisi dari setiap bahan yang kami gunakan.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Philosophy; 

// "use client"

// import { motion, useScroll, useTransform, useSpring } from "framer-motion"
// import { useRef, useState } from "react"
// import Image from "next/image"
// import { FaLeaf, FaPaw, FaHeart, FaGraduationCap, FaRecycle, FaLightbulb } from "react-icons/fa"
// import Link from "next/link"

// const Philosophy = () => {
//   const ref = useRef<HTMLDivElement>(null)
//   const [hoveredCard, setHoveredCard] = useState<number | null>(null)

//   const { scrollYProgress } = useScroll({
//     target: ref,
//     offset: ["start end", "end start"],
//   })

//   // 3D scroll effects
//   const imageRotateY = useTransform(scrollYProgress, [0, 0.5, 1], [15, 0, -15])
//   const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 1.1])
//   const textRotateX = useTransform(scrollYProgress, [0, 0.5, 1], [10, 0, -10])
//   const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -100])

//   // Smooth spring animations
//   const smoothRotateY = useSpring(imageRotateY, { stiffness: 100, damping: 30 })
//   const smoothScale = useSpring(imageScale, { stiffness: 100, damping: 30 })
//   const smoothRotateX = useSpring(textRotateX, { stiffness: 100, damping: 30 })

//   const philosophyPoints = [
//     {
//       icon: <FaLeaf className="w-7 h-7" />,
//       title: "Bahan Alami Terbaik",
//       description:
//         "Menyediakan makanan hewan peliharaan yang diformulasikan dari bahan-bahan alami berkualitas terbaik.",
//       color: "from-ferrow-red-500 to-ferrow-red-600",
//       bgColor: "bg-ferrow-red-500/10",
//       borderColor: "border-ferrow-red-500/30",
//       textColor: "text-ferrow-green-800",
//     },
//     {
//       icon: <FaHeart className="w-7 h-7" />,
//       title: "Kualitas Hidup Optimal",
//       description:
//         "Meningkatkan kualitas hidup anjing dan kucing melalui produk yang seimbang secara nutrisi dan bebas dari bahan kimia berbahaya.",
//       color: "from-ferrow-red-500 to-ferrow-red-600",
//       bgColor: "bg-ferrow-red-500/10",
//       borderColor: "border-ferrow-red-500/30",
//       textColor: "text-ferrow-green-800",
//     },
//     {
//       icon: <FaGraduationCap className="w-7 h-7" />,
//       title: "Edukasi Pemilik",
//       description:
//         "Memberikan edukasi kepada pemilik hewan tentang pentingnya nutrisi dalam menjaga kesehatan hewan peliharaan.",
//       color: "from-ferrow-red-500 to-ferrow-red-600",
//       bgColor: "bg-ferrow-red-500/10",
//       borderColor: "border-ferrow-red-500/30",
//       textColor: "text-ferrow-green-800",
//     },
//     {
//       icon: <FaRecycle className="w-7 h-7" />,
//       title: "Ramah Lingkungan",
//       description: "Menjalankan proses produksi yang ramah lingkungan dan bertanggung jawab secara sosial.",
//       color: "from-ferrow-red-500 to-ferrow-red-600",
//       bgColor: "bg-ferrow-red-500/10",
//       borderColor: "border-ferrow-red-500/30",
//       textColor: "text-ferrow-green-800",
//     },
//     {
//       icon: <FaLightbulb className="w-7 h-7" />,
//       title: "Inovasi Berkelanjutan",
//       description: "Berinovasi secara berkelanjutan untuk menjawab kebutuhan hewan peliharaan modern dan pemiliknya.",
//       color: "from-ferrow-red-500 to-ferrow-red-600",
//       bgColor: "bg-ferrow-red-500/10",
//       borderColor: "border-ferrow-red-500/30",
//       textColor: "text-ferrow-green-800",
//     },
//   ]

//   return (
//     <section
//       id="philosophy"
//       ref={ref}
//       className="py-24 lg:py-32 bg-ferrow-cream-400 text-ferrow-green-800 relative overflow-hidden"
//       style={{ perspective: "1000px" }}
//     >
//       {/* 3D Background Elements */}
//       <motion.div style={{ y: parallaxY }} className="absolute inset-0 opacity-10">
//         <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-r from-ferrow-red-500 to-ferrow-red-600 rounded-full blur-3xl"></div>
//         <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-r from-ferrow-yellow-400 to-ferrow-yellow-500 rounded-full blur-3xl"></div>
//       </motion.div>

//       {/* Floating 3D particles */}
//       {[...Array(8)].map((_, i) => (
//         <motion.div
//           key={i}
//           className="absolute w-3 h-3 bg-ferrow-red-500/20 rounded-full"
//           style={{
//             left: `${10 + i * 12}%`,
//             top: `${15 + (i % 3) * 25}%`,
//           }}
//           animate={{
//             y: [0, -40, 0],
//             rotateX: [0, 360],
//             rotateY: [0, 180],
//             scale: [1, 1.5, 1],
//           }}
//           transition={{
//             duration: 6 + i,
//             repeat: Number.POSITIVE_INFINITY,
//             delay: i * 0.8,
//           }}
//         />
//       ))}

//       <div className="container mx-auto px-4 lg:px-8 max-w-7xl relative z-10">
//         {/* Section Header with 3D effect */}
//         <motion.div
//           initial={{ opacity: 0, rotateX: 20, y: 50 }}
//           whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
//           transition={{ duration: 1, type: "spring", stiffness: 100 }}
//           viewport={{ once: true }}
//           className="text-center mb-20"
//           style={{ transformStyle: "preserve-3d" }}
//         >
//           <motion.div
//             className="inline-flex items-center px-6 py-3 bg-ferrow-green-800/10 border border-ferrow-green-800/20 rounded-full text-sm font-bold text-ferrow-green-800 mb-8 backdrop-blur-sm"
//             whileHover={{ scale: 1.05, rotateY: 5 }}
//           >
//             <FaPaw className="mr-2 text-ferrow-red-500" />
//             FILOSOFI & MISI KAMI
//             <FaLeaf className="ml-2 text-ferrow-red-500" />
//           </motion.div>

//           <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-8 leading-tight">
//             Filosofi <span className="text-ferrow-red-500">Alam Liar</span> Kami
//           </h2>

//           <p className="text-xl lg:text-2xl text-ferrow-green-800/80 max-w-4xl mx-auto leading-relaxed font-light">
//             Terinspirasi oleh pola makan alami predator di alam liar, kami berkomitmen menciptakan produk terbaik untuk
//             hewan kesayangan Anda dengan lima pilar utama yang menjadi fondasi bisnis kami.
//           </p>
//         </motion.div>

//         {/* Main Content with Perfect Balance */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center mb-24">
//           {/* 3D Image Column */}
//           <motion.div
//             initial={{ opacity: 0, rotateY: -30, x: -100 }}
//             whileInView={{ opacity: 1, rotateY: 0, x: 0 }}
//             transition={{ duration: 1.2, type: "spring", stiffness: 80 }}
//             viewport={{ once: true }}
//             style={{
//               rotateY: smoothRotateY,
//               scale: smoothScale,
//               transformStyle: "preserve-3d",
//             }}
//             className="relative"
//           >
//             <div className="relative aspect-[5/4] rounded-3xl overflow-hidden group shadow-2xl">
//               {/* Multiple 3D layers */}
//               <div className="absolute inset-0 bg-gradient-to-t from-ferrow-green-800/60 via-transparent to-transparent z-30 rounded-3xl"></div>
//               <div className="absolute inset-0 bg-gradient-to-br from-ferrow-red-500/20 via-transparent to-ferrow-yellow-400/20 z-20 rounded-3xl"></div>

//               <motion.div
//                 className="absolute inset-0 transform-gpu"
//                 whileHover={{ scale: 1.05, rotateY: 5 }}
//                 transition={{ duration: 0.6 }}
//               >
//                 <Image
//                   src="/images/hero-bg.jpg"
//                   alt="Filosofi Alam Liar"
//                   fill
//                   className="object-cover rounded-3xl transition-all duration-700 group-hover:brightness-110"
//                   sizes="(max-width: 768px) 100vw, 50vw"
//                   priority
//                 />
//               </motion.div>

//               {/* 3D Floating Elements */}
//               <motion.div
//                 className="absolute top-8 left-8 z-40 w-20 h-20 bg-ferrow-cream-400/20 backdrop-blur-xl border border-ferrow-red-500/30 rounded-2xl flex items-center justify-center shadow-lg"
//                 animate={{
//                   y: [0, -15, 0],
//                   rotateZ: [0, 5, 0],
//                   scale: [1, 1.1, 1],
//                 }}
//                 transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
//                 whileHover={{ scale: 1.3, rotateZ: 15 }}
//               >
//                 <FaPaw className="text-ferrow-red-500 text-2xl" />
//               </motion.div>

//               <motion.div
//                 className="absolute bottom-8 right-8 z-40 w-16 h-16 bg-ferrow-cream-400/20 backdrop-blur-xl border border-ferrow-yellow-400/30 rounded-full flex items-center justify-center shadow-lg"
//                 animate={{
//                   y: [0, 10, 0],
//                   rotateZ: [0, -10, 0],
//                   scale: [1, 1.05, 1],
//                 }}
//                 transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
//                 whileHover={{ scale: 1.2, rotateZ: -20 }}
//               >
//                 <FaLeaf className="text-ferrow-yellow-400 text-xl" />
//               </motion.div>

//               {/* 3D Border Effect */}
//               <div className="absolute inset-0 rounded-3xl border-2 border-ferrow-red-500/30 group-hover:border-ferrow-red-500/50 transition-all duration-500"></div>
//             </div>

//             {/* 3D Shadow */}
//             <div className="absolute -bottom-8 left-8 right-8 h-8 bg-ferrow-green-800/20 blur-xl rounded-full transform scale-90"></div>
//           </motion.div>

//           {/* Content Column with 3D Text */}
//           <motion.div
//             initial={{ opacity: 0, rotateX: 20, x: 100 }}
//             whileInView={{ opacity: 1, rotateX: 0, x: 0 }}
//             transition={{ duration: 1, type: "spring", stiffness: 80, delay: 0.2 }}
//             viewport={{ once: true }}
//             style={{
//               rotateX: smoothRotateX,
//               transformStyle: "preserve-3d",
//             }}
//             className="space-y-8"
//           >
//             <div className="space-y-6">
//               <h3 className="text-3xl lg:text-4xl font-bold text-ferrow-green-800 leading-tight">
//                 Komitmen Kami untuk <span className="text-ferrow-red-500">Kesehatan Optimal</span>
//               </h3>

//               <p className="text-lg text-ferrow-green-800/90 leading-relaxed">
//                 Di <span className="font-bold text-ferrow-red-500">Ferrow</span>, kami memahami bahwa setiap hewan
//                 peliharaan memiliki kebutuhan nutrisi yang unik. Oleh karena itu, kami mengembangkan produk dengan
//                 pendekatan holistik yang menggabungkan ilmu pengetahuan modern dengan wisdom alam.
//               </p>

//               <p className="text-ferrow-green-800/80 leading-relaxed">
//                 Setiap formula kami dirancang dengan teliti, menggunakan protein hewani berkualitas tinggi sebagai bahan
//                 utama, dilengkapi dengan vitamin, mineral, dan nutrisi penting lainnya yang dibutuhkan untuk mendukung
//                 kehidupan yang sehat dan bahagia.
//               </p>
//             </div>

//             {/* Key Statistics with 3D effect */}
//             <div className="grid grid-cols-2 gap-6">
//               {[
//                 { number: "100%", label: "Bahan Alami" },
//                 { number: "0%", label: "Pengawet Buatan" },
//                 { number: "15+", label: "Tahun Pengalaman" },
//                 { number: "50K+", label: "Hewan Sehat" },
//               ].map((stat, index) => (
//                 <motion.div
//                   key={index}
//                   className="text-center p-4 bg-ferrow-cream-400/30 backdrop-blur-sm border border-ferrow-yellow-400/20 rounded-xl"
//                   whileHover={{ scale: 1.05, rotateY: 5 }}
//                   transition={{ duration: 0.3 }}
//                 >
//                   <div className="text-2xl lg:text-3xl font-bold text-ferrow-red-500 mb-1">{stat.number}</div>
//                   <div className="text-sm text-ferrow-green-800/70">{stat.label}</div>
//                 </motion.div>
//               ))}
//             </div>
//           </motion.div>
//         </div>

//         {/* Philosophy Points Grid with 3D Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 lg:gap-8">
//           {philosophyPoints.map((point, index) => (
//             <motion.div
//               key={index}
//               initial={{ opacity: 0, rotateX: 45, y: 100 }}
//               whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
//               transition={{ duration: 0.8, delay: index * 0.1, type: "spring", stiffness: 100 }}
//               viewport={{ once: true }}
//               onMouseEnter={() => setHoveredCard(index)}
//               onMouseLeave={() => setHoveredCard(null)}
//               className={`group relative ${point.bgColor} backdrop-blur-sm border ${point.borderColor} rounded-2xl p-6 lg:p-8 transition-all duration-500 hover:scale-105 hover:-translate-y-4 cursor-pointer`}
//               style={{
//                 transformStyle: "preserve-3d",
//                 transform: hoveredCard === index ? "rotateY(5deg) rotateX(-5deg)" : "rotateY(0deg) rotateX(0deg)",
//               }}
//               whileHover={{
//                 rotateY: 5,
//                 rotateX: -5,
//                 scale: 1.05,
//                 y: -16,
//               }}
//             >
//               {/* 3D Icon Container */}
//               <motion.div
//                 className={`w-16 h-16 bg-gradient-to-r ${point.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg relative`}
//                 whileHover={{ rotateY: 180, scale: 1.1 }}
//                 transition={{ duration: 0.6 }}
//                 style={{ transformStyle: "preserve-3d" }}
//               >
//                 <div className="text-white relative z-10">{point.icon}</div>
//                 <div className="absolute inset-0 bg-white/20 rounded-2xl blur-sm"></div>
//               </motion.div>

//               {/* Content */}
//               <h3
//                 className={`text-xl lg:text-2xl font-bold ${point.textColor} mb-4 group-hover:text-ferrow-red-500 transition-colors duration-300`}
//               >
//                 {point.title}
//               </h3>

//               <p className="text-ferrow-green-800/80 leading-relaxed text-sm lg:text-base group-hover:text-ferrow-green-800/95 transition-colors duration-300">
//                 {point.description}
//               </p>

//               {/* 3D Hover Indicator */}
//               <motion.div
//                 className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-ferrow-red-500 to-ferrow-red-600 rounded-full"
//                 initial={{ scaleX: 0, opacity: 0 }}
//                 animate={{
//                   scaleX: hoveredCard === index ? 1 : 0,
//                   opacity: hoveredCard === index ? 1 : 0,
//                 }}
//                 transition={{ duration: 0.3 }}
//               />

//               {/* 3D Shadow */}
//               <div className="absolute -bottom-4 left-4 right-4 h-4 bg-ferrow-green-800/10 blur-lg rounded-full transform scale-75 group-hover:scale-90 transition-transform duration-500"></div>
//             </motion.div>
//           ))}
//         </div>

//         {/* Enhanced Call to Action with 3D effect */}
//         <motion.div
//           initial={{ opacity: 0, rotateX: 30, y: 50 }}
//           whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
//           transition={{ duration: 0.8, delay: 0.5 }}
//           viewport={{ once: true }}
//           className="text-center mt-20"
//         >
//           <Link href="/products">
//             <motion.button
//               className="group relative px-10 py-5 bg-gradient-to-r from-ferrow-red-500 to-ferrow-red-600 text-ferrow-cream-400 font-bold text-lg rounded-2xl overflow-hidden shadow-2xl"
//               whileHover={{ scale: 1.05, rotateY: 5 }}
//               whileTap={{ scale: 0.95 }}
//               style={{ transformStyle: "preserve-3d" }}
//             >
//               <span className="relative z-10 flex items-center">
//                 Jelajahi Produk Kami
//                 <motion.svg
//                   className="w-6 h-6 ml-3"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                   animate={{ x: [0, 5, 0] }}
//                   transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
//                 >
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
//                 </motion.svg>
//               </span>

//               {/* 3D Button Effect */}
//               <motion.div
//                 className="absolute inset-0 bg-white/20 rounded-2xl"
//                 initial={{ rotateY: -90, opacity: 0 }}
//                 whileHover={{ rotateY: 0, opacity: 1 }}
//                 transition={{ duration: 0.4 }}
//               />
//             </motion.button>
//           </Link>
//         </motion.div>
//       </div>
//     </section>
//   )
// }

// export default Philosophy
