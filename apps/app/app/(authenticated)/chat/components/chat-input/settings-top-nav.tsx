import { useFeedback } from '@/app/(authenticated)/chat/components/feedback/use-feedback';
import { SettingsTabs } from '@/app/(authenticated)/chat/components/layout/settings-tabs';
import { useRootContext } from '@/context/root';
import { Flex } from '@repo/design-system/components/ui/flex';
import { useRouter } from 'next/navigation';
import { TopNav } from '../layout/top-nav';

export const SettingsTopNav = () => {
  const { push } = useRouter();
  const { setOpen, renderModal } = useFeedback();
  const {
    isSidebarOpen,
    setIsSidebarOpen,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
  } = useRootContext();
  return (
    // <Flex
    //   className="sticky top-0 z-20 flex w-full rounded-t-md border-zinc-500/10 border-b bg-zinc-25 px-1 pt-1 pb-0 md:px-2 md:pt-2 dark:bg-zinc-800"
    //   direction="col"
    // >
    //   <Flex
    //     direction="row"
    //     gap="xs"
    //     justify="between"
    //     items="center"
    //     className="w-full"
    //   >
    //     <Flex gap="xs" items="center">
    //       <Button
    //         variant="ghost"
    //         size="icon-sm"
    //         className="flex lg:hidden"
    //         onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
    //       >
    //         <PanelLeft size={16} strokeWidth={2} />
    //       </Button>

    //       <Button
    //         variant="ghost"
    //         size="icon-sm"
    //         className="hidden lg:flex"
    //         onClick={() => setIsSidebarOpen(!isSidebarOpen)}
    //       >
    //         <PanelLeft size={16} strokeWidth={2} />
    //       </Button>
    //       <Button variant="ghost" size="icon-sm" onClick={() => push('/chat')}>
    //         <ChevronLeft size={16} strokeWidth={2} />
    //       </Button>
    //       <Type weight="medium">Settings</Type>
    //     </Flex>
    //     <Flex gap="xs" items="center">
    //       <Button
    //         variant="bordered"
    //         size="sm"
    //         onClick={() => {
    //           window.open(
    //             'https://github.com/kuluruvineeth/openstudio-beta',
    //             '_blank'
    //           );
    //         }}
    //       >
    //         <Github size={16} />
    //         <span className="hidden md:block">Star on Github</span>
    //       </Button>
    //       <Button
    //         variant="bordered"
    //         size="sm"
    //         onClick={() => {
    //           setOpen(true);
    //         }}
    //       >
    //         <FlagIcon size={16} className="block md:hidden" />
    //         <span className="hidden md:block">Feedback</span>
    //       </Button>
    //     </Flex>
    //   </Flex>
    <Flex direction="col" className="w-full">
      <TopNav title="Settings" showBackButton borderBottom={false} />
      <Flex
        direction="row"
        className="w-full border-b bg-zinc-25 px-2 pt-0 dark:bg-zinc-800"
      >
        <SettingsTabs />
      </Flex>
    </Flex>
  );
};
