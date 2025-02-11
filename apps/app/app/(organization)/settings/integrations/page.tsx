import { currentOrganizationId } from '@repo/backend/auth/utils';
import { database } from '@repo/backend/database';
import { youtubeIntegration } from '@repo/backend/schema';
import { Link } from '@repo/design-system/components/link';
import { Badge } from '@repo/design-system/components/ui/badge';
import { Button } from '@repo/design-system/components/ui/button';
import { Icons } from '@repo/design-system/components/ui/icons';
import { createMetadata } from '@repo/seo/metadata';
import { eq, sql } from 'drizzle-orm';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

const title = 'Integrations';
const description = 'Connect your favorite tools to OpenStudio.';

export const metadata: Metadata = createMetadata({
  title,
  description,
});

const IntegrationsSettings = async () => {
  const currentOrganization = await currentOrganizationId();
  if (!currentOrganization) {
    return notFound();
  }
  const [youtubeIntegrationData] = await Promise.all([
    database
      .select({ count: sql<number>`count(*)` })
      .from(youtubeIntegration)
      .where(eq(youtubeIntegration.organizationId, currentOrganization))
      .limit(1),
  ]);
  console.log('youtubeIntegrationData', youtubeIntegrationData);

  const integrations = [
    {
      title: 'Youtube',
      description: 'Connect your Youtube channel to OpenStudio.',
      icon: Icons.youtube,
      installed: Boolean(youtubeIntegrationData[0]?.count > 0),
      installLink: '/api/integrations/youtube/start',
      configureLink: '/settings/integrations/youtube',
    },
    // {
    //   title: 'LinkedIn',
    //   description: 'Connect your LinkedIn account to OpenStudio.',
    //   icon: Icons.linkedin,
    //   installed: false,
    //   installLink: '/api/integrations/linkedin/start',
    //   configureLink: '/settings/integrations/linkedin',
    // },
  ];

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="m-0 font-semibold text-4xl">{title}</h1>
        <p className="mt-2 mb-0 text-muted-foreground">{description}</p>
      </div>

      <div className="not-prose divide-y">
        {integrations.map((integration) => (
          <div key={integration.title} className="flex items-center gap-4 py-6">
            <div className="h-8 w-8">{integration.icon({ size: 32 })}</div>
            <div className="block flex-1">
              <div className="flex items-center gap-2">
                <div className="block font-medium">{integration.title}</div>
                {integration.installed && (
                  <Badge variant="outline">Connected</Badge>
                )}
              </div>
              <div className="block text-muted-foreground text-sm">
                {integration.description}
              </div>
            </div>
            {integration.installed ? (
              <Button variant="outlined" className="flex items-center gap-2">
                <Link href={integration.configureLink}>Configure</Link>
              </Button>
            ) : (
              <Button variant="outlined" className="flex items-center gap-2">
                <Link href={integration.installLink}>Connect</Link>
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default IntegrationsSettings;
