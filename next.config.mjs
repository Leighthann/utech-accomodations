/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: ['res.cloudinary.com'],
  },
  // Disable source maps in production to reduce memory usage
  productionBrowserSourceMaps: false,
  // Reduce bundle size
  swcMinify: true,
  // Disable experimental features to save memory
  experimental: {
    optimizePackageImports: ['@radix-ui/react-*', 'lucide-react'],
  },
  // Minimal webpack config to save memory
  webpack: (config, { dev }) => {
    // Optimize for memory usage over speed
    config.optimization = {
      ...config.optimization,
      minimize: !dev,
    }

    return config
  },
  // This is important for static export
  output: 'export',
}

export default nextConfig
