/** @type {import('next').NextConfig} */
const nextConfig = {
  

  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'MoveCar.com',
        pathname: '/uploads/**',
      },
    ],
  },
};

module.exports = nextConfig;