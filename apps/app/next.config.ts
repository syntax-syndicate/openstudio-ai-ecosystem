import { env } from '@/env';
import { config, withAnalyzer } from '@repo/next-config';
import { withLogtail, withSentry } from '@repo/observability/next-config';
import type { NextConfig } from 'next';

//@ts-ignore
let nextConfig: NextConfig = withLogtail({
  ...config,
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
    ],
  },
});

if (env.VERCEL) {
  nextConfig = withSentry(nextConfig);
}

if (env.ANALYZE === 'true') {
  nextConfig = withAnalyzer(nextConfig);
}

export default nextConfig;
