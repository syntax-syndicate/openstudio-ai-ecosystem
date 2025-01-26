import Button from '@repo/design-system/components/minime/button';
import type { buttonVariants } from '@repo/design-system/components/minime/button';
import { Icons } from '@repo/design-system/components/ui/icons';
import { cn } from '@repo/design-system/lib/utils';
import type { VariantProps } from '@repo/design-system/lib/utils';
import Link from 'next/link';
import type React from 'react';

export default function NavButton({
  children,
  className,
  href,
  icon,
  buttonVariant = 'default',
  size = 'sm',
  iconSize = 16,
  variant = 'button',
  direction = 'rtl',
  buttonClassname,
  ...props
}: {
  children?: React.ReactNode;
  className?: string;
  buttonVariant?: VariantProps<typeof buttonVariants>['variant'];
  size?: VariantProps<typeof buttonVariants>['size'];
  href: string;
  iconSize?: number;
  buttonClassname?: string;
  variant?: 'text' | 'button';
  icon?: keyof typeof Icons;
  direction?: 'ltr' | 'rtl';
  [key: string]: any;
}) {
  const Icon = icon ? Icons[icon] : () => null;
  return (
    <Link
      href={href}
      className={cn(
        'flex w-max items-center gap-1 text-gray-4 text-xs transition-colors',
        className,
        direction === 'ltr' ? 'flex-row-reverse' : ''
      )}
      {...props}
    >
      {variant === 'text' ? (
        <>
          {children}
          <Icon size={iconSize} />
        </>
      ) : (
        <Button
          variant={buttonVariant}
          size={size}
          className={cn(
            buttonClassname,
            direction === 'ltr' ? 'flex-row-reverse' : ''
          )}
          aria-label={props['aria-label']}
        >
          {children}
          <Icon size={iconSize} />
        </Button>
      )}
    </Link>
  );
}
