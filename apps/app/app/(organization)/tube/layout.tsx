import { TubeLayout } from '@/modules/tube/home/ui/layouts/tube-layout';
import { TubeProvider } from '@/modules/tube/providers/tube-provider';
import { trpc } from '@/trpc/server';
import { Flex } from '@repo/design-system/components/ui/flex';
interface LayoutProps {
  children: React.ReactNode;
}

const Layout = async ({ children }: LayoutProps) => {
  void trpc.user.getPremium.prefetch();
  return (
    <TubeProvider>
      <TubeLayout>
        <Flex className="w-full" direction="col">
          {children}
        </Flex>
      </TubeLayout>
    </TubeProvider>
  );
};

export default Layout;
