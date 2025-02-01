'use client';
import { subscribeSchema } from '@/helper/validator';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@repo/design-system/components/minime/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/design-system/components/ui/dialog';
import { Icons } from '@repo/design-system/components/ui/icons';
import { Input } from '@repo/design-system/components/ui/input';
import { toast } from '@repo/design-system/hooks/use-toast';
import { cn } from '@repo/design-system/lib/utils';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import type * as z from 'zod';

type FormData = z.infer<typeof subscribeSchema>;

// const feeds = [
//   {
//     type: 'rss',
//     title: 'RSS',
//     href: '/feed',
//   },
//   {
//     type: 'atom',
//     title: 'Atom',
//     href: '/feed?type=atom',
//   },
// ] as const;

export default function Subscribe({
  newsletter = false,
  username,
  compact = false,
}: {
  username: string;
  compact?: boolean;
  newsletter: boolean;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, startTransition] = useTransition();
  const [showSubscribeForm, setShowSubscribeForm] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(subscribeSchema),
  });

  const onSubmit = async (data: FormData) => {
    startTransition(async () => {
      const res = await fetch('/api/subscribers', {
        method: 'POST',
        body: JSON.stringify({
          email: data.email,
          name: data.name,
          username,
        }),
      });

      if (res.ok) {
        setIsOpen(false);
        reset();
        toast({
          title: 'You are now subscribed',
        });
      } else {
        const text = await res.text();
        toast({
          title: 'Something went wrong',
          description: text,
        });
      }
    });
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant={compact ? 'secondary' : 'default'}
          size={compact ? 'icon' : 'sm'}
        >
          {compact ? <Icons.rss size={15} /> : 'Subscribe'}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="items-center">Subscribe</DialogTitle>
        </DialogHeader>
        <div className="flex justify-between gap-2">
          {/* {feeds.map((feed) => (
            <NavButton
              href={feed.href}
              buttonVariant="secondary"
              iconSize={18}
              size="wide"
              className="w-full"
              buttonClassname="h-16 text-base"
              direction="ltr"
              icon="rss"
              key={feed.type}
            >
              {feed.title}
            </NavButton>
          ))} */}
          {newsletter && (
            <Button
              variant="secondary"
              className={cn(
                'h-16 w-full',
                showSubscribeForm && 'bg-gray-2 text-secondary'
              )}
              onClick={() => setShowSubscribeForm((prev) => !prev)}
            >
              <Icons.mail size={18} />
              Email
            </Button>
          )}
        </div>
        {newsletter && showSubscribeForm && (
          <>
            <form
              id="subscribe-newsletter"
              className="flex flex-col gap-2"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Input
                type="text"
                placeholder="Enter your name"
                disabled={isLoading}
                {...register('name')}
              />
              {errors.name && (
                <p className="font-bold text-danger text-xs">
                  {errors.name.message}
                </p>
              )}
              <Input
                type="email"
                placeholder="Enter your email"
                disabled={isLoading}
                {...register('email')}
              />
              {errors.email && (
                <p className="font-bold text-danger text-xs">
                  {errors.email.message}
                </p>
              )}
            </form>

            <DialogFooter>
              <Button
                disabled={isLoading}
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button
                disabled={isLoading}
                size="sm"
                form="subscribe-newsletter"
              >
                {isLoading && (
                  <Icons.spinner size={18} className="animate-spin" />
                )}
                Subscribe
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
