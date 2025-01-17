import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const keys = () =>
  createEnv({
    client: {
      NEXT_PUBLIC_DATABASE_URL: z.string().min(1).url(),
    },
    server: {
      DATABASE_URL: z.string().min(1).url(),
    },
    runtimeEnv: {
      NEXT_PUBLIC_DATABASE_URL: process.env.NEXT_PUBLIC_DATABASE_URL,
      DATABASE_URL: process.env.DATABASE_URL,
    },
  });
