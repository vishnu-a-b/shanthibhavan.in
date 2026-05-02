import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'shanthibhavan.in',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.gift.shanthibhavan.in',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.gift.shanthibhavan.in',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/**',
        port: '',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/**',
        port: '5001',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/**',
        port: '3003',
      },
    ],
  },
};

export default nextConfig;
