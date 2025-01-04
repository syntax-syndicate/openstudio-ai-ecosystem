import { BotAvatar } from '@/app/(authenticated)/chat/components/bot-avatar';
import { useSessionsContext } from '@/app/context/sessions/provider';
import type { TChatSession } from '@/app/hooks/use-chat-session';
import { useModelList } from '@/app/hooks/use-model-list';
import { PencilSimple, TrashSimple } from '@phosphor-icons/react';
import { Button } from '@repo/design-system/components/ui/button';
import { Flex } from '@repo/design-system/components/ui/flex';
import { Input } from '@repo/design-system/components/ui/input';
import { cn } from '@repo/design-system/lib/utils';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const HistoryItem = ({
  session,
  dismiss,
}: {
  session: TChatSession;
  dismiss: () => void;
}) => {
  const { currentSession, updateSessionMutation } = useSessionsContext();
  const { getModelByKey } = useModelList();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(session.title);
  const router = useRouter();
  return (
    <div
      key={session.id}
      className={cn(
        'group flex h-10 w-full cursor-pointer flex-row items-center gap-2 rounded-xl p-2 hover:bg-black/10 hover:dark:bg-black/30',
        currentSession?.id === session.id ? 'bg-black/10 dark:bg-black/30' : ''
      )}
      onClick={() => {
        if (!isEditing) {
          router.push(`/chat/${session.id}`);
          dismiss();
        }
      }}
    >
      {isEditing ? (
        <Input
          variant="ghost"
          className="h-6"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setIsEditing(false);
              updateSessionMutation.mutate({
                sessionId: session.id,
                session: { title: title || session?.title || 'Untitled' },
              });
            }
          }}
          onBlur={() => {
            setIsEditing(false);
            updateSessionMutation.mutate({
              sessionId: session.id,
              session: { title: title || session?.title || 'Untitled' },
            });
          }}
        />
      ) : (
        <>
          {session.bot ? (
            <BotAvatar
              size="small"
              name={session?.bot?.name}
              avatar={session?.bot?.avatar}
            />
          ) : (
            getModelByKey(session.messages?.[0]?.model)?.icon()
          )}
          <span className="w-full truncate text-xs md:text-sm">
            {session.title}
          </span>
        </>
      )}
      {!isEditing && (
        <Flex className={'hidden group-hover:flex'}>
          <Button
            variant="ghost"
            size="iconXS"
            onClick={(e) => {
              setIsEditing(true);
              e.stopPropagation();
            }}
          >
            <PencilSimple size={14} weight="bold" />
          </Button>
          <Button variant="ghost" size="iconXS">
            <TrashSimple size={14} weight="bold" />
          </Button>
        </Flex>
      )}
    </div>
  );
};
