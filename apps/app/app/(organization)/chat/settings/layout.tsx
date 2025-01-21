'use client';
import { SettingsTopNav } from '@/app/(organization)/chat/components/chat-input/settings-top-nav';
import { useRootContext } from '@/context/root';
import { Flex } from '@repo/design-system/components/ui/flex';
import { usePathname, useRouter } from 'next/navigation';
import type { ReactNode } from 'react';

export type TSettingMenu = {
  name: string;
  //TODO: later add hugeicons props
  // icon: FC<Omit<HugeiconsProps, "ref"> & RefAttributes<SVGSVGElement>>;
  icon: any;
  route: string;
};

export default function SettingsPage({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const { setIsMobileSidebarOpen } = useRootContext();
  const { push } = useRouter();
  const pathname = usePathname();

  // useEffect(() => {
  //   setIsMobileSidebarOpen(false);
  //   if (pathname === '/chat/settings') {
  //     push('/chat/settings/common');
  //   }
  // }, [pathname]);

  return (
    <Flex
      justify="center"
      direction="col"
      className="relative h-full w-full bg-white dark:bg-zinc-800"
    >
      <SettingsTopNav />
      <Flex className="no-scrollbar h-full w-full flex-grow justify-center overflow-y-auto pb-24">
        <Flex className="relative w-[700px]">
          <Flex className="w-full px-4 pt-8 md:p-8">{children}</Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}
