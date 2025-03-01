'use client';
import { TubeSidebar } from '@/modules/tube/home/ui/components/tube-sidebar';
import { useTubeContext } from '@/modules/tube/providers/tube-provider';
import { Flex } from '@repo/design-system/components/ui/flex';
import { Toaster } from '@repo/design-system/components/ui/toaster';
import { cn } from '@repo/design-system/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

export type TubeLayoutProps = {
  children: React.ReactNode;
};

const TubeContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-[100dvh] w-full flex-col justify-start bg-white md:flex-row dark:bg-zinc-800">
      <div className="flex min-h-[100dvh] w-full flex-col overflow-hidden bg-zinc-50 md:flex-row dark:bg-zinc-900">
        {children}
      </div>
    </div>
  );
};

export const TubeLayout = ({ children }: TubeLayoutProps) => {
  const { isSidebarOpen } = useTubeContext();

  const mainContainerClass =
    'relative flex flex-1 flex-col h-[98dvh] w-full overflow-hidden rounded-md bg-zinc-25 shadow-sm dark:border dark:border-white/5 dark:bg-zinc-800';

  return (
    <TubeContainer>
      <Flex className="flex-1 gap-0 overflow-hidden">
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              key="tube-sidebar"
              layoutId="tube-sidebar"
              initial={{ width: 0, opacity: 1 }}
              animate={{ width: 'auto', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="hidden md:block"
            >
              <TubeSidebar />
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div className="flex-1 pt-2 pr-2">
          <div className={cn(mainContainerClass)}>{children}</div>
        </motion.div>
      </Flex>
      <Toaster />
    </TubeContainer>
  );
};
