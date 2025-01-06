import { SettingCard } from '@/app/(authenticated)/chat/components/settings/setting-card';
import { SettingsContainer } from '@/app/(authenticated)/chat/components/settings/settings-container';
import { usePreferenceContext } from '@/app/context/preferences';

export const MemorySettings = () => {
  const { updatePreferences, preferences } = usePreferenceContext();
  const renderMemory = (memory: string) => {
    return (
      <SettingCard className="flex flex-col justify-center p-3">
        {memory}
      </SettingCard>
    );
  };
  return (
    <SettingsContainer title="Memory">
      {preferences?.memories?.map(renderMemory)}
    </SettingsContainer>
  );
};
