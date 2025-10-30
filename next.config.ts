import type {NextConfig} from 'next';

const repo = 'sinais';
const assetPrefix = `/${repo}/`;
const basePath = `/${repo}`;

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
