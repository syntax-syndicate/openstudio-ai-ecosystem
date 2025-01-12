'use client';
import { configs } from '@/config';
import {
  AiMagicIcon,
  Github01Icon,
  NewTwitterEllipseIcon,
  NewTwitterIcon,
} from '@hugeicons/react';
import { Button } from '@repo/design-system/components/ui';
import { Flex } from '@repo/design-system/components/ui/flex';
import { Type } from '@repo/design-system/components/ui/text';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { push } = useRouter();
  return (
    <main className="relative flex min-h-screen w-screen flex-col items-center justify-start gap-2 pt-[10vh]">
      <Flex direction="col" items="center" gap="md" className="">
        <Button variant="accent" size="sm" rounded="full">
          <NewTwitterIcon size={20} variant="solid" />
          Follow us on X
        </Button>
        <Flex
          direction="col"
          items="center"
          className="!text-[3rem] md:!text-[6rem] text-center font-semibold leading-[1.1] tracking-[-0.03em]"
        >
          <span className="opacity-50">Open Studio</span>
          <span className="flex items-center opacity-100">
            <AiMagicIcon className="h-10 w-10 md:h-16 md:w-16" variant="bulk" />{' '}
            ChatHub
          </span>
        </Flex>
        <Type className="!text-base md:!text-lg max-w-[400px] text-center font-medium opacity-60">
          App of Apps - Your gateway to AI-Powered Applications
        </Type>
      </Flex>
      <Button size="lg" className="mt-4 mb-8" onClick={() => push('/chat')}>
        Get Started
      </Button>

      <video
        src={configs.heroVideo}
        autoPlay
        loop
        muted
        className="w-[70vw] rounded-xl object-cover"
      />
      <Flex
        direction="col"
        className="mt-8 w-full p-4"
        gap="none"
        items="center"
      >
        <Flex gap="sm" items="center">
          <Button size="iconSm" variant="ghost">
            <Github01Icon size={20} variant="solid" />
          </Button>
          <Button size="iconSm" variant="ghost">
            <NewTwitterEllipseIcon size={20} variant="solid" />
          </Button>
        </Flex>
        <Flex gap="sm" items="center">
          <Type size="xs" textColor="tertiary">
            © 2025 kuluruvineeth
          </Type>
        </Flex>
      </Flex>
    </main>
  );
}
