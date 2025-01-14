import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'OpenStudio - ChatHub',
    short_name: 'ChatHub',
    description:
      'OpenStudio - App of Apps, Your gateway to AI Powered Applications',
    start_url: '/',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#1d1d1d',
    icons: [
      {
        src: '/icons/chathub.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}
