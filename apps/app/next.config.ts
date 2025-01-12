import { env } from '@/env';
import { withToolbar } from '@repo/feature-flags/lib/toolbar';
import { config, withAnalyzer } from '@repo/next-config';
import { withLogtail, withSentry } from '@repo/observability/next-config';
import type { NextConfig } from 'next';

let nextConfig: NextConfig = {
  ...config,
  async rewrites() {
    return [
      {
        source: '/chat/settings/llms',
        destination: '/chat/settings/llms/openai',
      },
      {
        source: '/chat/settings',
        destination: '/chat/settings/common',
      },
    ];
  },

  // async redirects() {
  //   return [
  //     {
  //       source: '/',
  //       destination: '/chat',
  //       permanent: true,
  //     },
  //   ];
  // },
  webpack: (config, { isServer }) => {
    // Existing webpack config from config object
    const existingWebpack =
      (config as any).webpack || ((config: any) => config);

    // Apply existing webpack config
    config = existingWebpack(config, { isServer });

    // Add TypeScript loader configuration
    config.module.rules.push({
      test: /\.ts$/,
      use: [
        {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
          },
        },
      ],
    });

    return config;
  },
};

nextConfig = withToolbar(withLogtail(nextConfig));

if (env.VERCEL) {
  nextConfig = withSentry(nextConfig);
}

if (env.ANALYZE === 'true') {
  nextConfig = withAnalyzer(nextConfig);
}

export default nextConfig;
