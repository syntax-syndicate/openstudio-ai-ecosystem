import { currentOrganizationId } from '@repo/backend/auth/utils';
import { database } from '@repo/backend/database';
import { youtubeIntegration } from '@repo/backend/schema';
import { Link } from '@repo/design-system/components/link';
import { Badge } from '@repo/design-system/components/ui/badge';
import { Button } from '@repo/design-system/components/ui/button';
import { Icons } from '@repo/design-system/components/ui/icons';
import { cn } from '@repo/design-system/lib/utils';
import { createMetadata } from '@repo/seo/metadata';
import { eq, sql } from 'drizzle-orm';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

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

  const integrations = [
    {
      title: 'Youtube',
      description: 'Connect your Youtube channel to OpenStudio.',
      icon: Icons.youtube,
      installed: Boolean(youtubeIntegrationData[0]?.count > 0),
      installLink: '/api/integrations/youtube/start',
      configureLink: '/settings/integrations/youtube',
      isDisabled: false,
    },
    {
      title: 'LinkedIn',
      description: 'Connect your LinkedIn account to OpenStudio.',
      icon: Icons.linkedin,
      installed: false,
      installLink: '/api/integrations/linkedin/start',
      configureLink: '/settings/integrations/linkedin',
      isDisabled: true,
    },
    {
      title: 'X',
      description: 'Connect your X account to OpenStudio.',
      icon: Icons.x,
      installed: false,
      installLink: '/api/integrations/x/start',
      configureLink: '/settings/integrations/x',
      isDisabled: true,
    },
    {
      title: 'Instagram',
      description: 'Connect your Instagram account to OpenStudio.',
      icon: Icons.instagram,
      installed: false,
      installLink: '/api/integrations/instagram/start',
      configureLink: '/settings/integrations/instagram',
      isDisabled: true,
    },
    {
      title: 'WhatsApp',
      description: 'Connect your WhatsApp account to OpenStudio.',
      icon: Icons.whatsapp,
      installed: false,
      installLink: '/api/integrations/whatsapp/start',
      configureLink: '/settings/integrations/whatsapp',
      isDisabled: true,
    },
    {
      title: 'Facebook',
      description: 'Connect your Facebook account to OpenStudio.',
      icon: Icons.facebook,
      installed: false,
      installLink: '/api/integrations/facebook/start',
      configureLink: '/settings/integrations/facebook',
      isDisabled: true,
    },
    {
      title: 'Bluesky',
      description: 'Connect your Bluesky account to OpenStudio.',
      icon: Icons.bluesky,
      installed: false,
      installLink: '/api/integrations/bluesky/start',
      configureLink: '/settings/integrations/bluesky',
      isDisabled: true,
    },
    {
      title: 'Threads',
      description: 'Connect your Threads account to OpenStudio.',
      icon: Icons.threads,
      installed: false,
      installLink: '/api/integrations/threads/start',
      configureLink: '/settings/integrations/threads',
      isDisabled: true,
    },
    {
      title: 'TikTok',
      description: 'Connect your TikTok account to OpenStudio.',
      icon: Icons.tiktok,
      installed: false,
      installLink: '/api/integrations/tiktok/start',
      configureLink: '/settings/integrations/tiktok',
      isDisabled: true,
    },
    {
      title: 'Telegram',
      description: 'Connect your Telegram account to OpenStudio.',
      icon: Icons.telegram,
      installed: false,
      installLink: '/api/integrations/telegram/start',
      configureLink: '/settings/integrations/telegram',
      isDisabled: true,
    },
    {
      title: 'Reddit',
      description: 'Connect your Reddit account to OpenStudio.',
      icon: Icons.reddit,
      installed: false,
      installLink: '/api/integrations/reddit/start',
      configureLink: '/settings/integrations/reddit',
      isDisabled: true,
    },
    {
      title: 'Slack',
      description: 'Connect your Slack account to OpenStudio.',
      icon: Icons.slack,
      installed: false,
      installLink: '/api/integrations/slack/start',
      configureLink: '/settings/integrations/slack',
      isDisabled: true,
    },
    {
      title: 'Discord',
      description: 'Connect your Discord account to OpenStudio.',
      icon: Icons.discord,
      installed: false,
      installLink: '/api/integrations/discord/start',
      configureLink: '/settings/integrations/discord',
      isDisabled: true,
    },
  ];

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="m-0 font-semibold text-4xl">{title}</h1>
        <p className="mt-2 mb-0 text-muted-foreground">{description}</p>
      </div>

      <div className="not-prose divide-y">
        {integrations.map((integration) => (
          <div
            key={integration.title}
            className={cn(
              'flex items-center gap-4 py-6',
              integration.isDisabled && 'opacity-50'
            )}
          >
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
              <Button
                disabled={integration.isDisabled}
                variant="outlined"
                className="flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {integration.isDisabled ? (
                  'Configure'
                ) : (
                  <Link href={integration.configureLink}>Configure</Link>
                )}
              </Button>
            ) : (
              <Button
                disabled={integration.isDisabled}
                variant="outlined"
                className="flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {integration.isDisabled ? (
                  'Connect'
                ) : (
                  <Link href={integration.installLink}>Connect</Link>
                )}
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default IntegrationsSettings;
