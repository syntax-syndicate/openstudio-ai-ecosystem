import { ModelIcon } from '@/app/(authenticated)/chat/components/icons/model-icon';
import { Button } from '@repo/design-system/components/ui/button';
import { ArrowRight } from 'lucide-react';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-8 p-4">
      <div className="flex flex-col items-center gap-4">
        <ModelIcon type="chathub" size="lg" />
        <h1 className="text-center font-bold text-4xl tracking-tight">
          Welcome to Open Studio
        </h1>
        <p className="text-center text-lg text-zinc-600 dark:text-zinc-400">
          App of Apps - Your gateway to AI-powered applications
        </p>
      </div>

      <Link href="/chat">
        <Button size="lg" className="gap-2">
          Go to Chat <ArrowRight />
        </Button>
      </Link>
    </div>
  );
}
