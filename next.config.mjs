/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Enable image optimization for production
    unoptimized: false,
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400, // 24 hours
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'pbs.twimg.com',
      },
      {
        protocol: 'https',
        hostname: 'abs.twimg.com',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
      },
      {
        protocol: 'https',
        hostname: '**.cdninstagram.com',
      },
      {
        protocol: 'https',
        hostname: '**.hurriyet.com.tr',
      },
      {
        protocol: 'https',
        hostname: '**.milliyet.com.tr',
      },
      {
        protocol: 'https',
        hostname: '**.sabah.com.tr',
      },
      {
        protocol: 'https',
        hostname: '**.sozcu.com.tr',
      },
      {
        protocol: 'https',
        hostname: '**.cnnturk.com',
      },
      {
        protocol: 'https',
        hostname: '**.ntv.com.tr',
      },
      {
        protocol: 'https',
        hostname: '**.haberturk.com',
      },
      {
        protocol: 'https',
        hostname: '**.cumhuriyet.com.tr',
      },
    ],
  },
  // Enable compression
  compress: true,
}

export default nextConfig
