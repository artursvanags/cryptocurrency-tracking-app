/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['pwvrx0g8-3000.euw.devtunnels.ms', 'localhost:3000'],
    },
  },
};

module.exports = nextConfig;
