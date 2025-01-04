import { SettingsContainer } from '@/app/(authenticated)/chat/components/settings/settings-container';
import { useChatSession } from '@/app/hooks/use-chat-session';
import { useRouter } from 'next/navigation';

export const Data = () => {
  const { push } = useRouter();
  const { clearSessions, createNewSession } = useChatSession();
  const clearAllData = async () => {
    clearSessions().then(() => {
      createNewSession().then((session) => {
        push(`/chat/${session?.id}`);
      });
    });
  };
  return (
    <SettingsContainer title="Manage your Data">
      <div></div>
    </SettingsContainer>
  );
};
