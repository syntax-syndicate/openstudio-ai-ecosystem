import { SettingCard } from '@/app/(authenticated)/chat/components/settings/setting-card';
import { SettingsContainer } from '@/app/(authenticated)/chat/components/settings/settings-container';
import { useSettings } from '@/app/context/settings/context';
import { useChatSession } from '@/app/hooks/use-chat-session';
import { Button } from '@repo/design-system/components/ui/button';
import { Flex } from '@repo/design-system/components/ui/flex';
import { Type } from '@repo/design-system/components/ui/text';
import { useToast } from '@repo/design-system/components/ui/use-toast';
import { useRouter } from 'next/navigation';

export const Data = () => {
  const { push } = useRouter();
  const { clearSessions, createNewSession } = useChatSession();
  const { dismiss } = useSettings();
  const { toast } = useToast();

  const clearAllData = async () => {
    toast({
      title: 'Clear All Data?',
      description: 'This action cannot be undone.',
      variant: 'destructive',
      action: (
        <Button
          size="sm"
          variant="default"
          onClick={() => {
            clearSessions().then(() => {
              createNewSession().then((session) => {
                toast({
                  title: 'Data Cleared',
                  description: 'All chat data has been cleared',
                  variant: 'default',
                });
                push(`/chat/${session?.id}`);
                dismiss();
              });
            });
          }}
        >
          Clear All
        </Button>
      ),
    });
  };
  return (
    <SettingsContainer title="Manage your Data">
      <Flex direction="col" gap="md" className="w-full">
        <SettingCard className="p-3">
          <Flex items="center" justify="between">
            <Type textColor="secondary">Clear all chat sessions</Type>
            <Button variant="destructive" size="sm" onClick={clearAllData}>
              Clear all
            </Button>
          </Flex>
          <div className="my-3 h-[1px] w-full bg-zinc-500/10" />
          <Flex items="center" justify="between">
            <Type textColor="secondary">
              Delete all data and reset all settings
            </Type>
            <Button variant="destructive" size="sm" onClick={clearAllData}>
              Reset
            </Button>
          </Flex>
        </SettingCard>
      </Flex>
    </SettingsContainer>
  );
};
