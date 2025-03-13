import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

import { UserAvatar } from '@/components/user-avatar';
import { trpc } from '@/trpc/client';
import { commentInsertSchema } from '@repo/backend/schema';
import { Button } from '@repo/design-system/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@repo/design-system/components/ui/form';
import { Textarea } from '@repo/design-system/components/ui/textarea';

interface CommentFormProps {
  videoId: string;
  parentId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  variant?: 'reply' | 'comment';
}

export const CommentForm = ({
  videoId,
  parentId,
  onSuccess,
  onCancel,
  variant = 'comment',
}: CommentFormProps) => {
  const utils = trpc.useUtils();
  const create = trpc.comments.create.useMutation({
    onSuccess: () => {
      utils.comments.getMany.invalidate({ videoId });
      utils.comments.getMany.invalidate({ videoId, parentId });
      form.reset();
      toast.success('Comment added');
      onSuccess?.();
    },
    onError: (error) => {
      toast.error('Something went wrong');
    },
  });

  const form = useForm<z.infer<typeof commentInsertSchema>>({
    resolver: zodResolver(commentInsertSchema.omit({ userId: true })),
    defaultValues: {
      parentId,
      videoId: videoId,
      value: '',
    },
  });

  const handleSubmit = (values: z.infer<typeof commentInsertSchema>) => {
    create.mutate(values);
  };

  const handleCancel = () => {
    form.reset();
    onCancel?.();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="group flex gap-4"
      >
        <UserAvatar
          size="lg"
          imageUrl={'/user-placeholder.svg'}
          name={'User'}
        />
        <div className="flex-1">
          <FormField
            name="value"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder={
                      variant === 'reply'
                        ? 'Reply to this comment...'
                        : 'Add a comment...'
                    }
                    className="min-h-0 resize-none overflow-hidden bg-transparent"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="mt-2 flex justify-end gap-2">
            {onCancel && (
              <Button variant="ghost" type="button" onClick={handleCancel}>
                Cancel
              </Button>
            )}
            {/* TODO: Later remove the hardcoded true */}
            <Button disabled={create.isPending || true} type="submit" size="sm">
              {variant === 'reply' ? 'Reply' : 'Comment'}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
