import { StudioNavbar } from '../components/studio-navbar';
import { FormSection } from '../sections/form-section';

interface PageProps {
  videoId: string;
}

export const VideoView = ({ videoId }: PageProps) => {
  return (
    <div className="flex h-screen w-full flex-col">
      <StudioNavbar />
      <div className="flex-1 overflow-y-auto px-4 pb-8">
        <FormSection videoId={videoId} />
      </div>
    </div>
  );
};
