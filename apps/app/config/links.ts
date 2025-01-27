import type { AppConfig } from '@/types/minime';

export const links = {
  googleSearchApi: 'https://www.googleapis.com/customsearch/v1',
  openaiApiKeyUrl: 'https://platform.openai.com/api-keys',
  geminiApiKeyUrl: 'https://aistudio.google.com/app/apikey',
  anthropicApiKeyUrl: 'https://console.anthropic.com/settings/keys',
  googleSearchApiUrl:
    'https://programmablesearchengine.google.com/controlpanel/create',
  groqApiKeyUrl: 'https://console.groq.com/keys',
  googleSearchEngineApiKeyUrl:
    'https://developers.google.com/custom-search/v1/introduction',
};

export const appConfig: AppConfig = {
  mainNav: [
    {
      title: 'Articles',
      href: '/minime/articles',
      icon: 'edit',
    },
    {
      title: 'Projects',
      href: '/minime/projects',
      icon: 'layers',
    },
    {
      title: 'Bookmarks',
      href: '/minime/bookmarks',
      icon: 'bookmark',
    },
    {
      title: 'Analytics',
      href: '/minime/analytics',
      icon: 'areaChart',
    },
  ],
  settingsNav: [
    {
      title: 'General',
      href: '/minime/settings',
    },
    // {
    //   title: 'Links',
    //   href: '/minime/settings/links',
    // },
    // {
    //   title: 'SEO',
    //   href: '/minime/settings/seo',
    // },
    {
      title: 'Subscribers',
      href: '/minime/settings/subscribers',
    },
    // {
    //   title: 'Billing',
    //   href: '/minime/settings/billing',
    // },
  ],
  filters: {
    postsFilter: [
      {
        title: 'All',
        href: '/minime/articles',
        value: undefined,
      },
      {
        title: 'Public',
        href: '/minime/articles?published=true',
        value: 'true',
      },
      {
        title: 'Draft',
        href: '/minime/articles?published=false',
        value: 'false',
      },
    ],
  },
} as const;
