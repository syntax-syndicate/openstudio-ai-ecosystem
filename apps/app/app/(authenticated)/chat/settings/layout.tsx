'use client';
import { Flex } from '@repo/design-system/components/ui/flex';
import { usePathname, useRouter } from 'next/navigation';
import { type ReactNode, useEffect } from 'react';

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
  const { push } = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === '/chat/settings') {
      push('/chat/settings/common');
    }
  }, [pathname]);

  return (
    <Flex className="p-1">
      <Flex justify="center" className="rounded-lg">
        <Flex className="relative w-[720px]">
          <Flex className="no-scrollbar w-full flex-1 overflow-y-auto p-4">
            {children}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}
