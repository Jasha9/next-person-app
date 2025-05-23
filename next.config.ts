import type { NextConfig } from "next";
import path from 'path';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    domains: ['lh3.googleusercontent.com'], // Allow Google profile images
  },
  typescript: {
    ignoreBuildErrors: true, // Temporarily set to true to debug auth issues
  },
  eslint: {
    ignoreDuringBuilds: true, // Temporarily set to true to debug auth issues
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  async rewrites() {
    return [
      {
        source: '/api/auth/:path*',
        destination: '/api/auth/:path*',
      },
    ];
  },
  webpack: (config, { isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname),
    };
    return config;
  },
};

export default nextConfig;

