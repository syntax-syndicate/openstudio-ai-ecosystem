import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { AlertCircle, TerminalIcon } from "lucide-react"
import { cn } from "@repo/design-system/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg px-3 py-3 text-sm md:text-base [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-3 [&>svg]:top-3 [&>svg]:text-zinc-950 [&>svg~*]:pl-6 dark:border-zinc-800 dark:[&>svg]:text-zinc-50",
  {
    variants: {
      variant: {
        default:
          "bg-zinc-50/20 text-zinc-500 dark:bg-black/20 dark:text-zinc-200",
        success:
          "bg-green-50 text-green-950 dark:bg-green-500/10 dark:text-green-500 [&>svg]:text-green-500 dark:[&>svg]:text-green-500",
        warning:
          "bg-yellow-500/10 text-yellow-950 dark:bg-yellow-300/10 dark:text-yellow-100 [&>svg]:text-yellow-500 dark:[&>svg]:text-yellow-100",
        destructive:
          "bg-transparent text-zinc-400  [&>svg]:text-red-300 dark:text-red-300  dark:[&>svg]:text-red-300",
          
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);
const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
));
Alert.displayName = "Alert";
const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn(
      "mb-1 text-xs md:text-sm font-medium leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";
const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-xs md:text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
));

AlertDescription.displayName = "AlertDescription";


export function AlertBasic({
  title,
  description,
  icon,
  variant,
  className,
}: {
  title: string;
  description: React.ReactNode;
  icon?: React.ReactNode | null;
  variant?: "default" | "destructive" | "success";
  className?: string;
}) {
  return (
    <Alert variant={variant} className={className}>
      {icon === null ? null : icon || <TerminalIcon className="h-4 w-4" />}
      {title ? <AlertTitle>{title}</AlertTitle> : null}
      {description ? <AlertDescription>{description}</AlertDescription> : null}
    </Alert>
  );
}

export function AlertWithButton({
  title,
  description,
  icon,
  variant,
  button,
  className,
}: {
  title: string;
  description: React.ReactNode;
  icon?: React.ReactNode;
  variant?: "default" | "destructive" | "success";
  button?: React.ReactNode;
  className?: string;
}) {
  return (
    <Alert variant={variant} className={cn("pb-3 pt-5", className)}>
      {icon === null ? null : icon || <TerminalIcon className="h-4 w-4" />}
      <div className="flex items-center justify-between">
        <div>
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription>{description}</AlertDescription>
        </div>
        <div>{button}</div>
      </div>
    </Alert>
  );
}

export function AlertError({
  title,
  description,
  className,
}: {
  title: string;
  description: React.ReactNode;
  className?: string;
}) {
  return (
    <Alert variant="destructive" className={className}>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
}

export { Alert, AlertDescription, AlertTitle };