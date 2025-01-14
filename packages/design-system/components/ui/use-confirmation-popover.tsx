import { FC, useState } from "react";
import { Button } from "@repo/design-system/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@repo/design-system/components/ui/popover";
import {Flex} from "@repo/design-system/components/ui/flex";

export type TPopoverConfirm = {
  title: string;
  onConfirm: (dismiss: () => void) => void;
  confimBtnText?: string;
  confimBtnVariant?: "destructive" | "default";
  confirmIcon?: any;
  onCancel?: () => void;
  children: React.ReactNode;
};

export const PopOverConfirmProvider = ({
  title,
  onConfirm,
  confirmIcon,
  confimBtnVariant,
  confimBtnText = "Confirm",
  onCancel,
  children,
}: TPopoverConfirm) => {
  const [openConfirm, setOpenConfirm] = useState(false);

  const Icon = confirmIcon;
  return (
    <Popover open={openConfirm} onOpenChange={setOpenConfirm}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="z-[1000]" side="bottom">
        <p className="pb-4 text-sm font-medium">{title}</p>
        <Flex gap="sm">
          <Button
            variant={confimBtnVariant}
            size="sm"
            onClick={(e) => {
              onConfirm(() => setOpenConfirm(false));
              e.stopPropagation();
            }}
          >
             {Icon && <Icon size={14} strokeWidth={2} />}
            {confimBtnText}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={(e) => {
              onCancel?.();
              setOpenConfirm(false);
              e.stopPropagation();
            }}
          >
            Cancel
          </Button>
        </Flex>{" "}
      </PopoverContent>
    </Popover>
  );
};