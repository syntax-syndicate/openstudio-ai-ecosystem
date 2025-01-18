import { useFeedback } from '@/app/(authenticated)/chat/components/feedback/use-feedback';
import { useRootContext } from '@/context/root';
import { Button } from '@repo/design-system/components/ui/button';
import { Flex } from '@repo/design-system/components/ui/flex';
import { Type } from '@repo/design-system/components/ui/text';
import { ChevronLeft, FlagIcon, Github, PanelLeft } from 'lucide-react';

export const SettingsTopNav = () => {
  const { setOpen, renderModal } = useFeedback();
  const {
    isSidebarOpen,
    setIsSidebarOpen,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
  } = useRootContext();
  return (
    <Flex
      className="absolute top-0 z-20 flex w-full rounded-t-md border-zinc-500/10 border-b bg-zinc-25 p-1 md:hidden md:p-2 dark:bg-zinc-800"
      items="center"
      justify="between"
    >
      <Flex gap="xs" items="center">
        <Button
          variant="ghost"
          size="iconSm"
          className="flex md:hidden"
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        >
          <PanelLeft size={16} strokeWidth={2} />
        </Button>
        <Button
          variant="ghost"
          size="iconSm"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <ChevronLeft size={16} strokeWidth={2} />
        </Button>
        <Type>Settings</Type>
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
        <Button
          variant="bordered"
          size="sm"
          onClick={() => {
            setOpen(true);
          }}
        >
          <FlagIcon size={16} className="block md:hidden" />
          <span className="hidden md:block">Feedback</span>
        </Button>
      </Flex>
      {renderModal()}
    </Flex>
  );
};
