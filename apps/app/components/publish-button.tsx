import { trpc } from '@/trpc/client';
import { Tick01Icon } from '@hugeicons-pro/core-stroke-rounded';
import { HugeiconsIcon } from '@hugeicons/react';
import { Button } from '@repo/design-system/components/ui/button';
import { AnimatedSocialIcons } from '@repo/design-system/components/ui/floating-action-button';
import {
  FloatingButton,
  FloatingButtonItem,
} from '@repo/design-system/components/ui/floating-button';
import { cn } from '@repo/design-system/lib/utils';
import { Loader2Icon, YoutubeIcon } from 'lucide-react';
import { Github, Instagram, Linkedin, Twitter } from 'lucide-react';
import { toast } from 'sonner';

export function Demo() {
  const socialIcons = [
    {
      Icon: Github,
      href: 'https://github.com',
      className: 'hover:bg-accent',
    },
    {
      Icon: Twitter,
      href: 'https://twitter.com',
    },
    {
      Icon: Linkedin,
      href: 'https://linkedin.com',
    },
    {
      Icon: Instagram,
      href: 'https://instagram.com',
    },
  ];

  return (
    <main className="flex items-start justify-center bg-background md:items-center">
      <AnimatedSocialIcons icons={socialIcons} iconSize={20} />
    </main>
  );
}

function PublishToSocialMediaPlatforms({ videoId }: { videoId: string }) {
  const items = [
    // {
    //   key: 'facebook',
    //   icon: <FacebookIcon />,
    //   bgColor: 'bg-[#1877f2]',
    //   disabled: true,
    // },
    // {
    //   key: 'whatsapp',
    //   icon: <WhatsappIcon />,
    //   bgColor: 'bg-[#25d366]',
    //   disabled: true,
    // },
    // {
    //   key: 'instagram',
    //   icon: <InstagramIcon />,
    //   bgColor: 'bg-[#e1306c]',
    //   disabled: true,
    // },
    // {
    //   key: 'linkedin',
    //   icon: <LinkedinIcon />,
    //   bgColor: 'bg-[#0a66c2]',
    //   disabled: true,
    // },
    // {
    //   key: 'twitter',
    //   icon: <TwitterIcon />,
    //   bgColor: 'bg-[#1da1f2]',
    //   disabled: true,
    // },
    {
      key: 'youtube',
      icon: <YoutubeIcon />,
      bgColor: 'bg-[#ff0000]',
      disabled: false,
      onClick: () => {
        uploadToYoutube.mutate({ videoId: videoId });
      },
    },
  ];

  const uploadToYoutube = trpc.youtube.upload.useMutation({
    onSuccess: () => {
      toast.success('Video uploaded');
    },
    onError: (e) => {
      toast.error('Something went wrong', {
        description: e.message,
      });
    },
  });

  return (
    <FloatingButton
      triggerContent={
        <Button
          variant={'secondary'}
          className="z-10 flex h-12 w-12 items-center justify-center rounded-full"
        >
          {uploadToYoutube.isPending ? (
            <Loader2Icon className="animate-spin" />
          ) : (
            <HugeiconsIcon icon={Tick01Icon} />
          )}
        </Button>
      }
    >
      {items.map((item, key) => (
        <FloatingButtonItem key={item.key}>
          <Button
            variant={'secondary'}
            disabled={item.disabled}
            onClick={item.onClick ? () => item.onClick() : undefined}
            className={cn(
              'flex h-12 w-12 items-center justify-center rounded-full text-white/80',
              item.bgColor,
              item.disabled && 'cursor-not-allowed opacity-50'
            )}
          >
            {item.icon}
          </Button>
        </FloatingButtonItem>
      ))}
    </FloatingButton>
  );
}

export { PublishToSocialMediaPlatforms };
