'use client';

import { ModelIcon } from '@/app/(authenticated)/chat/components/icons/model-icon';
import Spinner from '@repo/design-system/components/ui/loading-spinner';

const App = async () => {
  // const router = useRouter();
  // const { createSession } = useChatContext();
  // useEffect(() => {
  //   createSession().then((session) => {
  //     router.push(`/chat/${session.id}`);
  //   });
  // }, []);

  return (
    <main className="flex h-[100dvh] w-screen flex-col items-center justify-center gap-2">
      <ModelIcon type="chathub" size="lg" />
      <Spinner />
    </main>
  );
};

export default App;
