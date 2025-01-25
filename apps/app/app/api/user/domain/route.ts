import { updateDomain } from '@/actions/users';
import { validDomainRegex } from '@/helper/utils';
import { guard } from '@/lib/auth';
import * as z from 'zod';

const bodySchema = z.object({
  domain: z
    .string()
    .regex(validDomainRegex, 'Invalid domain')
    .optional()
    .nullable()
    .refine(
      (value) => !value?.includes('openstudio.co.in'),
      'You cannot use this domain as your own custom domain.'
    ),
});

export const POST = guard(
  async ({ user, body }) => {
    try {
      return await updateDomain(user, body.domain);
    } catch (err) {
      return new Response(null, { status: 500 });
    }
  },
  {
    requiredPlan: 'Pro',
    schemas: {
      bodySchema,
    },
  }
);
