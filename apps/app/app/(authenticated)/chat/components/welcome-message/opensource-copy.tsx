import { useFeedback } from '@/app/(authenticated)/chat/components/feedback/use-feedback';
import Image from 'next/image';

export const OpenSourceCopy = () => {
  const linkClass =
    'underline decoration-zinc-500/50 underline-offset-4 cursor-pointer';
  const { renderModal, setOpen: openFeedback } = useFeedback();
  return (
    <>
      We&apos;re evolving at lightning speed with our open-source journey.
      Discover{' '}
      <a
        href="https://github.com/kuluruvineeth/openstudio-beta"
        className={linkClass}
      >
        our vision ahead
      </a>{' '}
      or{' '}
      <p className={linkClass} onClick={() => openFeedback(true)}>
        <Image
          src="/icons/handdrawn_love.svg"
          width={16}
          height={16}
          alt="Love icon"
          className="mx-1 inline-block dark:invert"
        />{' '}
        share your insights
      </p>
      {renderModal()}
    </>
  );
};
