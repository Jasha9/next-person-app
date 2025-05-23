import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: {
    // TODO: Fix type issues and re-enable type checking
    ignoreBuildErrors: true,
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
    }
    return config
  },
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
}

export default withPayload(nextConfig)
