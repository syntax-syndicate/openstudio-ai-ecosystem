import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const keys = () =>
  createEnv({
    server: {
      LEMON_SQUEEZY_API_KEY: z.string().min(1),
      LEMON_SQUEEZY_SIGNING_SECRET: z.string().min(1),
    },
    runtimeEnv: {
      LEMON_SQUEEZY_API_KEY: process.env.LEMON_SQUEEZY_API_KEY,
      LEMON_SQUEEZY_SIGNING_SECRET: process.env.LEMON_SQUEEZY_SIGNING_SECRET,
    },
  });
