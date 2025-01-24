'use server';

import { createClient } from '@repo/backend/auth/server';
import { removeDomain, addDomain } from '@/lib/domains';
import { User } from '@repo/backend/auth';
import { parseError } from '@repo/observability/error';

export async function updateDomain(
    user: User,
    domain?: string | null
){
    try {
    const supabase = await createClient();

    if (domain === null) {
      await Promise.all([
        supabase.auth.admin.updateUserById(user.id, {
          user_metadata: { domain: null }
        }),
        removeDomain(user.user_metadata.domain as string),
      ]);

      return new Response(null, { status: 200 });
    }

    if (domain) {
      if (domain !== user.user_metadata.domain) {
        await removeDomain(user.user_metadata.domain as string);
      }
      await Promise.all([
        supabase.auth.admin.updateUserById(user.id, {
          user_metadata: { domain }
        }),
        addDomain(domain),
      ]);

      return new Response(null, { status: 200 });
    }
  } catch (error) {
    const message = parseError(error);
    return new Response(message, { status: 400 });
  }
}


export async function updateUsername(
  user: User,
  username: string
) {
  try {
    const supabase = await createClient();
    
    await supabase.auth.admin.updateUserById(user.id, {
      user_metadata: { username }
    });

    return new Response(null, { status: 200 });
  } catch (error) {
    const message = parseError(error);
    return new Response(message, { status: 400 });
  }
}





