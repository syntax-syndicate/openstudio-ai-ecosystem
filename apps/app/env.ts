import { keys as analytics } from '@repo/analytics/keys';
import { keys as database } from '@repo/backend/keys';
import { keys as collaboration } from '@repo/collaboration/keys';
import { keys as email } from '@repo/email/keys';
import { keys as flags } from '@repo/feature-flags/keys';
import { keys as core } from '@repo/next-config/keys';
import { keys as observability } from '@repo/observability/keys';
import { keys as ratelimit } from '@repo/rate-limit/keys';
import { keys as security } from '@repo/security/keys';
import { keys as webhooks } from '@repo/webhooks/keys';
import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  extends: [
    analytics(),
    collaboration(),
    core(),
    database(),
    email(),
    flags(),
    observability(),
    security(),
    webhooks(),
    ratelimit(),
  ],
  server: {},
  client: {
    NEXT_PUBLIC_OPENAI_API_KEY: z.string().min(1).startsWith('sk-').optional(),
    NEXT_PUBLIC_TAVILY_API_KEY: z
      .string()
      .min(1)
      .startsWith('tvly-')
      .optional(),
    NEXT_PUBLIC_HUGEICONS_API_KEY: z.string().min(1),

    //lemon squeezy
    NEXT_PUBLIC_LEMON_STORE_ID: z.string().nullish().default('openstudio'),

    //pro
    NEXT_PUBLIC_PRO_PAYMENT_LINK: z.string().default(''),
    NEXT_PUBLIC_PRO_MONTHLY_VARIANT_ID: z.coerce.number().default(0),
    NEXT_PUBLIC_PRO_ANNUALLY_VARIANT_ID: z.coerce.number().default(0),

    //lifetime
    NEXT_PUBLIC_LIFETIME_PAYMENT_LINK: z.string().default(''),
    NEXT_PUBLIC_LIFETIME_VARIANT_ID: z.coerce.number().default(0),

    NEXT_PUBLIC_XAI_API_KEY: z.string().default(''),
    NEXT_PUBLIC_GROQ_API_KEY: z.string().default(''),
    NEXT_PUBLIC_ANTHROPIC_API_KEY: z.string().default(''),
    NEXT_PUBLIC_GEMINI_API_KEY: z.string().default(''),
    NEXT_PUBLIC_PERPLEXITY_API_KEY: z.string().default(''),
    NEXT_PUBLIC_PRO_USERS_MESSAGE_LIMIT: z.coerce.number().default(500),
    NEXT_PUBLIC_LIFETIME_USERS_MESSAGE_LIMIT: z.coerce.number().default(1000),
    NEXT_PUBLIC_FREE_USERS_MESSAGE_LIMIT: z.coerce.number().default(100),
  },
  runtimeEnv: {
    NEXT_PUBLIC_OPENAI_API_KEY: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    NEXT_PUBLIC_TAVILY_API_KEY: process.env.NEXT_PUBLIC_TAVILY_API_KEY,
    NEXT_PUBLIC_HUGEICONS_API_KEY: process.env.NEXT_PUBLIC_HUGEICONS_API_KEY,
    NEXT_PUBLIC_LEMON_STORE_ID: process.env.NEXT_PUBLIC_LEMON_STORE_ID,
    NEXT_PUBLIC_PRO_PAYMENT_LINK: process.env.NEXT_PUBLIC_PRO_PAYMENT_LINK,
    NEXT_PUBLIC_PRO_MONTHLY_VARIANT_ID:
      process.env.NEXT_PUBLIC_PRO_MONTHLY_VARIANT_ID,
    NEXT_PUBLIC_PRO_ANNUALLY_VARIANT_ID:
      process.env.NEXT_PUBLIC_PRO_ANNUALLY_VARIANT_ID,
    NEXT_PUBLIC_LIFETIME_PAYMENT_LINK:
      process.env.NEXT_PUBLIC_LIFETIME_PAYMENT_LINK,
    NEXT_PUBLIC_LIFETIME_VARIANT_ID:
      process.env.NEXT_PUBLIC_LIFETIME_VARIANT_ID,
    NEXT_PUBLIC_XAI_API_KEY: process.env.NEXT_PUBLIC_XAI_API_KEY,
    NEXT_PUBLIC_GROQ_API_KEY: process.env.NEXT_PUBLIC_GROQ_API_KEY,
    NEXT_PUBLIC_ANTHROPIC_API_KEY: process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY,
    NEXT_PUBLIC_GEMINI_API_KEY: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
    NEXT_PUBLIC_PERPLEXITY_API_KEY: process.env.NEXT_PUBLIC_PERPLEXITY_API_KEY,
    NEXT_PUBLIC_PRO_USERS_MESSAGE_LIMIT:
      process.env.NEXT_PUBLIC_PRO_USERS_MESSAGE_LIMIT,
    NEXT_PUBLIC_LIFETIME_USERS_MESSAGE_LIMIT:
      process.env.NEXT_PUBLIC_LIFETIME_USERS_MESSAGE_LIMIT,
    NEXT_PUBLIC_FREE_USERS_MESSAGE_LIMIT:
      process.env.NEXT_PUBLIC_FREE_USERS_MESSAGE_LIMIT,
  },
});
