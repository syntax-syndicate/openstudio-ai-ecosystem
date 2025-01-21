'use server';

import { currentOrganizationId } from '@repo/backend/auth/utils';
import { database } from '@repo/backend/database';
import { schema } from '@repo/backend/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import type { z } from 'zod';

export const updateOrganization = async (
  data: Partial<z.infer<typeof schema.organizationUpdateSchema>>
): Promise<{ error?: string }> => {
  try {
    const organizationId = await currentOrganizationId();

    if (!organizationId) {
      throw new Error('Not logged in');
    }

    await database
      .update(schema.organization)
      .set(data)
      .where(eq(schema.organization.id, organizationId));

    revalidatePath('/', 'layout');

    return {};
  } catch (error) {
    //TODO: Add error handling
    return { error: error as string };
  }
};
