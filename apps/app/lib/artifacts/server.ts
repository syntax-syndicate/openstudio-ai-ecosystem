import type { ArtifactKind } from '@/app/(organization)/artifacts/components/v2/artifact';
import { codeDocumentHandler } from '@/artifacts/code/server';
import { imageDocumentHandler } from '@/artifacts/image/server';
import { sheetDocumentHandler } from '@/artifacts/sheet/server';
import { textDocumentHandler } from '@/artifacts/text/server';
import { saveDocument } from '@/lib/queries';
import type { DataStreamWriter } from '@repo/ai';
import type { User } from '@repo/backend/auth';
import type { Document } from '@repo/backend/schema';

export interface SaveDocumentProps {
  id: string;
  title: string;
  kind: ArtifactKind;
  content: string;
  userId: string;
  organizationId: string;
}

export interface CreateDocumentCallbackProps {
  id: string;
  title: string;
  dataStream: DataStreamWriter;
  user: User;
}

export interface UpdateDocumentCallbackProps {
  document: Document;
  description: string;
  dataStream: DataStreamWriter;
  user: User;
}

export interface DocumentHandler<T = ArtifactKind> {
  kind: T;
  onCreateDocument: (props: CreateDocumentCallbackProps) => Promise<void>;
  onUpdateDocument: (props: UpdateDocumentCallbackProps) => Promise<void>;
}

export function createDocumentHandler<T extends ArtifactKind>(config: {
  kind: T;
  onCreateDocument: (props: CreateDocumentCallbackProps) => Promise<string>;
  onUpdateDocument: (props: UpdateDocumentCallbackProps) => Promise<string>;
}): DocumentHandler<T> {
  return {
    kind: config.kind,
    onCreateDocument: async (args: CreateDocumentCallbackProps) => {
      const draftContent = await config.onCreateDocument({
        id: args.id,
        title: args.title,
        dataStream: args.dataStream,
        user: args.user,
      });

      if (args.user.id) {
        await saveDocument({
          id: args.id,
          title: args.title,
          kind: config.kind,
          content: draftContent,
          userId: args.user.id,
          organizationId: args.user.user_metadata.organization_id,
        });
      }
      return;
    },
    onUpdateDocument: async (args: UpdateDocumentCallbackProps) => {
      const draftContent = await config.onUpdateDocument({
        document: args.document,
        description: args.description,
        dataStream: args.dataStream,
        user: args.user,
      });

      if (args.user.id) {
        await saveDocument({
          id: args.document.id,
          title: args.document.title,
          kind: config.kind,
          content: draftContent,
          userId: args.user.id,
          organizationId: args.user.user_metadata.organization_id,
        });
      }
      return;
    },
  };
}

/*
 * Use this array to define the document handlers for each artifact kind.
 */
export const documentHandlersByArtifactKind: Array<DocumentHandler> = [
  textDocumentHandler,
  codeDocumentHandler,
  imageDocumentHandler,
  sheetDocumentHandler,
];

export const artifactKinds = ['text', 'code', 'image', 'sheet'] as const;
