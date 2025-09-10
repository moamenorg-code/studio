
import type {NextConfig} from 'next';

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
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    // This is to prevent the server-only packages from being bundled in the client-side code.
    if (!isServer) {
        config.externals = [
            ...(config.externals || []),
            '@google-cloud/functions-framework',
            'firebase-functions',
            'express',
            'handlebars',
            'dotprompt',
        ];
    }
    return config;
  },
};

export default nextConfig;
