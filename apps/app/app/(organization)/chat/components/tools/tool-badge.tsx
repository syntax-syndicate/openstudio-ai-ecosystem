import { Spinner } from '@repo/design-system/components/ui';
import { Flex } from '@repo/design-system/components/ui/flex';
import { Type } from '@repo/design-system/components/ui/text';

export type ToolBadgeProps = {
  //TODO: add hugeicons props later
  icon: any;
  isLoading?: boolean;
  loadingPlaceholder?: string;
  text: string;
};
export const ToolBadge = ({
  icon,
  isLoading,
  loadingPlaceholder,
  text,
}: ToolBadgeProps) => {
  const Icon = icon;
  return (
    <Flex items="center" gap="sm" className="rounded-full">
      {isLoading ? (
        <Spinner />
      ) : (
        <Icon size={16} strokeWidth={2} className="text-zinc-500" />
      )}
      <Type size="sm" textColor="secondary">
        {isLoading ? loadingPlaceholder : text}
      </Type>
    </Flex>
  );
};
