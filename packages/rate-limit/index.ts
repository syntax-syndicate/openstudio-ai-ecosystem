import { Ratelimit, type RatelimitConfig } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { keys } from './keys';

export const redis = new Redis({
  url: keys().UPSTASH_REDIS_REST_URL,
  token: keys().UPSTASH_REDIS_REST_TOKEN,
});

export const createRateLimiter = (props: Omit<RatelimitConfig, 'redis'>) =>
  new Ratelimit({
    redis,
    limiter: props.limiter ?? Ratelimit.slidingWindow(10, '10 s'),
    prefix: props.prefix ?? 'os-chathub',
  });

export const rateLimit = {
  bookmark: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(1, '1 h'),
    prefix: 'clicks',
    analytics: true,
  }),
  analytics: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(1, '5 h'),
    prefix: 'analytics',
    analytics: true,
  }),
  subscribe: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '5 h'),
    prefix: 'subscribe',
    analytics: true,
  }),
  newsletter: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(2, '1 d'),
    prefix: 'newsletter',
    analytics: true,
  }),
  protection: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '1 h'),
    prefix: 'unlock',
    analytics: true,
  }),
};

export const { slidingWindow } = Ratelimit;
