import { examplePrompts } from '@/config/example-prompts';
import { links } from '@/config/links';
import { defaultPreferences } from '@/config/preferences';
import { models } from '@/types';

const configs = {
  ...links,
  ollamaTagsEndpoint: '/api/tags',
};
export { configs, defaultPreferences, examplePrompts, models };
