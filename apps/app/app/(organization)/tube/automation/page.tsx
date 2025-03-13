import { AutomationView } from '@/modules/tube/automation/ui/views/automation-view';
import { HydrateClient, trpc } from '@/trpc/server';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Open Studio Tube - AI Automation',
  description: 'Open Studio Tube - AI Automation',
};

export default async function AutomationPage() {
  void trpc.profile.getOne.prefetch();
  return (
    <HydrateClient>
      <AutomationView />
    </HydrateClient>
  );
}
