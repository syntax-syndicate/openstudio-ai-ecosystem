import { Spinner } from '@repo/design-system/components/ui/loading-spinner';
import { Type } from '@repo/design-system/components/ui/text';

export type FullPageLoaderProps = {
  label?: string;
};

export const FullPageLoader = ({ label }: FullPageLoaderProps) => {
  return (
    <div className="flex h-[90vh] w-full flex-col items-center justify-center gap-1">
      <Spinner />
       {label && (
        <Type size="xs" textColor="secondary">
          {label}
        </Type>
      )}
    </div>
  );
};