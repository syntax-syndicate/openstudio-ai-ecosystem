import React from "react";
import Link from "next/link";
import { cn } from "@repo/design-system/lib/utils";

const PageHeading = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h1
    ref={ref}
    className={cn(
      "font-cal text-2xl leading-7 text-primary dark:text-foreground sm:truncate sm:text-3xl",
      className,
    )}
    {...props}
  />
));
PageHeading.displayName = "PageHeading";

const SectionHeader = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h4
    ref={ref}
    className={cn(
      "font-cal text-base leading-7 dark:text-foreground",
      className,
    )}
    {...props}
  />
));
SectionHeader.displayName = "SectionHeader";

const SectionDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "mt-1 text-sm leading-6 text-slate-700 dark:text-foreground",
      className,
    )}
    {...props}
  />
));
SectionDescription.displayName = "SectionDescription";

const MessageText = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-slate-700 dark:text-foreground", className)}
    {...props}
  />
));
MessageText.displayName = "MessageText";

const TypographyH3 = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("scroll-m-20 font-cal text-2xl", className)}
    {...props}
  />
));
TypographyH3.displayName = "TypographyH3";

const TypographyH4 = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h4 ref={ref} className={cn("font-cal text-lg", className)} {...props} />
));
TypographyH4.displayName = "TypographyH4";

const TypographyP = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("leading-7 text-muted-foreground", className)}
    {...props}
  />
));
TypographyP.displayName = "TypographyP";

type LinkProps = React.ComponentProps<typeof Link>;
const TextLink = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, ...props }, ref) => {
    return (
      <Link
        ref={ref}
        className={cn(
          "font-semibold text-blue-600 hover:underline dark:text-primary",
          className,
        )}
        {...props}
      />
    );
  },
);

TextLink.displayName = "TextLink";

export {
  PageHeading,
  SectionHeader,
  TypographyH3,
  TypographyH4,
  SectionDescription,
  MessageText,
  TypographyP,
  TextLink,
};
