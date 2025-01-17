import { Spinner } from '@repo/design-system/components/ui/loading-spinner';

export const FullPageLoader = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Spinner />
    </div>
  );
};