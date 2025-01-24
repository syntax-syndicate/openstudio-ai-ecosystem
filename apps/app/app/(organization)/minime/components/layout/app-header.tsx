import { cn } from '@repo/design-system/lib/utils';
import type React from 'react';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
}

export default function AppHeader({ title, children, className }: Props) {
  return (
    <div
      className={cn('flex flex-row items-center justify-between', className)}
    >
      {title && <h3 className="title font-medium text-lg ">{title}</h3>}
      {children}
    </div>
  );
}
