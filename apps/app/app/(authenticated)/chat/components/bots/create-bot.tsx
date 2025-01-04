import { BotAvatar } from '@/app/(authenticated)/chat/components/bot-avatar';
import { ModelSelect } from '@/app/(authenticated)/chat/components/model-select';
import type { TBot } from '@/app/hooks/use-bots';
import { convertFileToBase64 } from '@/app/lib/helper';
import { ArrowLeft, Plus } from '@phosphor-icons/react';
import { Button } from '@repo/design-system/components/ui/button';
import { ComingSoon } from '@repo/design-system/components/ui/coming-soon';
import { FormLabel } from '@repo/design-system/components/ui/form-label';
import { Input } from '@repo/design-system/components/ui/input';
import { Textarea } from '@repo/design-system/components/ui/textarea';
import { useFormik } from 'formik';
import { useEffect, useRef } from 'react';

export type TCreateBot = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateBot: (bot: Omit<TBot, 'id'>) => void;
};

export const CreateBot = ({ open, onOpenChange, onCreateBot }: TCreateBot) => {
  const botTitleRef = useRef<HTMLInputElement | null>(null);

  const formik = useFormik<Omit<TBot, 'id'>>({
    initialValues: {
      name: '',
      description: '',
      prompt: '',
      avatar: undefined,
      status: undefined,
      deafultBaseModel: 'gemini-pro',
    },
    onSubmit: (values) => {
      onCreateBot(values);
      clearBot();
      onOpenChange(false);
    },
  });

  useEffect(() => {
    botTitleRef?.current?.focus();
  }, [open]);

  const clearBot = () => {
    formik.resetForm();
  };

  const uploadFile = (file: File) => {
    convertFileToBase64(file, (base64) => {
      formik.setFieldValue('avatar', base64);
    });
  };
  return (
    <div className="relative flex h-full w-full flex-col items-start overflow-hidden">
      <div className="flex w-full flex-row items-center gap-3 border-zinc-500/20 border-b px-2 py-2">
        <Button
          size="iconSm"
          variant="ghost"
          onClick={() => {
            onOpenChange(false);
          }}
        >
          <ArrowLeft size={16} weight="bold" />
        </Button>
        <p className="font-medium text-base">Create New Bot</p>
      </div>
      <div className="no-scrollbar flex h-full w-full flex-col items-start gap-8 overflow-y-auto p-4 pb-[100px]">
        <div className="flex w-full flex-col gap-2">
          <FormLabel label="Base Model" />
          <ModelSelect
            variant="secondary"
            fullWidth
            className="h-10 w-full justify-start p-2"
            selectedModel={formik.values.deafultBaseModel}
            setSelectedModel={(model) => {
              formik.setFieldValue('deafultBaseModel', model);
            }}
          />
        </div>
        <div className="flex w-full flex-col gap-2">
          <FormLabel label="Bot Avatar" />

          <div className="flex w-full flex-row items-center justify-start gap-2">
            <BotAvatar
              name={formik.values.name}
              size="large"
              avatar={formik.values.avatar}
            />

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                document.getElementById('avatar')?.click();
              }}
            >
              Upload Avatar
            </Button>
            <input
              type="file"
              id="avatar"
              hidden
              onChange={(e) => {
                e.target.files?.[0] && uploadFile(e.target.files?.[0]);
              }}
            />
          </div>
        </div>

        <div className="flex w-full flex-col gap-2">
          <FormLabel label="Bot Name" />
          <Input
            type="text"
            name="name"
            placeholder="Bot Title"
            value={formik.values.name}
            ref={botTitleRef}
            onChange={formik.handleChange}
            className="w-full"
          />
        </div>

        <div className="flex w-full flex-col gap-2">
          <FormLabel label="Bot Bio">
            A short description of your bot. This will be displayed in the bot
          </FormLabel>
          <Textarea
            name="description"
            placeholder="This is a bot that can help you with anything."
            value={formik.values.description}
            onChange={formik.handleChange}
            className="w-full"
          />
        </div>

        <div className="flex w-full flex-col gap-2">
          <FormLabel label="Knowledge">
            Provide custom knowledge that your bot will access to inform its
            responses. Your bot will retrieve relevant sections from the
            knowledge base based on the user message. The data in the knowledge
            base may be made viewable by other users through bot responses or
            citations.
          </FormLabel>
          <Button variant="default" disabled={true} className="opacity-20">
            <Plus size={20} weight="bold" /> Add Knowledge <ComingSoon />
          </Button>
        </div>

        <div className="flex w-full flex-col gap-2">
          <FormLabel label="Greeting Message">
            The bot will send this message at the beginning of every
            conversation.
          </FormLabel>
          <Textarea
            name="greetingMessage"
            placeholder="Hello I'm a bot! Ask me anything."
            value={formik.values.greetingMessage}
            onChange={formik.handleChange}
            className="h-12 w-full"
          />
        </div>

        <div className="flex w-full flex-col gap-2">
          <FormLabel label="System Prompt">
            Assign bot a role to help users understand what the bot can do.
          </FormLabel>
          <Textarea
            name="prompt"
            placeholder="You're a helpful Assistant. Your role is to help users with their queries."
            value={formik.values.prompt}
            onChange={formik.handleChange}
            className="w-full"
          />
        </div>
      </div>
      <div className="absolute right-0 bottom-0 left-0 flex w-full flex-row items-center gap-3 border-zinc-500/20 border-t bg-white px-2 py-2 dark:bg-zinc-800">
        <Button
          size="sm"
          variant="default"
          onClick={() => {
            formik.handleSubmit();
          }}
        >
          Save
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            onOpenChange(false);
          }}
        >
          Cancel
        </Button>
        <div className="flex-1"></div>

        <Button
          size="sm"
          variant="default"
          disabled={true}
          className="opacity-20"
        >
          Publish <ComingSoon />
        </Button>
      </div>
    </div>
  );
};
