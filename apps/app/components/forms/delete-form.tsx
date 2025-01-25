'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { createClient } from '@repo/backend/auth/client';
import { Button } from '@repo/design-system/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/design-system/components/ui/dialog';
import { Icons } from '@repo/design-system/components/ui/icons';
import { Input } from '@repo/design-system/components/ui/input';
import { toast } from '@repo/design-system/components/ui/use-toast';
import { handleError } from '@repo/design-system/lib/handle-error';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
export default function DeleteForm({
  type,
  title,
  description,
  endpoint,
  keyword,
  redirectPath = '/',
}: {
  type?: 'user';
  title: string;
  description?: string;
  endpoint: string;
  keyword: string;
  redirectPath?: string;
}) {
  const deleteFormSchema = z.object({
    keyword: z.string().refine((value) => value === keyword),
  });

  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [isDeleting, startTransition] = useTransition();
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
  } = useForm<z.infer<typeof deleteFormSchema>>({
    resolver: zodResolver(deleteFormSchema),
  });

  const handleSignOut = async () => {
    try {
      const client = await createClient();
      const response = await client.auth.signOut();

      if (response.error) {
        throw response.error;
      }

      router.push('/sign-in');
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div className="overflow-hidden rounded-md border border-danger">
      <div className="flex flex-col gap-1 p-4">
        <h1>{title}</h1>
        <p className="text-gray-4 text-sm">
          This action is not reversible, so please continue with caution.
        </p>
      </div>
      <footer className="flex h-auto flex-row items-center justify-end border-danger border-t px-4 py-2">
        <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
          <DialogTrigger asChild>
            <Button variant="destructive" size="sm">
              Delete
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader className="flex flex-col items-start">
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>
                {description} <b>{keyword}</b> to continue:
              </DialogDescription>
            </DialogHeader>

            <form
              id="delete-form"
              onSubmit={handleSubmit(async () => {
                startTransition(async () => {
                  const res = await fetch(`/api${endpoint}`, {
                    method: 'DELETE',
                  });
                  if (res.ok) {
                    setShowDeleteModal(false);
                    toast({
                      title: 'Deleted',
                    });
                    if (type && type === 'user') {
                      return handleSignOut();
                    }
                    router.push(redirectPath);
                    router.refresh();
                  } else {
                    const err = await res.text();
                    toast({
                      title: 'Something went wrong',
                      description: err,
                    });
                  }
                });
              })}
            >
              <Input
                type="text"
                placeholder="type here.."
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                {...register('keyword')}
              />
              {errors.keyword && (
                <b className="text-danger text-xs">{errors.keyword.message}</b>
              )}
            </form>
            <DialogFooter>
              <Button
                size="sm"
                title="Cancel"
                variant="ghost"
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
              />
              <Button
                disabled={!isValid || isDeleting}
                form="delete-form"
                size="sm"
                variant="destructive"
              >
                {isDeleting ? (
                  <>
                    <Icons.spinner size={18} className="animate-spin" />{' '}
                    Deleting
                  </>
                ) : (
                  <>Delete</>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </footer>
    </div>
  );
}
