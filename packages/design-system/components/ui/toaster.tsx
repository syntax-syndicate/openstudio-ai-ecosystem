"use client";

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@repo/design-system/components/ui/toast";
import { useToast } from "@repo/design-system/components/ui/use-toast";
import { HugeiconsIcon } from "@hugeicons/react";
import { AlertCircleIcon, CheckmarkCircle01Icon } from "@hugeicons-pro/core-stroke-rounded";
import { Button } from "@repo/design-system/components/ui/button";

export function Toaster() {
  const { toasts, dismiss } = useToast();
  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="flex flex-row gap-3">
              {props.variant === "destructive" ? (
                <HugeiconsIcon icon={AlertCircleIcon} size={24} className="mt-1 flex-shrink-0 text-rose-400" />
              ) : (
                <HugeiconsIcon icon={CheckmarkCircle01Icon} size={24} className="mt-1 flex-shrink-0 text-teal-400" />
              )}
              <div className="grid gap-0 w-full">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
                {action && (
                  <div className="pt-2 flex flex-row gap-1">
                    {action}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        dismiss();
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
              {!action && <ToastClose />}
            </div>
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}