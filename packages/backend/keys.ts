import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const keys = () =>
  createEnv({
    server: {
      SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
      SUPABASE_URL: z.string().url().min(1),
      SUPABASE_ANON_KEY: z.string().min(1),
      POSTGRES_DATABASE_URL: z.string().url().min(1),
      POSTGRES_DATABASE_HOST: z.string().min(1),
      POSTGRES_DATABASE_USER: z.string().min(1),
      POSTGRES_DATABASE_PASSWORD: z.string().min(1),
    },
    client: {
      NEXT_PUBLIC_SUPABASE_URL: z.string().url().min(1),
      NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
    },
    runtimeEnv: {
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
      POSTGRES_DATABASE_URL: process.env.POSTGRES_DATABASE_URL,
      POSTGRES_DATABASE_HOST: process.env.POSTGRES_DATABASE_HOST,
      POSTGRES_DATABASE_USER: process.env.POSTGRES_DATABASE_USER,
      POSTGRES_DATABASE_PASSWORD: process.env.POSTGRES_DATABASE_PASSWORD,
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    },
  });
