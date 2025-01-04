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
//@ts-ignore
import { Check, Warning } from "@phosphor-icons/react";
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
                <Warning
                  size={24}
                  weight="bold"
                  className="text-red-400 flex-shrink-0 mt-1"
                />
              ) : (
                <Check
                  size={24}
                  weight="bold"
                  className="text-blue-400 flex-shrink-0 mt-1"
                />
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