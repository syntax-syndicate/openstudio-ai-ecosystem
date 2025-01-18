import { AssistantItem } from '@/app/(authenticated)/chat/components/assistants/assistant-item';
import { CreateAssistant } from '@/app/(authenticated)/chat/components/assistants/create-assistant';
import { defaultPreferences } from '@/config';
import { usePreferenceContext } from '@/context';
import { useAssistantUtils } from '@/hooks';
import type { TAssistant } from '@/types';
import { Button } from '@repo/design-system/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandList,
} from '@repo/design-system/components/ui/command';
import { CommandGroup } from '@repo/design-system/components/ui/command';
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
} from '@repo/design-system/components/ui/dialog';
import { Flex } from '@repo/design-system/components/ui/flex';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@repo/design-system/components/ui/popover';
import { Type } from '@repo/design-system/components/ui/text';
import { cn } from '@repo/design-system/lib/utils';
import { ChevronDown, Plus } from 'lucide-react';
import { type FC, useEffect, useRef, useState } from 'react';

export type TAssitantModal = {
  selectedAssistantKey: string;
  onAssistantchange: (assistantKey: string) => void;
};
export const AssistantModal: FC<TAssitantModal> = ({
  selectedAssistantKey,
  onAssistantchange,
}) => {
  const { getAssistantByKey, getAssistantIcon } = useAssistantUtils();
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

  const selectedAssistant = getAssistantByKey(selectedAssistantKey);

  // useEffect(() => {
  //   if (open && searchRef?.current) {
  //     searchRef?.current?.focus();
  //   }
  // }, [open]);

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
            // onOpenChange(false);
          }}
        />
      );
    });
  };

  const renderEmptyState = () => {
    return (
      <Flex
        direction="col"
        items="center"
        justify="center"
        className="w-full px-4"
        gap="md"
      >
        <Type size="sm" textColor="tertiary">
          No assistants found.
        </Type>
        <Button
          size="sm"
          variant="outlined"
          onClick={() => setOpenCreateAssistant(true)}
        >
          Create Custom Assistant
        </Button>
      </Flex>
    );
  };

  const [activeTab, setActiveTab] = useState<'assistants' | 'models'>('models');

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="bordered" size="sm" className="gap-1 pr-3 pl-1.5">
            {selectedAssistant?.assistant?.key &&
              getAssistantIcon(selectedAssistant?.assistant?.key, 'sm')}
            {selectedAssistant?.assistant?.name}
            <ChevronDown size={14} strokeWidth="2" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="mr-8 w-[380px] rounded-xl p-0 dark:bg-zinc-700"
          side="bottom"
          align="start"
        >
          <Command className="relative h-full max-h-[450px] overflow-hidden rounded-xl dark:bg-zinc-700">
            <div className="h-11 w-full border-zinc-500/20 border-b px-2">
              <CommandInput
                placeholder="Search assistants..."
                className="h-11"
                ref={searchRef}
              />
            </div>

            <Flex className="px-3 py-2" gap="xs">
              <Button
                variant={activeTab === 'models' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('models')}
              >
                Models
              </Button>
              <Button
                variant={activeTab === 'assistants' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('assistants')}
              >
                Assistants
              </Button>
            </Flex>

            <CommandEmpty>{renderEmptyState()}</CommandEmpty>

            <CommandList className="!max-h-[50vh] h-full overflow-y-auto pb-2">
              {activeTab === 'assistants' && (
                <CommandGroup className="w-full px-2.5">
                  {!!customAssistants?.length && (
                    <Flex direction="col" className="w-full p-2">
                      <Button
                        size="sm"
                        className="w-full"
                        variant="outlined"
                        onClick={() => setOpenCreateAssistant(true)}
                      >
                        <Plus size={14} strokeWidth="2" /> Create Custom
                        Assistant
                      </Button>
                    </Flex>
                  )}
                  <Flex direction="col" className="w-full">
                    {renderAssistants(customAssistants)}
                  </Flex>
                </CommandGroup>
              )}

              {activeTab === 'models' && (
                <CommandGroup>
                  <Flex direction="col" className="w-full px-2.5">
                    {renderAssistants(baseAssistants)}
                  </Flex>
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <Dialog
        modal={true}
        open={openCreateAssistant}
        onOpenChange={setOpenCreateAssistant}
      >
        <DialogPortal>
          <DialogOverlay className="fixed inset-0 z-[600] bg-zinc-500/50 dark:bg-zinc-900/50" />
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
