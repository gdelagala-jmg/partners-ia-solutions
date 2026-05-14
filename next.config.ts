import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
      {
        protocol: 'https',
        hostname: 'www.anthropic.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.prod.website-files.com',
      },
      {
        protocol: 'https',
        hostname: 'assets.aboutamazon.com',
      },
      {
        protocol: 'https',
        hostname: '**.nvidia.com',
      },
      {
        protocol: 'https',
        hostname: 'images.ctfassets.net',
      },
      {
        protocol: 'https',
        hostname: '**.i-scmp.com',
      },
      {
        protocol: 'https',
        hostname: 'iprsoftwaremedia.com',
      },
      {
        protocol: 'https',
        hostname: 'news.mit.edu',
      },
      {
        protocol: 'https',
        hostname: '**.partnersiasolutions.com',
      },
      {
        protocol: 'https',
        hostname: 'images-assets.nasa.gov',
      },
      {
        protocol: 'https',
        hostname: 'about.fb.com',
      },
    ],
  },
};

export default nextConfig;
