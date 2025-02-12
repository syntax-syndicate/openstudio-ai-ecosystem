import { env } from '@/env';
import nextMdx from '@next/mdx';
import { withCMS } from '@repo/cms/next-config';
import { withToolbar } from '@repo/feature-flags/lib/toolbar';
import { config, withAnalyzer } from '@repo/next-config';
import { withLogtail, withSentry } from '@repo/observability/next-config';
import type { NextConfig } from 'next';

let nextConfig: NextConfig = withToolbar(withLogtail({ ...config }));

const withMDX = nextMdx();
nextConfig.images?.remotePatterns?.push({
  protocol: 'https',
  hostname: 'assets.basehub.com',
});

// if (process.env.NODE_ENV === 'production') {
//   const redirects: NextConfig['redirects'] = async () => [
//     {
//       source: '/legal',
//       destination: '/legal/privacy',
//       statusCode: 301,
//     },
//   ];

//   nextConfig.redirects = redirects;
// }

// if (env.VERCEL) {
//   nextConfig = withSentry(nextConfig);
// }

// if (env.ANALYZE === 'true') {
//   nextConfig = withAnalyzer(nextConfig);
// }

// extend the next config with by adding pageExtensions
nextConfig.pageExtensions = ['js', 'jsx', 'mdx', 'ts', 'tsx'];
nextConfig = withMDX(nextConfig);

export default withCMS(nextConfig);
