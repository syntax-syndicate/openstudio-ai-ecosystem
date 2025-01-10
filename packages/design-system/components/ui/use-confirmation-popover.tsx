import { RefAttributes, FC, useState } from "react";
import { Button } from "@repo/design-system/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@repo/design-system/components/ui/popover";

export type TPopoverConfirm = {
  title: string;
  onConfirm: () => void;
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
        <p className="text-sm md:text-base font-medium pb-2">{title}</p>
        <div className="flex flex-row gap-1">
          <Button
            variant={confimBtnVariant}
            size="sm"
            onClick={(e) => {
              onConfirm();
              e.stopPropagation();
            }}
          >
             {Icon && <Icon size={16} strokeWidth={2} />}
            {confimBtnText}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              onCancel?.();
              setOpenConfirm(false);
              e.stopPropagation();
            }}
          >
            Cancel
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};