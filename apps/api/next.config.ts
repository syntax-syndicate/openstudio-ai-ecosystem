import { config } from '@repo/next-config';
import { withLogtail } from '@repo/observability/next-config';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = withLogtail({ ...config });

// if (env.VERCEL) {
//   nextConfig = withSentry(nextConfig);
// }

// if (env.ANALYZE === 'true') {
//   nextConfig = withAnalyzer(nextConfig);
// }

export default nextConfig;
