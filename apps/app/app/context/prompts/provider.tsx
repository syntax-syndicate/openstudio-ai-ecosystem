'use client';
import { PromptsContext } from '@/app/context/prompts/context';
import { type TPrompt, usePrompts } from '@/app/hooks/use-prompts';
import {
  ArrowLeft,
  BookBookmark,
  FolderSimple,
  Plus,
} from '@phosphor-icons/react';
import { Badge } from '@repo/design-system/components/ui/badge';
import { Button } from '@repo/design-system/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
} from '@repo/design-system/components/ui/command';
import { CommandList } from '@repo/design-system/components/ui/command';
import {
  Dialog,
  DialogContent,
} from '@repo/design-system/components/ui/dialog';
import { Input } from '@repo/design-system/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import Document from '@tiptap/extension-document';
import HardBreak from '@tiptap/extension-hard-break';
import Highlight from '@tiptap/extension-highlight';
import Paragraph from '@tiptap/extension-paragraph';
import Placeholder from '@tiptap/extension-placeholder';
import Text from '@tiptap/extension-text';
import { EditorContent, useEditor } from '@tiptap/react';
import axios from 'axios';
import { useEffect, useState } from 'react';

export type TPromptsProvider = {
  children: React.ReactNode;
};
export type TPromptMenuItem = {
  name: string;
  key: string;
  icon: () => React.ReactNode;
  component: React.ReactNode;
};
export const PromptsProvider = ({ children }: TPromptsProvider) => {
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [showCreatePrompt, setShowCreatePrompt] = useState(false);
  const [localPrompts, setLocalPrompts] = useState<TPrompt[]>([]);
  const [promptTitle, setPromptTitle] = useState('');
  const [showLocalPrompts, setShowLocalPrompts] = useState(false);
  const { setPrompt, getPrompts } = usePrompts();
  useEffect(() => {
    getPrompts().then((prompts) => {
      setLocalPrompts(prompts);
    });
  }, [showCreatePrompt]);
  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      Placeholder.configure({
        placeholder: 'Enter prompt here...',
      }),
      HardBreak,
      Highlight.configure({
        HTMLAttributes: {
          class: 'prompt-highlight',
        },
      }),
    ],
    content: ``,
    autofocus: true,
    onTransaction(props) {
      const { editor } = props;
      const text = editor.getText();
      const html = editor.getHTML();
      console.log(text);
      const newHTML = html.replace(
        /{{{{(.*?)}}}}/g,
        ` <mark class="prompt-highlight">$1</mark> `
      );
      if (newHTML !== html) {
        editor.commands.setContent(newHTML, true, {
          preserveWhitespace: true,
        });
      }
    },
    parseOptions: {
      preserveWhitespace: true,
    },
  });
  const clearPrompt = () => {
    setPromptTitle('');
    editor?.commands.setContent('');
  };
  const query = useQuery<{ prompts: TPrompt[] }>({
    queryKey: ['prompts'],
    queryFn: async () => axios.get('/api/prompts').then((res) => res.data),
  });
  const open = (key?: string) => {
    setIsPromptOpen(true);
  };
  const savePrompt = async () => {
    const content = editor?.getText();
    if (!content) {
      return;
    }
    await setPrompt({ name: promptTitle, content });
    clearPrompt();
    setShowCreatePrompt(false);
    setShowLocalPrompts(true);
  };
  const dismiss = () => setIsPromptOpen(false);
  const renderCreatePrompt = () => {
    return (
      <div className="flex w-full flex-col items-start">
        <div className="flex w-full flex-row items-center gap-3 border-zinc-500/20 border-b px-2 py-2">
          <Button
            size="iconSm"
            variant="ghost"
            onClick={() => {
              setShowCreatePrompt(false);
            }}
          >
            <ArrowLeft size={16} weight="bold" />
          </Button>
          <p className="font-medium text-base">Create New Prompt</p>
        </div>
        <div className="flex w-full flex-1 flex-col p-2">
          <Input
            type="text"
            placeholder="Prompt Title"
            variant="ghost"
            value={promptTitle}
            onChange={(e) => setPromptTitle(e.target.value)}
            className="w-full bg-transparent"
          />
          <EditorContent
            editor={editor}
            autoFocus
            className="no-scrollbar [&>*]:no-scrollbar wysiwyg h-full min-h-24 w-full cursor-text p-3 text-sm outline-none focus:outline-none md:text-base [&>*]:leading-7 [&>*]:outline-none"
          />
          <p className="flex flex-row items-center gap-2 px-3 py-2 text-xs text-zinc-500">
            Use <Badge>{`{{{{ input }}}}`}</Badge> for user input
          </p>
        </div>
        <div className="flex w-full flex-row items-center gap-3 border-zinc-500/20 border-t px-2 py-2">
          <Button
            size="sm"
            variant="default"
            onClick={() => {
              savePrompt();
            }}
          >
            Save
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setShowCreatePrompt(false);
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  };
  return (
    <PromptsContext.Provider value={{ open, dismiss }}>
      {children}
      <Dialog open={isPromptOpen} onOpenChange={setIsPromptOpen}>
        <DialogContent className="flex max-h-[80dvh] w-[96dvw] flex-col gap-0 overflow-hidden rounded-2xl border border-white/5 p-0 md:max-h-[600px] md:min-w-[600px]">
          {showCreatePrompt ? (
            renderCreatePrompt()
          ) : (
            <Command>
              <div className="w-full p-1">
                <CommandInput placeholder="Search Prompts" />
              </div>
              <div className="relative mt-60 flex h-full w-full flex-col border-zinc-500/20 border-t md:mt-0">
                <div className="flex w-full flex-row justify-between px-3 pt-3 pb-3">
                  <div className="flex flex-row items-center gap-2">
                    <Button
                      size="sm"
                      variant={showLocalPrompts ? 'ghost' : 'secondary'}
                      onClick={() => {
                        setShowLocalPrompts(false);
                      }}
                    >
                      <BookBookmark size={16} weight="bold" /> Prompt Library
                    </Button>
                    <Button
                      size="sm"
                      variant={showLocalPrompts ? 'secondary' : 'ghost'}
                      onClick={() => {
                        setShowLocalPrompts(true);
                      }}
                    >
                      <FolderSimple size={16} weight="bold" /> Your prompts
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => {
                      setShowCreatePrompt(true);
                    }}
                  >
                    <Plus size={16} weight="bold" /> Create Prompt
                  </Button>
                </div>
                <CommandEmpty className="flex w-full flex-col items-center justify-center gap-2 p-4 text-sm text-zinc-500">
                  No prompts found{' '}
                  <Button variant="outline" size="sm">
                    Create new prompt
                  </Button>
                </CommandEmpty>
                <CommandList className="px-2 py-2">
                  {(showLocalPrompts
                    ? localPrompts
                    : query?.data?.prompts
                  )?.map((prompt) => (
                    <CommandItem
                      value={prompt.name}
                      key={prompt.id}
                      className="w-full"
                    >
                      <div className="flex w-full flex-col items-start gap-0 py-2">
                        <p className="font-medium text-base">{prompt.name}</p>
                        <p className="w-full overflow-hidden truncate whitespace-nowrap text-xs text-zinc-500">
                          {prompt.content}
                        </p>
                      </div>
                    </CommandItem>
                  ))}
                </CommandList>
              </div>
            </Command>
          )}
        </DialogContent>
      </Dialog>
    </PromptsContext.Provider>
  );
};
