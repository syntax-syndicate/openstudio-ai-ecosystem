import { AssistantItem } from '@/app/(authenticated)/chat/components/assistants/assistant-item';
import { CreateAssistant } from '@/app/(authenticated)/chat/components/assistants/create-assistant';
import { defaultPreferences } from '@/config';
import { usePreferenceContext } from '@/context';
import { useModelList } from '@/hooks';
import type { TAssistant, TAssistantType } from '@/types';
import { Button } from '@repo/design-system/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandList,
  CommandSeparator,
} from '@repo/design-system/components/ui/command';
import { CommandGroup } from '@repo/design-system/components/ui/command';
import { Flex } from '@repo/design-system/components/ui/flex';
import { Type } from '@repo/design-system/components/ui/text';
import { cn } from '@repo/design-system/lib/utils';
import { type FC, useEffect, useRef, useState } from 'react';
import { Drawer } from 'vaul';

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
  } = useModelList();
  const searchRef = useRef<HTMLInputElement>(null);
  const [openCreateAssistant, setOpenCreateAssistant] = useState(false);
  const [updateAssistant, setUpdateAssistant] = useState<TAssistant>();
  useEffect(() => {
    if (open && searchRef?.current) {
      searchRef?.current?.focus();
    }
  }, [open]);
  useEffect(() => {
    onAssistantchange(preferences.defaultAssistant);
  }, [preferences]);
  const renderAssistants = (type: TAssistantType) => {
    return assistants
      ?.filter((a) => a.type === type)
      ?.map((assistant) => {
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
  return (
    <Drawer.Root
      direction="bottom"
      shouldScaleBackground
      open={open}
      onOpenChange={onOpenChange}
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-[400] bg-zinc-500/70 backdrop-blur-sm dark:bg-zinc-900/70" />
        <Drawer.Content
          className={cn(
            'fixed right-0 bottom-0 left-0 z-[500] mx-auto mt-24 flex max-h-[430px] flex-col items-center outline-none md:bottom-4 md:left-[50%]',
            `w-full md:ml-[-200px] md:w-[400px]`
          )}
        >
          <Command className="relative rounded-2xl dark:border dark:border-white/10">
            <CommandInput
              placeholder="Search..."
              className="h-12"
              ref={searchRef}
            />
            <CommandList className="border-zinc-500/20 border-t">
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                <Flex direction="col" className="w-full p-2">
                  <Flex
                    items="start"
                    justify="between"
                    gap="lg"
                    className="w-full px-3 py-2"
                  >
                    <Flex direction="col">
                      <Type weight="medium" size="base">
                        Assistants
                      </Type>
                      <Type size="xs" textColor="tertiary">
                        Experience the advanced capabilities of AI with Custom
                        Assistants
                      </Type>
                    </Flex>
                    <Drawer.NestedRoot
                      open={openCreateAssistant}
                      onOpenChange={setOpenCreateAssistant}
                    >
                      <Drawer.Trigger asChild>
                        <Button
                          size="sm"
                          onClick={() => {
                            setOpenCreateAssistant(true);
                          }}
                        >
                          Add New
                        </Button>
                      </Drawer.Trigger>
                      <Drawer.Portal>
                        <Drawer.Overlay className="fixed inset-0 z-[600] bg-zinc-500/70 backdrop-blur-sm dark:bg-zinc-900/70" />
                        <Drawer.Content
                          className={cn(
                            'fixed right-0 bottom-0 left-0 z-[605] mx-auto mt-24 flex max-h-[450px] flex-col items-center outline-none md:bottom-6 md:left-[50%]',
                            `w-full md:ml-[-220px] md:w-[440px]`
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
                              });
                            }}
                            onCancel={() => {
                              setOpenCreateAssistant(false);
                              setUpdateAssistant(undefined);
                            }}
                          />
                        </Drawer.Content>
                      </Drawer.Portal>
                    </Drawer.NestedRoot>
                  </Flex>
                  {renderAssistants('custom')}
                </Flex>
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup>
                <Flex direction="col" className="w-full p-2">
                  <Type weight="medium" size="base" className="px-3 py-2">
                    Models
                  </Type>
                  {renderAssistants('base')}
                </Flex>
              </CommandGroup>
            </CommandList>
          </Command>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
