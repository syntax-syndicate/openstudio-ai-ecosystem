import 'server-only';
import { lemonSqueezySetup } from '@lemonsqueezy/lemonsqueezy.js';
import { keys } from './keys';

lemonSqueezySetup({
  apiKey: keys().LEMON_SQUEEZY_API_KEY,
  onError: (error) => {
    console.error('Lemon Squeezy error:', error);
  },
});

export * from '@lemonsqueezy/lemonsqueezy.js';
