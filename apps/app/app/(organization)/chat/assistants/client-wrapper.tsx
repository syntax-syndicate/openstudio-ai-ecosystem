'use client';

import { AssistantCard } from '@/app/(organization)/chat/components/assistants/assistant-card';
import { CreateAssistant } from '@/app/(organization)/chat/components/assistants/create-assistant';
import { TopNav } from '@/app/(organization)/chat/components/layout/top-nav';
import { useSessions } from '@/context/sessions';
import { useAssistantUtils } from '@/hooks';
import type { TCustomAssistant } from '@repo/backend/types';
import { Button } from '@repo/design-system/components/ui/button';
import { Flex } from '@repo/design-system/components/ui/flex';
import { Type } from '@repo/design-system/components/ui/text';
import { useQuery } from '@tanstack/react-query';
import { PlusIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const AssistantClientWrapper = () => {
  const { push } = useRouter();
  const { assistantsQuery, removeAssistantMutation } = useAssistantUtils();
  const { addAssistantToSessionMutation, createSession } = useSessions();
  const [openCreateAssistant, setOpenCreateAssistant] = useState(false);

  const remoteAssistantsQuery = useQuery({
    queryKey: ['remote-assistants'],
    queryFn: () => fetch('/api/assistants').then((res) => res.json()),
  });

  const localAssistants = assistantsQuery.data || [];
  const remoteAssistants = remoteAssistantsQuery.data?.assistants || [];

  const handleAddToChat = (assistant: TCustomAssistant) => {
    addAssistantToSessionMutation.mutate(assistant, {
      onSuccess: () => {
        createSession().then(() => {
          push('/chat');
        });
      },
    });
  };

  const handleDelete = (key: string) => {
    removeAssistantMutation.mutate(key);
  };

  const renderAssistantList = (
    assistants: TCustomAssistant[],
    canDelete: boolean
  ) => (
    <div className="grid w-full grid-cols-2 gap-3 px-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {assistants.map((assistant) => (
        <AssistantCard
          key={assistant.key}
          assistant={assistant}
          canDelete={canDelete}
          onAddToChat={handleAddToChat}
          onDelete={handleDelete}
        />
      ))}
      {assistants.length === 0 && (
        <div className="col-span-full flex items-center justify-center rounded-lg bg-zinc-500/5 p-2">
          <Type textColor="tertiary">No assistants yet</Type>
        </div>
      )}
    </div>
  );

  return (
    <>
      <TopNav title="AI Assistants" showBackButton />

      <Flex direction="col" className="w-full">
        <Flex
          direction="row"
          items="center"
          justify="between"
          className="w-full px-6 py-3"
        >
          <Type size="base" weight="medium">
            Your Assistants
          </Type>
          <Button
            size="sm"
            variant="bordered"
            onClick={() => setOpenCreateAssistant(true)}
          >
            <PlusIcon size={16} />
            Create assistant
          </Button>
        </Flex>

        {renderAssistantList(localAssistants, true)}
      </Flex>

      {remoteAssistants?.length > 0 && (
        <Flex direction="col" className="mt-4 w-full">
          <Type size="base" weight="medium" className="px-6 py-3">
            Explore More
          </Type>
          {renderAssistantList(remoteAssistants, false)}
        </Flex>
      )}

      <CreateAssistant
        open={openCreateAssistant}
        onOpenChange={setOpenCreateAssistant}
      />
    </>
  );
};

export default AssistantClientWrapper;
