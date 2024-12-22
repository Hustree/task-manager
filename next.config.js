/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    domains: [], // Add image domains if needed
  },
  env: {
    // Environment variables
  },
  experimental: {
    serverActions: true,
  },
  async redirects() {
    return []
  },
  webpack: (config) => {
    return config
  }
}

module.exports = nextConfig