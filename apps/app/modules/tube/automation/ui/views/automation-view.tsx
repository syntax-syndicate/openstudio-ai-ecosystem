import { AutomationTabsSection } from '@/modules/tube/automation/ui/sections/tabs-section';
import { StudioNavbar } from '@/modules/tube/studio/ui/components/studio-navbar';

export const AutomationView = () => {
  return (
    <div className="flex h-screen w-full flex-col">
      <StudioNavbar />
      <div className="flex-1 overflow-y-auto px-4 pb-8">
        <AutomationTabsSection />
      </div>
    </div>
  );
};
