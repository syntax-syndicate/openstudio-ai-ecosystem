import { keys as analytics } from '@repo/analytics/keys';
import { keys as database } from '@repo/backend/keys';
import { keys as email } from '@repo/email/keys';
import { keys as core } from '@repo/next-config/keys';
import { keys as observability } from '@repo/observability/keys';
import { keys as payments } from '@repo/payments/keys';
import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  extends: [
    analytics(),
    core(),
    database(),
    email(),
    observability(),
    payments(),
  ],
  server: {

  },
  client: {
    //lemon squeezy
    NEXT_PUBLIC_LEMON_STORE_ID: z.string().nullish().default('openstudio'),

    //pro
    NEXT_PUBLIC_PRO_PAYMENT_LINK: z.string().default(''),
    NEXT_PUBLIC_PRO_MONTHLY_VARIANT_ID: z.coerce.number().default(0),
    NEXT_PUBLIC_PRO_ANNUALLY_VARIANT_ID: z.coerce.number().default(0),

    //lifetime
    NEXT_PUBLIC_LIFETIME_PAYMENT_LINK: z.string().default(''),
    NEXT_PUBLIC_LIFETIME_VARIANT_ID: z.coerce.number().default(0),
  },
  runtimeEnv: {
    NEXT_PUBLIC_PRO_MONTHLY_VARIANT_ID: process.env.NEXT_PUBLIC_PRO_MONTHLY_VARIANT_ID,
    NEXT_PUBLIC_PRO_ANNUALLY_VARIANT_ID: process.env.NEXT_PUBLIC_PRO_ANNUALLY_VARIANT_ID,
    NEXT_PUBLIC_LIFETIME_VARIANT_ID: process.env.NEXT_PUBLIC_LIFETIME_VARIANT_ID,
    NEXT_PUBLIC_LEMON_STORE_ID: process.env.NEXT_PUBLIC_LEMON_STORE_ID,
    NEXT_PUBLIC_PRO_PAYMENT_LINK: process.env.NEXT_PUBLIC_PRO_PAYMENT_LINK,
    NEXT_PUBLIC_LIFETIME_PAYMENT_LINK: process.env.NEXT_PUBLIC_LIFETIME_PAYMENT_LINK,
  },
});
