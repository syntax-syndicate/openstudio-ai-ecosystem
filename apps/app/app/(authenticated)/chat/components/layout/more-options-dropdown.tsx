import { constants } from '@/config';
import {
  Github01Icon,
  HelpCircleIcon,
  Moon02Icon,
  Sun01Icon,
  TwitterIcon,
} from '@hugeicons/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@repo/design-system/components/ui';
import { Flex } from '@repo/design-system/components/ui/flex';
import { Tooltip } from '@repo/design-system/components/ui/tooltip-with-content';
import { cn } from '@repo/design-system/lib/utils';
import Avvvatars from 'avvvatars-react';
import Avatar from 'boring-avatars';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import type { FC } from 'react';

export const MoreOptionsDropdownItem = ({
  label,
  onClick,
  icon,
}: {
  label: string;
  onClick: () => void;
  icon: any;
}) => {
  const Icon = icon;
  return (
    <DropdownMenuItem onClick={onClick}>
      <Icon size={16} variant="stroke" strokeWidth="2" />
      {label}
    </DropdownMenuItem>
  );
};

export type MoreOptionsDropdownProps = {
  className?: string;
};

export const MoreOptionsDropdown: FC<MoreOptionsDropdownProps> = ({
  className,
}) => {
  const { push } = useRouter();
  const { theme, setTheme } = useTheme();
  const menuItems = [
    {
      label: 'Support',
      onClick: () => {
        window.open('mailto:kuluruvineeth8623@gmail.com', '_blank');
      },
      icon: HelpCircleIcon,
    },
  ];
  return (
    <>
      <DropdownMenu>
        <Tooltip content="More" side="bottom" sideOffset={4}>
          <DropdownMenuTrigger asChild>
            <div
              className={cn(
                'cursor-pointer rounded-full p-0.5 outline-none ring-2 ring-zinc-500/20 hover:ring-zinc-500/30 focus:outline-none focus:ring-zinc-500/30',
                className
              )}
            >
              <Avatar
                name={'ChatHub'}
                variant="marble"
                size={24}
                colors={constants.avatarColors}
              />
            </div>
          </DropdownMenuTrigger>
        </Tooltip>
        <DropdownMenuContent
          className="min-w-[250px] p-1.5 text-sm md:text-base"
          align="end"
          side="right"
          sideOffset={8}
        >
          <Flex className="items-center p-2" gap="md">
            <Avvvatars value={'ChatHub'} style={'shape'} size={24} />
          </Flex>
          <DropdownMenuSeparator className="my-1.5" />
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <MoreOptionsDropdownItem
                key={item.label}
                label={item.label}
                onClick={item.onClick}
                icon={Icon}
              />
            );
          })}
          <DropdownMenuSeparator className="my-1.5" />
          <MoreOptionsDropdownItem
            label="Twitter"
            onClick={() => {
              window.open('https://x.com/kuluruvineeth', '_blank');
            }}
            icon={TwitterIcon}
          />
          <MoreOptionsDropdownItem
            label="Github"
            onClick={() => {
              window.open(
                'https://github.com/kuluruvineeth/openstudio-beta',
                '_blank'
              );
            }}
            icon={Github01Icon}
          />
          <DropdownMenuSeparator className="my-1.5" />
          <MoreOptionsDropdownItem
            key={`theme-${theme}`}
            label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            onClick={() => {
              setTheme(theme === 'light' ? 'dark' : 'light');
            }}
            icon={theme === 'light' ? Moon02Icon : Sun01Icon}
          />
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
