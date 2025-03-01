import { TubeNavbar } from '@/modules/tube/home/ui/components/tube-navbar';
import { VideoSection } from '../sections/video-section';

interface VideoViewProps {
  videoId: string;
}

export const VideoView = ({ videoId }: VideoViewProps) => {
  return (
    <div className="flex h-screen w-full flex-col">
      <TubeNavbar />
      <div className="flex-1 overflow-y-auto px-4 pb-8">
        <div className="flex flex-col gap-6 xl:flex-row">
          <div className="min-w-0 flex-1">
            <VideoSection videoId={videoId} />
          </div>
        </div>
      </div>
    </div>
  );
};
