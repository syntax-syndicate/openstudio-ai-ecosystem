'use server';

import { OpenStudioRole } from '@repo/backend/auth';
import { createClient } from '@repo/backend/auth/server';
import {
  currentMembers,
  currentOrganizationId,
  currentUser,
} from '@repo/backend/auth/utils';
import { database } from '@repo/backend/database';
import { schema } from '@repo/backend/schema';
import { parseError } from '@repo/observability/error';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export const removeUser = async (
  userId: string
): Promise<{ error: string } | { message: string }> => {
  try {
    const [user, organizationId, members, supabase] = await Promise.all([
      currentUser(),
      currentOrganizationId(),
      currentMembers(),
      createClient(),
    ]);

    if (!user) {
      throw new Error('User not found');
    }

    if (user.user_metadata.organization_role !== OpenStudioRole.Admin) {
      throw new Error('You are not authorized to delete users');
    }

    if (!organizationId) {
      throw new Error('Not logged in');
    }

    const organization = await database
      .select()
      .from(schema.organization)
      .where(eq(schema.organization.id, organizationId));

    if (!organization) {
      throw new Error('Organization not found');
    }

    const response = await supabase.auth.admin.updateUserById(userId, {
      user_metadata: {
        organization_id: null,
        organization_role: null,
      },
    });

    if (response.error) {
      throw new Error(response.error.message);
    }

    revalidatePath('/settings/members');

    return { message: 'Member removed successfully' };
  } catch (error) {
    const message = parseError(error);

    return { error: message };
  }
};
