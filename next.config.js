/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Mengatasi masalah hydration
  reactStrictMode: false,
  compiler: {
    styledComponents: true,
  },
};

module.exports = nextConfig; 