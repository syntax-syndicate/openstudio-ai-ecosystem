import { PersonStanding } from 'lucide-react';
import { cn } from '../lib/utils';

type LogoProperties = {
  readonly showName?: boolean;
  readonly className?: string;
};

export const Logomark = ({ className }: { className?: string }) => (
  <PersonStanding className={className} />
);

export const Logo = ({ showName, className }: LogoProperties) => (
  <div className={cn('not-prose flex items-center gap-2', className)}>
    <Logomark />
    <p
      className={cn(
        'font-semibold text-foreground text-lg tracking-tight',
        !showName && 'sr-only'
      )}
    >
      Open Studio
    </p>
  </div>
);
