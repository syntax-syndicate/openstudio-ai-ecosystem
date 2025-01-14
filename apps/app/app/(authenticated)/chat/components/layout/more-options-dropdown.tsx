import { useFeedback } from '@/app/(authenticated)/chat/components/feedback/use-feedback';
import { constants } from '@/config';
import {
  Comment01Icon,
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
import Avatar from 'boring-avatars';
import { useTheme } from 'next-themes';
import type { FC } from 'react';

export const MoreOptionsDropdownItem = ({
  label,
  onClick,
  icon,
  key,
}: {
  label: string;
  onClick: () => void;
  icon: any;
  key?: string;
}) => {
  const Icon = icon;
  return (
    <DropdownMenuItem key={key} onClick={onClick}>
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
  const { theme, setTheme } = useTheme();
  const { renderModal, setOpen: openFeedback } = useFeedback();
  const menuItems = [
    {
      label: 'Feedback',
      onClick: () => {
        openFeedback(true);
      },
      icon: Comment01Icon,
    },
    { label: 'Support', onClick: () => {}, icon: HelpCircleIcon },
  ];
  return (
    <>
      <DropdownMenu>
        <Tooltip content="More" side="left" sideOffset={4}>
          <DropdownMenuTrigger asChild>
            <div
              className={cn(
                'cursor-pointer rounded-full p-1 outline-none ring-2 ring-zinc-500/20 hover:ring-zinc-500/30 focus:outline-none focus:ring-zinc-500/30',
                className
              )}
            >
              <Avatar
                name={'ChatHub'}
                variant="beam"
                size={24}
                colors={constants.avatarColors}
              />
            </div>
          </DropdownMenuTrigger>
        </Tooltip>
        <DropdownMenuContent
          className="mr-2 min-w-[250px] p-1 text-sm md:text-base"
          align="end"
          side="left"
          sideOffset={4}
        >
          <Flex className="items-center p-2" gap="md">
            <Avatar
              name={'ChatHub'}
              variant="beam"
              size={24}
              colors={['#4A2BE2', '#D5EC77', '#3EE2DE', '#AF71FF', '#F882B3']}
            />
          </Flex>
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
          <DropdownMenuSeparator />
          <MoreOptionsDropdownItem
            label="Twitter"
            onClick={() => {}}
            icon={TwitterIcon}
          />
          <MoreOptionsDropdownItem
            label="Github"
            onClick={() => {}}
            icon={Github01Icon}
          />
          <DropdownMenuSeparator />
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
      {renderModal()}
    </>
  );
};
