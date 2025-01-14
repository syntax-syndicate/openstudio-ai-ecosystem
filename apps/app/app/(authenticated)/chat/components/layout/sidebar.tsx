import { HistorySidebar } from '@/app/(authenticated)/chat/components/history/history-side-bar';
import { ModelIcon } from '@/app/(authenticated)/chat/components/model-icon';
import { useSessions } from '@/context';
import {
  FolderLibraryIcon,
} from '@hugeicons/react';
import {
  Button
} from '@repo/design-system/components/ui';
import { Badge } from '@repo/design-system/components/ui/badge';
import { Flex } from '@repo/design-system/components/ui/flex';
import {
  PlusSignIcon,
  Settings03Icon,
} from '@repo/design-system/components/ui/icons';
import { Tooltip } from '@repo/design-system/components/ui/tooltip-with-content';
import { useRouter } from 'next/navigation';
import { MoreOptionsDropdown } from '@/app/(authenticated)/chat/components/layout/more-options-dropdown';
import { SidebarTrigger } from '@repo/design-system/components/ui/sidebar';
export const SidebarItem = ({
  tooltip,
  icon,
  onClick,
}: {
  tooltip: string;
  icon: any;
  onClick: () => void;
}) => {
  if (!icon) return null;
  const Icon = icon;
  return (
    <Tooltip content={tooltip} side="left" sideOffset={4}>
      <Button size="iconSm" variant="ghost" onClick={onClick}>
        <Icon size={20} strokeWidth={2} />
      </Button>
    </Tooltip>
  );
};

export const Sidebar = () => {
  const { push } = useRouter();
  const { createSession } = useSessions();

  return (
    <div className="group fixed z-10 flex w-full flex-row items-center justify-center gap-2.5 border-zinc-500/10 p-2.5 dark:border-zinc-500/5 md:h-screen md:w-auto md:flex-col md:border-r">
      <SidebarTrigger />
      <Flex
        direction="col"
        items="center"
        gap="sm"
        onClick={() => push("/")}
        className="cursor-pointer"
      >
        <ModelIcon type="chathub" size="sm" />
        <Badge>Beta</Badge>
      </Flex>

      <SidebarItem
        tooltip="New Session"
        icon={PlusSignIcon}
        onClick={() => {
          push("/chat");
          createSession();
        }}
      />

      <HistorySidebar />
      <SidebarItem
        tooltip="Spaces (coming soon)"
        icon={FolderLibraryIcon}
        onClick={() => {}}
      />

      <Flex className="flex-1" />
      <SidebarItem
        tooltip="Settings"
        icon={Settings03Icon}
        onClick={() => push("/settings")}
      />
      <MoreOptionsDropdown />
    </div>
  );
};
