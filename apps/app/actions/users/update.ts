'use server';

import { OpenStudioRole } from '@repo/backend/auth';
import { createClient } from '@repo/backend/auth/server';
import { currentMembers, currentUser } from '@repo/backend/auth/utils';
import { parseError } from '@repo/observability/error';
import { revalidatePath } from 'next/cache';

export const updateUserRole = async (
  userId: string,
  role: OpenStudioRole
): Promise<{ error?: string }> => {
  try {
    const supabase = await createClient();
    const user = await currentUser();

    if (!user) {
      throw new Error('User not found');
    }

    if (user.user_metadata.organization_role !== OpenStudioRole.Admin) {
      throw new Error('You are not authorized to update user roles');
    }

    const members = await currentMembers();
    const admins = members.filter(
      (member) =>
        member.user_metadata.organization_role === OpenStudioRole.Admin
    );

    if (admins.length === 1) {
      const [admin] = admins;

      if (admin.id === userId && role !== OpenStudioRole.Admin) {
        throw new Error('There must be at least one admin.');
      }
    }

    const response = await supabase.auth.admin.updateUserById(userId, {
      user_metadata: { organization_role: role },
    });

    if (response.error) {
      throw new Error(response.error.message);
    }

    revalidatePath('/settings/members');

    return {};
  } catch (error) {
    const message = parseError(error);

    return { error: message };
  }
};
