import { Button } from '@repo/design-system/components/ui/button';
import { Skeleton } from '@repo/design-system/components/ui/skeleton';
import { cn } from '@repo/design-system/lib/utils';
import type React from 'react';
import type { SetStateAction } from 'react';

interface Props {
  children: React.ReactNode;
  title: string;
  tabs?: string[];
  loading?: boolean;
  setTab?: React.Dispatch<SetStateAction<any>>;
  activeTab?: string;
  className?: string;
}

export default function Card({
  children,
  title,
  tabs,
  setTab,
  activeTab,
  className,
  loading,
}: Props) {
  return (
    <div
      className={cn(
        'flex h-[200px] flex-col rounded-md border border-gray-2 dark:border-gray-3',
        className
      )}
    >
      <header className="flex h-5 items-center justify-between rounded-t-md rounded-se-md border-gray-2 border-b p-2 backdrop-blur-md dark:border-gray-3">
        {loading ? (
          <Skeleton className="h-4 w-32" />
        ) : (
          <h3 className="font-medium text-sm">{title}</h3>
        )}
        {tabs && (
          <div className="flex gap-1">
            {tabs.map((tab, i) => (
              <Button
                title={tab}
                variant="ghost"
                className={cn(
                  'h-4.4 text-xs',
                  tab.toLowerCase() === activeTab
                    ? 'bg-gray-3 text-secondary'
                    : ''
                )}
                onClick={() => setTab?.(tab.toLowerCase())}
                key={i}
              />
            ))}
          </div>
        )}
      </header>
      {children}
    </div>
  );
}
