import { ImageDropzone } from '@/app/(authenticated)/chat/components/chat-input/image-dropzone';
import type { FC } from 'react';
import type { DropzoneState } from 'react-dropzone';

export type IImageDropzoneRootProps = {
  children: React.ReactNode;
  dropzoneProps: DropzoneState;
};

export const ImageDropzoneRoot: FC<IImageDropzoneRootProps> = ({
  children,
  dropzoneProps,
}) => {
  return (
    <div
      className="relative flex w-full flex-col items-start gap-0"
      {...dropzoneProps.getRootProps()}
    >
      {children}
      <ImageDropzone dropzonProps={dropzoneProps} />
    </div>
  );
};
