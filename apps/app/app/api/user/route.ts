import { updateUsername } from '@/actions/users';
import { updateUserSchema } from '@/helper/validator';
import { guard } from '@/lib/auth';

export const PATCH = guard(
  async ({ user, body }) => {
    try {
      await updateUsername(user, body.username!);

      return new Response(null, { status: 200 });
    } catch (err) {
      return new Response(JSON.stringify(err), { status: 500 });
    }
  },
  {
    schemas: {
      bodySchema: updateUserSchema,
    },
  }
);
