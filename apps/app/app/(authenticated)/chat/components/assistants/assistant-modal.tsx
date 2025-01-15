import { CreateAssistant } from '@/app/(authenticated)/chat/components/assistants/create-assistant';
import { usePreferenceContext } from '@/context';
import { useAssistantUtils } from '@/hooks';
import { Button } from '@repo/design-system/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandList,
} from '@repo/design-system/components/ui/command';
import { Flex } from '@repo/design-system/components/ui/flex';
import { Type } from '@repo/design-system/components/ui/text';
import { cn } from '@repo/design-system/lib/utils';

import { AssistantBanner } from '@/app/(authenticated)/chat/components/assistants/assistant-banner';
import { AssistantHeader } from '@/app/(authenticated)/chat/components/assistants/assistant-header';
import { AssistantItem } from '@/app/(authenticated)/chat/components/assistants/assistant-item';
import { defaultPreferences } from '@/config';
import type { TAssistant } from '@/types';
import { CommandGroup } from '@repo/design-system/components/ui/command';
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
} from '@repo/design-system/components/ui/dialog';
import { type FC, useEffect, useRef, useState } from 'react';

export type TAssitantModal = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedAssistantKey: string;
  onAssistantchange: (assistantKey: string) => void;
};

export const AssistantModal: FC<TAssitantModal> = ({
  open,
  onOpenChange,
  selectedAssistantKey,
  onAssistantchange,
}) => {
  const { preferences, updatePreferences } = usePreferenceContext();
  const {
    assistants,
    createAssistantMutation,
    deleteAssistantMutation,
    updateAssistantMutation,
  } = useAssistantUtils();

  const searchRef = useRef<HTMLInputElement>(null);
  const [openCreateAssistant, setOpenCreateAssistant] = useState(false);
  const [updateAssistant, setUpdateAssistant] = useState<TAssistant>();

  const customAssistants = assistants?.filter((a) => a.type === 'custom');
  const baseAssistants = assistants?.filter((a) => a.type === 'base');

  useEffect(() => {
    if (open && searchRef?.current) {
      searchRef?.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    onAssistantchange(preferences.defaultAssistant);
  }, [preferences]);

  const renderAssistants = (assistants: TAssistant[]) => {
    return assistants?.map((assistant) => {
      return (
        <AssistantItem
          key={assistant.key}
          onDelete={(assistant) => {
            deleteAssistantMutation?.mutate(assistant.key, {
              onSuccess: () => {
                updatePreferences({
                  defaultAssistant: defaultPreferences.defaultAssistant,
                });
              },
            });
          }}
          onEdit={(assistant) => {
            setOpenCreateAssistant(true);
            setUpdateAssistant(assistant);
          }}
          assistant={assistant}
          onSelect={(assistant) => {
            onAssistantchange(assistant.key);
            onOpenChange(false);
          }}
        />
      );
    });
  };

  const renderEmptyState = () => {
    return (
      <Flex direction="col" items="center" justify="center" className="w-full">
        <Type size="sm" textColor="tertiary">
          No assistants found.
        </Type>
        <Button
          size="sm"
          variant="outlined"
          onClick={() => setOpenCreateAssistant(true)}
        >
          Create New
        </Button>
      </Flex>
    );
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogPortal>
          <DialogContent
            ariaTitle="Assistants"
            className="!w-[400px] rounded-xl bg-white p-0"
          >
            <Command className="relative h-full rounded-xl dark:border dark:border-white/10">
              <div className="h-12 w-full border-zinc-500/20 border-b px-2">
                <CommandInput
                  placeholder="Search assistants..."
                  className="h-12"
                  ref={searchRef}
                />
              </div>
              <CommandEmpty>{renderEmptyState()}</CommandEmpty>

              <CommandList className="!max-h-[50vh] h-full overflow-y-auto">
                {!customAssistants?.length && (
                  <AssistantBanner
                    openCreateAssistant={openCreateAssistant}
                    setOpenCreateAssistant={setOpenCreateAssistant}
                  />
                )}
                <CommandGroup className="w-full px-2.5">
                  {!!customAssistants?.length && (
                    <AssistantHeader
                      openCreateAssistant={openCreateAssistant}
                      setOpenCreateAssistant={setOpenCreateAssistant}
                    />
                  )}
                  <Flex direction="col" className="w-full">
                    {renderAssistants(customAssistants)}
                  </Flex>
                </CommandGroup>

                <CommandGroup>
                  <Flex direction="col" className="w-full px-2.5">
                    <Type
                      weight="medium"
                      size="sm"
                      className="w-full px-2 py-2"
                    >
                      Models
                    </Type>
                    {renderAssistants(baseAssistants)}
                  </Flex>
                </CommandGroup>
              </CommandList>
            </Command>
          </DialogContent>
        </DialogPortal>
      </Dialog>
      <Dialog
        modal={true}
        open={openCreateAssistant}
        onOpenChange={setOpenCreateAssistant}
      >
        <DialogPortal>
          <DialogOverlay className="fixed inset-0 z-[600] bg-zinc-500/70 backdrop-blur-sm dark:bg-zinc-900/70" />
          <DialogContent
            ariaTitle="Create Assistant"
            onInteractOutside={(e) => {
              e.preventDefault();
            }}
            className={cn(
              'z-[605] mx-auto flex max-h-[550px] flex-col items-center p-0 outline-none',
              `w-full md:w-[540px]`
            )}
          >
            <CreateAssistant
              assistant={updateAssistant}
              onUpdateAssistant={(assistant) => {
                updateAssistantMutation.mutate(
                  {
                    assistantKey: assistant.key,
                    newAssistant: assistant,
                  },
                  {
                    onSettled: () => {
                      setOpenCreateAssistant(false);
                      setUpdateAssistant(undefined);
                    },
                  }
                );
              }}
              onCreateAssistant={(assistant) => {
                createAssistantMutation.mutate(assistant, {
                  onSettled: () => {
                    setOpenCreateAssistant(false);
                  },
                  onError: (error) => {
                    // Log this error
                  },
                });
              }}
              onCancel={() => {
                setOpenCreateAssistant(false);
                setUpdateAssistant(undefined);
              }}
            />
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </>
  );
};
