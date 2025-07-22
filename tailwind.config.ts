import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'ferrow-green': {
          50: '#eaecdf',
          100: '#d5d9c0',
          200: '#bfc6a0',
          300: '#a9b380',
          400: '#939f61',
          500: '#7d8c41',
          600: '#64702f',
          700: '#4b541e',
          800: '#333A2D', // Hijau Gelap - primary
          950: '#1a1d0e',
        },
        'ferrow-cream': {
          50: '#fdfcf8',
          100: '#fbf8f1',
          200: '#f7f1e3',
          300: '#f3ebd6',
          400: '#EFE4C8', // Cream - background
          500: '#e6d7b0',
          600: '#d9c48d',
          700: '#ccb16a',
          800: '#bf9e47',
          950: '#665321',
        },
        'ferrow-red': {
          50: '#fbe9e7',
          100: '#f7d3cf',
          200: '#efa89f',
          300: '#e77d6f',
          400: '#df523f',
          500: '#A53410', // Merah Tanah - accent
          600: '#842a0d',
          700: '#63200a',
          800: '#421506',
          950: '#210b03',
        },
        'ferrow-yellow': {
          50: '#fdfbf5',
          100: '#fcf7eb',
          200: '#f8efd8',
          300: '#f5e7c4',
          400: '#EAD49C', // Kuning Lembut - secondary
          500: '#e2c278',
          600: '#d9af54',
          700: '#d09c30',
          800: '#a47b26',
          950: '#523e13',
        },
      },
      fontFamily: {
        sans: ['var(--font-opensans)', 'sans-serif'],
        display: ['var(--font-akko)', 'sans-serif'],
      },
      backgroundImage: {
        'hero-pattern': "url('/images/hero-bg.jpg')",
        'natural-texture': "url('/images/natural-texture.jpg')",
      },
    },
  },
  plugins: [],
}

export default config 