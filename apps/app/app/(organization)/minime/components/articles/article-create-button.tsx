'use client';

import { Button } from '@repo/design-system/components/ui/button';
import { Icons } from '@repo/design-system/components/ui/icons';
import { toast } from '@repo/design-system/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

export default function NewArticle() {
  const [isLoading, startTransition] = useTransition();
  const router = useRouter();
  async function onClick() {
    startTransition(async () => {
      const article = await createArticle();
      if (article) {
        router.push(`/minime/articles/${article.id}`);
        router.refresh();
      }
    });
  }

  return (
    <Button
      onClick={onClick}
      size="sm"
      variant="secondary"
      disabled={isLoading}
      aria-label="Write new Article"
    >
      {isLoading && <Icons.spinner size={15} className="animate-spin" />} New
      article
    </Button>
  );
}

export async function createArticle() {
  const res = await fetch('/api/articles', {
    method: 'POST',
    body: JSON.stringify({
      title: 'Untitled article',
      content: 'My new article',
    }),
  });

  if (!res?.ok) {
    const body = await res.text();

    toast({
      title: 'Something went wrong.',
      description: body,
    });
    return null;
  }
  return await res.json();
}
