'use client';
import { Container } from '@repo/design-system/components/container';
import HeroVideoDialog from '@repo/design-system/components/ui/hero-video-dialog';
import { cn } from '@repo/design-system/lib/utils';
import { LazyMotion, domAnimation, m } from 'motion/react';
import { Suspense } from 'react';
import type { ComponentProps } from 'react';

type DemoVideoProperties = ComponentProps<'section'> & {
  readonly latestUpdate: string | undefined;
};

export function DemoVideo({ className, ...properties }: DemoVideoProperties) {
  return (
    <section className={cn('overflow-hidden', className)} {...properties}>
      <LazyMotion features={domAnimation}>
        <Container className="border-x p-4 text-center">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 md:grid-cols-2">
            <div className="relative flex flex-col items-center">
              <m.div
                className="aspect-video w-full"
                variants={{
                  hidden: { opacity: 0, y: -10 },
                  show: { opacity: 1, y: 0, transition: { type: 'spring' } },
                }}
              >
                <Suspense fallback={<div>Loading...</div>}>
                  <HeroVideoDialog
                    videoSrc="https://www.youtube.com/embed/KCd_bdnJ1SE?si=OFifw8bgZqwRKIxY"
                    className="h-full w-full rounded-xl border shadow-2xl"
                    animationStyle="top-in-bottom-out"
                    thumbnailSrc="/home/chathub.png"
                  />
                </Suspense>
              </m.div>
              <h3 className="mt-6 font-semibold text-2xl">
                Open Studio ChatHub
              </h3>
            </div>

            <div className="relative flex flex-col items-center">
              <m.div
                className="aspect-video w-full"
                variants={{
                  hidden: { opacity: 0, y: -10 },
                  show: { opacity: 1, y: 0, transition: { type: 'spring' } },
                }}
              >
                <Suspense fallback={<div>Loading...</div>}>
                  <HeroVideoDialog
                    videoSrc="https://www.youtube.com/embed/Z_2XLXBjqzI?si=h_EFo1To8Qogzx8u"
                    className="h-full w-full rounded-xl border shadow-2xl"
                    animationStyle="top-in-bottom-out"
                    thumbnailSrc="/home/tube.webp"
                  />
                </Suspense>
              </m.div>
              <h3 className="mt-6 font-semibold text-2xl">Open Studio Tube</h3>
            </div>
          </div>
        </Container>
      </LazyMotion>
    </section>
  );
}
