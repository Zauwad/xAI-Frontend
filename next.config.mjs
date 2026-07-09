/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['three'],
  experimental: {
    optimizePackageImports: ['framer-motion', '@react-three/drei'],
  },
};

export default nextConfig;
