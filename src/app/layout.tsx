import type { Metadata, Viewport } from "next";
import { Providers } from "@/components/Providers";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import localFont from "next/font/local";

// Load local Akko font
const akko = localFont({
  src: [{ path: "../assets/font/akko/Akko Bold.otf", weight: "700", style: "normal" }],
  variable: "--font-akko",
  display: "swap",
});

// Load local Open Sans font
const openSans = localFont({
  src: [
    { path: "../assets/font/open-sans/OpenSans-Regular.ttf", weight: "400", style: "normal" },
    { path: "../assets/font/open-sans/OpenSans-Medium.ttf", weight: "500", style: "normal" },
    { path: "../assets/font/open-sans/OpenSans-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "../assets/font/open-sans/OpenSans-Bold.ttf", weight: "700", style: "normal" },
    { path: "../assets/font/open-sans/OpenSans-Italic.ttf", weight: "400", style: "italic" },
    { path: "../assets/font/open-sans/OpenSans-MediumItalic.ttf", weight: "500", style: "italic" },
    { path: "../assets/font/open-sans/OpenSans-SemiBoldItalic.ttf", weight: "600", style: "italic" },
    { path: "../assets/font/open-sans/OpenSans-BoldItalic.ttf", weight: "700", style: "italic" }
  ],
  variable: "--font-opensans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ferrow - Premium Natural Pet Food",
  description: "Makanan hewan premium berbahan alami, grain-free, terinspirasi dari diet predator liar",
  keywords: [
    "petshop",
    "petshop jakarta",
    "toko hewan jakarta",
    "pet food jakarta",
    "makanan anjing murah",
    "makanan kucing murah",
    "toko perlengkapan hewan",
    "aksesoris hewan",
    "perawatan hewan",
    "makanan anjing premium",
    "makanan kucing premium"
  ],
  authors: [{ name: "Ferrow Petshop", url: "https://ferrowpet.com" }],
  openGraph: {
    title: "Ferrow Petshop Jakarta - Pet Food, Makanan Anjing & Kucing Murah",
    description:
      "Ferrow Petshop Jakarta menjual pet food, makanan anjing murah, makanan kucing murah, aksesoris, dan layanan grooming hewan.",
    url: "https://ferrowpet.com",
    siteName: "Ferrow Petshop",
    images: [
      { url: "https://ferrowpet.com/og-image.jpg", width: 1200, height: 630, alt: "Ferrow Petshop" }
    ],
    locale: "id_ID",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Ferrow Petshop Jakarta - Pet Food, Makanan Anjing & Kucing Murah",
    description:
      "Ferrow Petshop Jakarta menjual pet food, makanan anjing murah, makanan kucing murah, aksesoris, dan layanan grooming hewan.",
    images: ["https://ferrowpet.com/og-image.jpg"] // perbaikan domain
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://ferrowpet.com" },
  icons: { icon: `/favicon.ico` },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${openSans.variable} ${akko.variable} scroll-smooth`}>
      <head>
        <meta name="theme-color" content="#EFE4C8" />
                {/* Geo Tags for Local SEO */}
        <meta name="geo.region" content="ID-JK" />
        <meta name="geo.placename" content="Jakarta" />
        <meta name="geo.position" content="-6.200000;106.816666" />
        {/* Schema.org JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "PetStore",
              name: "Ferrow Petshop Jakarta",
              image: "https://ferrowpet.com/og-image.jpg",
              "@id": "https://ferrowpet.com",
              url: "https://ferrowpet.com",
              telephone: "+62-812-3456-7890",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Jl. Contoh No. 123",
                addressLocality: "Jakarta",
                postalCode: "10110",
                addressCountry: "ID"
              },
              openingHours: "Mo-Su 09:00-20:00",
              priceRange: "$$",
              sameAs: [
                "https://facebook.com/ferrowpet",
                "https://instagram.com/ferrowpet"
              ]
            })
          }}
        />
      </head>
      <body
        className="font-sans antialiased bg-ferrow-cream-400 text-ferrow-green-800"
        suppressHydrationWarning={true}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}