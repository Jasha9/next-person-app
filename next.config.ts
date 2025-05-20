import type { NextConfig } from "next";
import path from 'path';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: {
    // During development, you can ignore TypeScript errors
    // But for production builds, set this to true
    ignoreBuildErrors: false,
  },
  eslint: {
    // During development, you can ignore ESLint errors
    // But for production builds, set this to true
    ignoreDuringBuilds: false,
  },
  webpack: (config, { isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname),
    };
    return config;
  },
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
  typescript: {
    // Handle any TypeScript compilation errors
    ignoreBuildErrors: false,
  },
  eslint: {
    // Handle any ESLint errors during build
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;

