import type { SiteConfig } from '@/types/minime';

export const siteConfig: SiteConfig = {
  name: 'Open Studio',
  description: 'Open Studio - Minime.',
  url: 'https://app.openstudio.tech',
  ogImage: 'https://openstudio.tech/_static/og.png',
  links: {
    home: 'https://openstudio.tech',
    app: 'https://app.openstudio.tech',
    signup: 'https://app.openstudio.tech/sign-up',
    login: 'https://app.openstudio.tech/sign-in',
    twitter: 'https://x.com/kuluruvineeth',
    posts: 'https://posts.cv/kuluruvineeth',
    github: 'https://github.com/kuluruvineeth/openstudio-beta',
    help: 'mailto:help@openstudio.tech',
    privacy: 'mailto:privacy@openstudio.tech',
    demo: 'https://demo.openstudio.co.in',
  },
  privacy: {
    lastUpdated: 'Jan 24, 2025',
    sections: [],
  },
} as const;
