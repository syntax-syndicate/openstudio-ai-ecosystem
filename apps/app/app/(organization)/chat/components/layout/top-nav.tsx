import { useFeedback } from '@/app/(organization)/chat/components/feedback/use-feedback';
import { useRootContext } from '@/context/root';
import { ArrowLeftDoubleIcon, ArrowRightDoubleIcon } from '@hugeicons/react';
import { Button } from '@repo/design-system/components/ui/button';
import { Flex } from '@repo/design-system/components/ui/flex';
import { Type } from '@repo/design-system/components/ui/text';
import { cn } from '@repo/design-system/lib/utils';
import { ChevronLeft, Github } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';

interface TopNavProps {
  title?: string;
  showBackButton?: boolean;
  children?: ReactNode;
  borderBottom?: boolean;
}

export const TopNav = ({
  title,
  showBackButton = false,
  children,
  borderBottom = true,
}: TopNavProps) => {
  const { push } = useRouter();
  const { setOpen, renderModal } = useFeedback();
  const {
    isSidebarOpen,
    setIsSidebarOpen,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
  } = useRootContext();
  return (
    <Flex
      className={cn(
        'sticky top-0 z-20 flex w-full rounded-t-md border-zinc-500/10 bg-zinc-25 p-1 md:p-2 dark:bg-zinc-800',
        borderBottom ? 'border-b' : ''
      )}
      direction="col"
    >
      <Flex
        direction="row"
        gap="xs"
        justify="between"
        items="center"
        className="w-full"
      >
        <Flex gap="xs" items="center">
          <Button
            variant="ghost"
            size="icon-sm"
            className="flex lg:hidden"
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          >
            {isSidebarOpen ? (
              <ArrowLeftDoubleIcon size={16} strokeWidth={2} />
            ) : (
              <ArrowRightDoubleIcon size={16} strokeWidth={2} />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="hidden lg:flex"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? (
              <ArrowLeftDoubleIcon size={16} strokeWidth={2} />
            ) : (
              <ArrowRightDoubleIcon size={16} strokeWidth={2} />
            )}
          </Button>
          {showBackButton && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => push('/chat')}
            >
              <ChevronLeft size={16} strokeWidth={2} />
            </Button>
          )}
          {title && <Type weight="medium">{title}</Type>}
          {children}
        </Flex>
        <Flex gap="xs" items="center">
          <Button
            variant="bordered"
            size="sm"
            onClick={() => {
              window.open(
                'https://github.com/kuluruvineeth/openstudio-beta',
                '_blank'
              );
            }}
          >
            <Github size={16} />
            <span className="hidden md:block">Star on Github</span>
          </Button>
          {/* <Button
            variant="bordered"
            size="sm"
            onClick={() => {
              setOpen(true);
            }}
          >
            <FlagIcon size={16} className="block md:hidden" />
            <span className="hidden md:block">Feedback</span>
          </Button> */}
        </Flex>
      </Flex>
      {renderModal()}
    </Flex>
  );
};
