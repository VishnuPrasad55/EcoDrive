/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'avatars.githubusercontent.com'],
  },
  transpilePackages: ['leaflet', 'react-leaflet'],
}

module.exports = nextConfig
