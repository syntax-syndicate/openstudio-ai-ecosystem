import { TubeNavbar } from '@/modules/tube/home/ui/components/tube-navbar';
import { CategoriesSection } from '@/modules/tube/home/ui/sections/categories-section';
import { ResultsSection } from '../sections/results-section';

interface PageProps {
  query: string | undefined;
  categoryId: string | undefined;
}

export const SearchView = ({ query, categoryId }: PageProps) => {
  return (
    <>
      <TubeNavbar />
      <div className="flex h-[100dvh] w-full flex-col items-center overflow-y-auto">
        <CategoriesSection categoryId={categoryId} />
        <ResultsSection query={query} categoryId={categoryId} />
      </div>
    </>
  );
};
