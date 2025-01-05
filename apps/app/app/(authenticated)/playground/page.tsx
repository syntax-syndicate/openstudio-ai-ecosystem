import { ComingSoon } from '@repo/design-system/components/ui/coming-soon';

const PlaygroundPage = async () => {
  return (
    <main className="flex h-[100dvh] w-screen flex-col items-center justify-center gap-2">
      <h1>
        Playground <ComingSoon />
      </h1>
    </main>
  );
};
export default PlaygroundPage;
