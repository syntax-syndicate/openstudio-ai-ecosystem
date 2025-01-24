"use client";
import { Icon } from "@/types/minime";
import { VariantProps } from "@repo/design-system/lib/utils";
import ky from "ky";
import { useTransition } from "react";
import { Icons } from "@repo/design-system/components/ui/icons";
import { Button, buttonVariants } from "@repo/design-system/components/ui/button";
import { toast } from "@repo/design-system/components/ui/use-toast";

interface ExportButtonProps {
  endpoint: string;
  text: string;
  buttonVariant?: VariantProps<typeof buttonVariants>["variant"];
  icon?: Icon;
}

export default function ExportButton({
  endpoint,
  icon,
  buttonVariant = "secondary",
  text,
}: ExportButtonProps) {
  const [pending, startTransition] = useTransition();
  const Icon = icon ? Icons[icon] : () => null;
  const onClick = () => {
    startTransition(async () => {
      const res = await ky.get(`/api/${endpoint}`);
      if (!res.ok) {
        const err = await res.text();
        toast({
          variant: "destructive",
          title: "Something went wrong.",
          description: err,
        });
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      const filename =
        res.headers.get("Content-Disposition")?.split("=")[1] || "export";

      a.href = url;
      a.download = filename;
      a.click();
    });
  };

  return (
    <Button
      type="button"
      size="sm"
      disabled={pending}
      variant={buttonVariant}
      className="w-max"
      onClick={onClick}
    >
      {pending ? (
        <Icons.spinner size={16} className="animate-spin" />
      ) : (
        <Icon size={16} />
      )}{" "}
      {text}
    </Button>
  );
}
