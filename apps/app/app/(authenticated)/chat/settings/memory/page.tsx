'use client';

import { SettingCard } from '@/app/(authenticated)/chat/components/settings/setting-card';
import { SettingsContainer } from '@/app/(authenticated)/chat/components/settings/settings-container';
import { usePreferenceContext } from '@/context/preferences';
import { Layers01Icon } from '@hugeicons/react';
import { Button } from '@repo/design-system/components/ui/button';
import { Flex } from '@repo/design-system/components/ui/flex';
import { Delete01Icon } from '@repo/design-system/components/ui/icons';
import { Type } from '@repo/design-system/components/ui/text';

export default function MemorySettings() {
  const { updatePreferences, preferences } = usePreferenceContext();
  const renderMemory = (memory: string) => {
    return (
      <SettingCard className="flex flex-row items-center py-1 pr-2 pl-4">
        <Type size="sm" className="flex-1">
          {memory}
        </Type>
        <Button
          variant="ghost"
          size="iconSm"
          onClick={() => {
            updatePreferences({
              memories: preferences?.memories?.filter((m) => m !== memory),
            });
          }}
        >
          <Delete01Icon size={16} strokeWidth={2} />
        </Button>
      </SettingCard>
    );
  };

  const renderEmptyState = () => {
    return (
      <Flex
        direction="col"
        items="center"
        gap="none"
        className="w-full rounded-lg bg-zinc-50/50 p-4 dark:bg-white/5"
      >
        <Layers01Icon
          size={20}
          strokeWidth={1.5}
          className="mb-2 text-zinc-500"
        />
        <Type size="sm" textColor="secondary">
          No memories
        </Type>
        <Type size="xs" textColor="tertiary">
          Use memory plugin to get started
        </Type>
      </Flex>
    );
  };

  return (
    <SettingsContainer title="Memory">
      {!preferences?.memories?.length && renderEmptyState()}
      <Flex direction="col" gap="xs" className="w-full">
        {preferences?.memories?.map(renderMemory)}
      </Flex>
    </SettingsContainer>
  );
}
