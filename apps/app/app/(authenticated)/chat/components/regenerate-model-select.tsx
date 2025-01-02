import { type TModelKey, useModelList } from '@/app/hooks/use-model-list';
import { ArrowClockwise } from '@phosphor-icons/react';
import { Badge } from '@repo/design-system/components/ui/badge';
import { Button } from '@repo/design-system/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/design-system/components/ui/dropdown-menu';
import { Tooltip } from '@repo/design-system/components/ui/tooltip-with-content';
import { useState } from 'react';

export type TRegenerateModelSelect = {
  onRegenerate: (modelKey: TModelKey) => void;
};

export const RegenerateWithModelSelect = ({
  onRegenerate,
}: TRegenerateModelSelect) => {
  const { models } = useModelList();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <Tooltip content="Regenerate">
          <DropdownMenuTrigger asChild>
            {
              <Button variant="ghost" size="iconSm" rounded="lg">
                <ArrowClockwise size={16} weight="bold" />
              </Button>
            }
          </DropdownMenuTrigger>
        </Tooltip>
        <DropdownMenuContent className="min-w-[250px] text-sm">
          {models.map((model) => (
            <DropdownMenuItem
              key={model.key}
              onClick={() => {
                onRegenerate(model.key);
              }}
            >
              {model.icon()} {model.name} {model.isNew && <Badge>New</Badge>}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
