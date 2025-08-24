/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ["img.clerk.com", "images.unsplash.com"],
  },
};

export default nextConfig;
