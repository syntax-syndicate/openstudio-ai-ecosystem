import { MoreOptionsDropdown } from '@/app/(authenticated)/chat/components/layout/more-options-dropdown';
import { ModelIcon } from '@/app/(authenticated)/chat/components/model-icon';
import { Button } from '@repo/design-system/components/ui';
import { BetaTag } from '@repo/design-system/components/ui/beta-tag';
import { Flex } from '@repo/design-system/components/ui/flex';
import { SidebarTrigger } from '@repo/design-system/components/ui/sidebar';
import { Tooltip } from '@repo/design-system/components/ui/tooltip-with-content';
import { MessageSquare } from 'lucide-react';
import { Bolt } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

export const NavbarItem = ({
  tooltip,
  icon,
  onClick,
  isActive,
}: {
  tooltip: string;
  icon: any;
  isActive?: boolean;
  onClick: () => void;
}) => {
  if (!icon) return null;
  const Icon = icon;
  return (
    <Tooltip content={tooltip} side="right" sideOffset={4}>
      <Button
        size="iconSm"
        variant={isActive ? 'bordered' : 'ghost'}
        onClick={onClick}
      >
        <Icon size={16} strokeWidth={2} />
      </Button>
    </Tooltip>
  );
};

export const Sidebar = () => {
  const { push } = useRouter();
  const pathname = usePathname();

  return (
    <div className="group z-10 flex h-screen flex-col items-center justify-center gap-2 px-3 py-5">
      <SidebarTrigger />
      <Flex
        direction="col"
        items="center"
        gap="sm"
        onClick={() => push('/')}
        className="cursor-pointer"
      >
        <ModelIcon type="chathub" size="xs" rounded={false} />
        <BetaTag />
      </Flex>

      <NavbarItem
        tooltip="Chats"
        icon={MessageSquare}
        onClick={() => {
          push('/chat');
        }}
        isActive={pathname.includes('/chat')}
      />

      <NavbarItem
        tooltip="Settings"
        icon={Bolt}
        isActive={pathname.includes('/chat/settings')}
        onClick={() => {
          push('/chat/settings/common');
        }}
      />

      <Flex className="flex-1" />

      {/* <Flex direction="row" items="center" gap="none">
        <HistorySidebar />
      </Flex> */}
      <MoreOptionsDropdown />
    </div>
  );
};
