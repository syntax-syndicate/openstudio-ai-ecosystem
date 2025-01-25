import { env } from '@/env';
import { config, withAnalyzer } from '@repo/next-config';
import { withLogtail, withSentry } from '@repo/observability/next-config';
import type { NextConfig } from 'next';


let nextConfig: NextConfig = withLogtail({
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
    ],
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
