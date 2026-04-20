/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  turbopack: {
        root: __dirname,  // ✅ force la racine correcte du projet

  },
  // ✅ Ajouter la configuration des images
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
        hostname: 'MoveCar.com', // Remplacer par ton domaine en prod
        pathname: '/uploads/**',
      },
    ],
  },
};

module.exports = nextConfig;
