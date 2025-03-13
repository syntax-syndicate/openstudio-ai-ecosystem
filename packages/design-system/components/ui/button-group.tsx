import React from "react";
import { Tooltip } from "./tooltip-explanation";
import { Button } from "./button";
import { cn } from "@repo/design-system/lib/utils";

export function ButtonGroup(props: {
  buttons: {
    text?: string;
    icon?: React.ReactNode;
    tooltip?: string;
    onClick: () => void;
  }[];
  shadow?: boolean;
}) {
  return (
    <span
      className={cn("isolate inline-flex rounded-md bg-white dark:bg-zinc-800/50", {
        shadow: props.shadow,
      })}
    >
      {props.buttons.map((button) => (
        <Tooltip content={button.tooltip} key={button.text || button.tooltip}>
          <Button onClick={button.onClick} size={"icon"} variant={"ghost"}>
            {button.icon}
            {button.text}
          </Button>
        </Tooltip>
      ))}
    </span>
  );
}
