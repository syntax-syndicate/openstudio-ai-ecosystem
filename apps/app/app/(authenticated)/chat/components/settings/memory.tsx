import { SettingCard } from '@/app/(authenticated)/chat/components/settings/setting-card';
import { SettingsContainer } from '@/app/(authenticated)/chat/components/settings/settings-container';
import { usePreferenceContext } from '@/app/context/preferences';
import { Delete01Icon } from '@hugeicons/react';
import { Button } from '@repo/design-system/components/ui/button';
import { Type } from '@repo/design-system/components/ui/text';

export const MemorySettings = () => {
  const { updatePreferences, preferences } = usePreferenceContext();
  const renderMemory = (memory: string) => {
    return (
      <SettingCard className="flex flex-row items-center px-3 py-1">
        <Type size="sm" className="flex-1">
          {memory}
        </Type>
        <Button variant="ghost" size="iconXS">
          <Delete01Icon size={16} strokeWidth={1.2} />
        </Button>
      </SettingCard>
    );
  };
  return (
    <SettingsContainer title="Memory">
      {preferences?.memories?.map(renderMemory)}
    </SettingsContainer>
  );
};
