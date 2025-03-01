import { TubeNavbar } from '@/modules/tube/home/ui/components/tube-navbar';
import { CategoriesSection } from '@/modules/tube/home/ui/sections/categories-section';

interface TubeViewProps {
  categoryId?: string;
}

export const TubeView = ({ categoryId }: TubeViewProps) => {
  return (
    <>
      <TubeNavbar />
      <div className="flex h-[100dvh] w-full flex-col items-center overflow-y-auto">
        <CategoriesSection categoryId={categoryId} />
      </div>
    </>
  );
};
