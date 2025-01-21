import { constants } from '@/config/constants';
import { docs } from '@/config/docs';
import { examplePrompts } from '@/config/example-prompts';
import { links } from '@/config/links';
import { defaultPreferences } from '@/config/preferences';
import * as prompts from '@/config/prompts';
import { models } from '@/types';

const configs = {
  version: '0.0.1',
  ...links,
  ...prompts,
  ollamaTagsEndpoint: '/api/tags',
  heroVideo:
    'https://4sz5k3dpgfzlfzup.public.blob.vercel-storage.com/Build%20Your%20AI%20Chat%20Platform%20_%20ChatHub!%20_%20Next.js,%20OpenAI,%20Gemini,%20Claude,%20Ollama,%20Langchain%20_%20Intro%F0%9F%9A%80-S5FHJCnti4nM84ukVbZjplxrq3BRmm.mp4',
};
export {
  configs,
  defaultPreferences,
  examplePrompts,
  models,
  docs,
  constants,
};
