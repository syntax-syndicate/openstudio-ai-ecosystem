import { Slot } from '@radix-ui/react-slot';
import { cn } from '@repo/design-system/lib/utils';
import { type VariantProps, cva } from 'class-variance-authority';
import * as React from 'react';

const buttonVariants = cva(
  'flex h-5 cursor-pointer flex-row items-center justify-center gap-1 rounded-md px-2 text-gray-1 outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-[.5]',
  {
    variants: {
      variant: {
        default:
          'border border-gray-2 text-gray-4 text-sm enabled:hover:bg-gray-2',
        destructive:
          'border border-gray-2 text-danger enabled:hover:border-danger enabled:hover:bg-danger enabled:hover:text-primary',
        secondary:
          'border border-gray-2 bg-gray-3 text-gray-4 enabled:hover:bg-gray-2 enabled:hover:text-secondary',
        ghost:
          'enabled:hover:!bg-gray-2 enabled:hover:!text-secondary text-gray-4',
        primary:
          'bg-secondary text-primary opacity-100 transition-opacity hover:opacity-80',
      },
      size: {
        sm: 'h-4.5 text-xs',
        icon: 'size-4.5 p-0 hover:text-secondary',
        wide: 'w-full px-4 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  title?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, asChild = false, children, size, title, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
        {title}
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export default Button;

export { buttonVariants };
