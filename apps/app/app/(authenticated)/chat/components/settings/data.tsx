import { SettingsContainer } from '@/app/(authenticated)/chat/components/settings/settings-container';
import { useSettings } from '@/app/context/settings/context';
import { useChatSession } from '@/app/hooks/use-chat-session';
import { Button } from '@repo/design-system/components/ui/button';
import { useToast } from '@repo/design-system/components/ui/use-toast';
import { useRouter } from 'next/navigation';

export const Data = () => {
  const { push } = useRouter();
  const { clearSessions, createNewSession } = useChatSession();
  const { dismiss } = useSettings();
  const { toast } = useToast();

  const clearAllData = async () => {
    toast({
      title: "Clear All Data?",
      description: "This action cannot be undone.",
      variant: "destructive",
      action: (
        <Button
          size="sm"
          variant="default"
          onClick={() => {
            clearSessions().then(() => {
              createNewSession().then((session) => {
                toast({
                  title: "Data Cleared",
                  description: "All chat data has been cleared",
                  variant: "default",
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
      <div className="flex flex-row items-end justify-between">
        <p className="text-sm text-zinc-500 md:text-base">
          Clear all chat data
        </p>
      </div>
      <Button variant="destructive" onClick={clearAllData}>
        Clear All Data
      </Button>
    </SettingsContainer>
  );
};
