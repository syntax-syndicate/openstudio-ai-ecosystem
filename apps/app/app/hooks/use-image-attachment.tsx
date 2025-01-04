import type { TAttachment } from '@/app/(authenticated)/chat/components/chat-input';
import { ArrowElbowDownRight, Paperclip, X } from '@phosphor-icons/react';
import { Button } from '@repo/design-system/components/ui/button';
import { useToast } from '@repo/design-system/components/ui/use-toast';
import Image from 'next/image';
import { type ChangeEvent, useState } from 'react';
import Resizer from 'react-image-file-resizer';

export const useImageAttachment = () => {
  const [attachment, setAttachment] = useState<TAttachment>();
  const { toast } = useToast();
  const resizeFile = (file: File) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        1000,
        1000,
        'JPEG',
        100,
        0,
        (uri) => {
          resolve(uri);
        },
        'file'
      );
    });
  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const reader = new FileReader();
    const fileTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (file && !fileTypes.includes(file?.type)) {
      toast({
        title: 'Invalid format',
        description: 'Please select a valid image (JPEG, PNG, GIF).',
        variant: 'destructive',
      });
      return;
    }
    reader.onload = () => {
      if (typeof reader.result !== 'string') return;
      const base64String = reader?.result?.split(',')[1];
      setAttachment((prev) => ({
        ...prev,
        base64: `data:${file?.type};base64,${base64String}`,
      }));
    };
    if (file) {
      setAttachment((prev) => ({
        ...prev,
        file,
      }));
      const resizedFile = await resizeFile(file);
      reader.readAsDataURL(file);
    }
  };
  const handleFileSelect = () => {
    document.getElementById('fileInput')?.click();
  };
  const renderAttachedImage = () => {
    if (attachment?.base64 && attachment?.file) {
      return (
        <div className="flex h-10 w-full flex-row items-center justify-start gap-2 rounded-xl bg-black/30 pr-1 pl-3 text-zinc-300 md:w-[700px]">
          <ArrowElbowDownRight size={20} weight="bold" />
          <p className="relative ml-2 flex w-full flex-row items-center gap-2 text-sm md:text-base">
            <Image
              src={attachment.base64}
              alt="uploaded image"
              className="tanslate-y-[50%] absolute h-[60px] min-w-[60px] rotate-6 rounded-xl border border-white/5 object-cover shadow-md"
              width={0}
              height={0}
            />
            <span className="ml-[70px]">{attachment?.file?.name}</span>
          </p>
          <Button
            size={'iconSm'}
            variant="ghost"
            onClick={() => {}}
            className="ml-4 flex-shrink-0"
          >
            <X size={16} weight="bold" />
          </Button>
        </div>
      );
    }
  };
  const renderFileUpload = () => {
    return (
      <>
        <input
          type="file"
          id="fileInput"
          className="hidden"
          onChange={handleImageUpload}
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={handleFileSelect}
          className="px-1.5"
        >
          <Paperclip size={16} weight="bold" /> Attach
        </Button>
      </>
    );
  };
  return {
    attachment,
    handleImageUpload,
    handleFileSelect,
    renderAttachedImage,
    renderFileUpload,
  };
};
