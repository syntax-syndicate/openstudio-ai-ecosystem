'use server';

import { OpenStudioRole } from '@repo/backend/auth';
import { createClient } from '@repo/backend/auth/server';
import { currentUser } from '@repo/backend/auth/utils';
import { database } from '@repo/backend/database';
import { schema } from '@repo/backend/schema';
import { slugify } from '@repo/lib/slugify';
import { eq } from 'drizzle-orm';

type CreateOrganizationProps = {
  name: string;
  productDescription: string;
};

export const createOrganization = async ({
  name,
  productDescription,
}: CreateOrganizationProps): Promise<{ id: string } | { error: string }> => {
  try {
    const supabase = await createClient();
    const user = await currentUser();

    if (!user) {
      throw new Error('User not found');
    }

    let slug = slugify(name);

    const existingOrganization = await database
      .select()
      .from(schema.organization)
      .where(eq(schema.organization.slug, slug));

    if (existingOrganization) {
      slug = `${slug}-${Math.floor(Math.random() * 1000)}`;
    }

    const organization = await database
      .insert(schema.organization)
      .values({
        name,
        productDescription,
        slug,
      })
      .returning();

    const response = await supabase.auth.admin.updateUserById(user.id, {
      user_metadata: {
        organization_id: organization[0].id,
        organization_role: OpenStudioRole.Admin,
      },
    });

    if (response.error) {
      throw response.error;
    }

    return { id: organization[0].id };
  } catch (error) {
    //TODO: Add error handling
    // const message = parseError(error)
    return { error: error as string };
  }
};
