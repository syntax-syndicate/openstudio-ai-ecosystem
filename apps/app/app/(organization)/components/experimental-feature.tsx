import { EmptyState } from '@/components/empty-state';
import { Link } from '@repo/design-system/components/link';
import { Button } from '@repo/design-system/components/ui/button';
import { BeakerIcon } from 'lucide-react';

const ExperimentalFeature = () => (
  <main className="flex min-h-screen w-full items-center justify-center bg-backdrop">
    <EmptyState
      icon={BeakerIcon}
      title="Experimental Feature"
      description="This feature is currently in beta and not yet available. Stay tuned for updates as we continue development!"
    >
      {/* TODO: add NOTIFY email feature here */}
      <Button>
        <Link href="/">Return to Main Features</Link>
      </Button>
    </EmptyState>
  </main>
);

export default ExperimentalFeature;
