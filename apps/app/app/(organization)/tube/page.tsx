import { TubeNavbar } from '@/modules/tube/ui/components/tube-navbar';
import { trpc } from '@/trpc/server';
import { Flex } from '@repo/design-system/components/ui/flex';
import Test from './test';

const Page = async () => {
  void trpc.hello.prefetch({ name: 'Vineeth' });
  return (
    <Flex className="w-full" direction="col">
      <TubeNavbar />
      <Test />
    </Flex>
  );
};

export default Page;
