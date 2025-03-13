import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const keys = () =>
  createEnv({
    server: {
      OPENAI_API_KEY: z.string().min(1).startsWith('sk-').optional(),
      ANTHROPIC_API_KEY: z.string().optional(),
      GROQ_API_KEY: z.string().optional(),
      GROK_API_KEY: z.string().optional(),
      OPENROUTER_API_KEY: z.string().optional(),
      GOOGLE_API_KEY: z.string().optional(),
    },
    runtimeEnv: {
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
      ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
      GROQ_API_KEY: process.env.GROQ_API_KEY,
      GROK_API_KEY: process.env.GROK_API_KEY,
      OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
      GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
    },
  });
