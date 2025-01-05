import { SettingCard } from '@/app/(authenticated)/chat/components/settings/setting-card';
import { SettingsContainer } from '@/app/(authenticated)/chat/components/settings/settings-container';
import { usePreferenceContext } from '@/app/context/preferences';
import { Flex } from '@repo/design-system/components/ui/flex';
import { Switch } from '@repo/design-system/components/ui/switch';
import { Type } from '@repo/design-system/components/ui/text';

export const VoiceInput = () => {
  const { updatePreferences, preferences } = usePreferenceContext();

  return (
    <SettingsContainer title="Speech-to-Text Settings">
      <SettingCard className="flex flex-col justify-center p-3">
        <Flex justify="between" items="center">
          <Flex direction="col" items="start">
            <Type textColor="primary" weight="medium">
              Enable Whisper Speech-to-Text
            </Type>
            <Type size="xs" textColor="tertiary">
              OpenAI API key required.
            </Type>
          </Flex>
          <Switch
            checked={preferences?.whisperSpeechToTextEnabled}
            onCheckedChange={(checked) => {
              updatePreferences({
                whisperSpeechToTextEnabled: checked,
              });
            }}
          />
        </Flex>
      </SettingCard>
    </SettingsContainer>
  );
};
