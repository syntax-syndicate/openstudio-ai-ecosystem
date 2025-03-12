import { config } from '@repo/next-config';
import { withLogtail } from '@repo/observability/next-config';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = withLogtail({
  ...config,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  productionBrowserSourceMaps: false,
  experimental: {
    serverSourceMaps: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '4sz5k3dpgfzlfzup.public.blob.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: 'jipwjptvxxtzbfsxzwuh.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'icons.duckduckgo.com',
      },
      {
        protocol: 'https',
        hostname: 'flagcdn.com',
      },
      {
        protocol: 'https',
        hostname: 'image.mux.com',
      },
      {
        protocol: 'https',
        hostname: 'utfs.io',
      },
      {
        protocol: 'https',
        hostname: 'yt3.ggpht.com',
      },
    ],
  },

  async redirects() {
    return [
      {
        source: '/:id',
        has: [
          {
            type: 'host',
            value: 'go.openstudio.co.in',
          },
        ],
        destination: `https://app.openstudio.tech/api/bookmarks/t/:id`,
        permanent: false,
      },
      {
        source: '/tube',
        destination: '/tube/studio',
        permanent: true,
      },
      // {
      //   source: '/:id',
      //   has: [
      //     {
      //       type: 'host',
      //       value: 'http://localhost:3000',
      //     },
      //   ],
      //   destination: `http://localhost:3000/api/bookmarks/t/:id`,
      //   permanent: false,
      // },
    ];
  },
});
//TODO: Add sentry and analyzer
// if (env.VERCEL) {
//   nextConfig = withSentry(nextConfig);
// }

// if (env.ANALYZE === 'true') {
//   nextConfig = withAnalyzer(nextConfig);
// }

export default nextConfig;
