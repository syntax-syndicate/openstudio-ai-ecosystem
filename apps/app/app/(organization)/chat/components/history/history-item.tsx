import { useSessions } from '@/context';
import type { TChatSession } from '@/types';
import { HugeiconsIcon } from '@hugeicons/react';
import { Button } from '@repo/design-system/components/ui/button';
import { Flex } from '@repo/design-system/components/ui/flex';
import {
  Delete01Icon,
  Edit02Icon,
} from '@repo/design-system/components/ui/icons';
import { Input } from '@repo/design-system/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@repo/design-system/components/ui/popover';
import { Type } from '@repo/design-system/components/ui/text';
import { Tooltip } from '@repo/design-system/components/ui/tooltip-with-content';
import { cn } from '@repo/design-system/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export const HistoryItem = ({
  session,
  dismiss,
}: {
  session: TChatSession;
  dismiss: () => void;
}) => {
  const pathname = usePathname();
  const {
    updateSessionMutation,
    removeSessionMutation,
    refetchSessions,
    createSession,
    setActiveSessionId,
    activeSessionId,
  } = useSessions();
  const { push } = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(session.title);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const historyInputRef = useRef<HTMLInputElement>(null);
  const isChatPage = pathname.startsWith('/chat');

  useEffect(() => {
    if (isEditing) {
      historyInputRef.current?.focus();
    }
  }, [isEditing]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleInputBlur = () => {
    setIsEditing(false);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
      updateSessionMutation.mutate({
        sessionId: session.id,
        session: {
          title: title?.trim() || session?.title || 'Untitled',
        },
      });
    }
  };

  const handleOnClick = () => {
    if (!isEditing) {
      push('/chat');
      setActiveSessionId(session.id);
      dismiss();
    }
  };

  const containerClasses = cn(
    'group flex h-9 w-full cursor-pointer flex-row items-center gap-2 rounded-md py-0.5 pr-1 pl-2 hover:bg-zinc-500/10',
    (activeSessionId === session.id && isChatPage) || isEditing
      ? 'bg-zinc-500/10'
      : ''
  );

  const handleEditClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsEditing(true);
    e.stopPropagation();
  };

  const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setOpenDeleteConfirm(true);
    e.stopPropagation();
  };

  const handleDeleteConfirm = (e: React.MouseEvent<HTMLButtonElement>) => {
    removeSessionMutation.mutate(session.id, {
      onSuccess: () => {
        if (activeSessionId === session.id) {
          createSession();
        }
        refetchSessions?.();
        setOpenDeleteConfirm(false);
      },
    });
    e.stopPropagation();
  };

  return (
    <div key={session.id} className={containerClasses} onClick={handleOnClick}>
      {isEditing ? (
        <Input
          variant="ghost"
          className="h-6 pl-0 text-sm"
          ref={historyInputRef}
          value={title || 'Untitled'}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          onBlur={handleInputBlur}
        />
      ) : (
        <>
          <Flex direction="col" items="start" className="w-full" gap="none">
            <Type className="line-clamp-1 w-full" size="sm" textColor="primary">
              {session.title}
            </Type>
          </Flex>
        </>
      )}
      {(!isEditing || openDeleteConfirm) && (
        <Flex
          className={cn('hidden group-hover:flex', openDeleteConfirm && 'flex')}
        >
          <Button variant="ghost" size="icon-xs" onClick={handleEditClick}>
            <HugeiconsIcon icon={Edit02Icon} size={14} strokeWidth={2} />
          </Button>
          <Tooltip content="Delete">
            <Popover
              open={openDeleteConfirm}
              onOpenChange={setOpenDeleteConfirm}
            >
              <PopoverTrigger asChild>
                <Button
                  variant={openDeleteConfirm ? 'secondary' : 'ghost'}
                  size="icon-xs"
                  onClick={(e) => handleDeleteClick(e)}
                >
                  <HugeiconsIcon
                    icon={Delete01Icon}
                    size={14}
                    strokeWidth={2}
                  />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="z-[1000]" side="bottom">
                <p className="pb-2 font-medium text-sm">
                  Are you sure you want to delete this session?
                </p>
                <div className="flex flex-row gap-1">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDeleteConfirm}
                  >
                    Delete
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={(e) => {
                      setOpenDeleteConfirm(false);
                      e.stopPropagation();
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </Tooltip>
        </Flex>
      )}
    </div>
  );
};
