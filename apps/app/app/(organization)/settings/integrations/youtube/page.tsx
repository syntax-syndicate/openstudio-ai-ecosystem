import { currentOrganizationId } from '@repo/backend/auth/utils';
import { database } from '@repo/backend/database';
import { integrationStates, youtubeIntegration } from '@repo/backend/schema';
import { StackCard } from '@repo/design-system/components/stack-card';
import { Button } from '@repo/design-system/components/ui/button';
import { createMetadata } from '@repo/seo/metadata';
import { and, eq } from 'drizzle-orm';
import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

export const metadata: Metadata = createMetadata({
  title: 'YouTube Integration',
  description: 'Configure your YouTube integration settings.',
});

const YoutubeSettings = async () => {
  const organizationId = await currentOrganizationId();
  if (!organizationId) {
    return notFound();
  }

  const [youtubeInstallation] = await database
    .select({ id: youtubeIntegration.id })
    .from(youtubeIntegration)
    .where(eq(youtubeIntegration.organizationId, organizationId))
    .limit(1);

  if (!youtubeInstallation) {
    notFound();
  }

  const removeAction = async () => {
    'use server';

    await database.transaction(async (tx) => {
      await tx
        .delete(integrationStates)
        .where(
          and(
            eq(integrationStates.organizationId, organizationId),
            eq(integrationStates.platform, 'YOUTUBE')
          )
        );

      await tx
        .delete(youtubeIntegration)
        .where(eq(youtubeIntegration.id, youtubeInstallation.id));
    });

    return redirect('/settings/integrations');
  };

  return (
    <div>
      <h1 className="font-semibold text-2xl">YouTube Integration</h1>

      <StackCard title="Danger Zone" className="p-4">
        <form action={removeAction}>
          <Button type="submit" variant="destructive">
            Remove YouTube Integration
          </Button>
        </form>
      </StackCard>
    </div>
  );
};

export default YoutubeSettings;
