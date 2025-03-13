"use client";

import { HelpCircleIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@repo/design-system/lib/utils";

import { useState } from "react";
import {
  Tooltip as ShadcnTooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@repo/design-system/components/ui/tooltip";

interface TooltipProps {
  children: React.ReactElement;
  content?: string;
  contentComponent?: React.ReactNode;
}

export const Tooltip = ({
  children,
  content,
  contentComponent,
}: TooltipProps) => {
  // Make tooltip work on mobile with a click
  const [isOpen, setIsOpen] = useState(false);

  return (
    <TooltipProvider delayDuration={200}>
      <ShadcnTooltip open={isOpen} onOpenChange={setIsOpen}>
        <TooltipTrigger asChild onClick={() => setIsOpen(!isOpen)}>
          {children}
        </TooltipTrigger>
        <TooltipContent>
          {contentComponent || <p className="max-w-xs">{content}</p>}
        </TooltipContent>
      </ShadcnTooltip>
    </TooltipProvider>
  );
};


const tooltipIconVariants = cva("cursor-pointer", {
  variants: {
    size: {
      sm: "h-4 w-4",
      md: "h-5 w-5",
    },
  },
  defaultVariants: {
    size: "sm",
  },
});

interface TooltipExplanationProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tooltipIconVariants> {
  text: string;
}

export function TooltipExplanation({
  text,
  size,
  className,
}: TooltipExplanationProps) {
  return (
    <Tooltip content={text}>
      <HelpCircleIcon
        className={cn(tooltipIconVariants({ size }), className)}
      />
    </Tooltip>
  );
}


