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

  swcMinify: true, // Use SWC for minification which is more memory efficient
  // Optimize CSS and package imports
  experimental: {
    optimizeCss: false, // Disable CSS optimization for now
    optimizePackageImports: ['@radix-ui/react-*', 'lucide-react'],
  },
  // Add webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Optimize memory usage
    config.optimization = {
      ...config.optimization,
      moduleIds: 'deterministic',
      chunkIds: 'deterministic',
      minimize: !dev,
    }

    // Increase memory limit for webpack
    config.performance = {
      ...config.performance,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000,
    }

    return config
  },
}

export default nextConfig
