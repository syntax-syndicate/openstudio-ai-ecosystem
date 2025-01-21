import { ExplainationCard } from '@/app/(organization)/chat/components/welcome-message/explaination-card';

export const PrivacyCopy = () => {
  return (
    <>
      Built for trust.{' '}
      <a
        href="/chat/privacy" //TODO: add redirect privacy link to our web app later
        className="cursor-pointer underline decoration-zinc-500/50 underline-offset-4"
      >
        Privacy at its core
      </a>
      . Your chats stay local, your data stays yours – always.{' '}
      <ExplainationCard explanation="Your data never leaves your device - everything is stored in your browser's built-in database (IndexDB)">
        <a
          href="/chat/privacy"
          className="cursor-pointer underline decoration-zinc-500/50 underline-offset-4"
        >
          locally
        </a>
      </ExplainationCard>{' '}
      and deleteable anytime.
    </>
  );
};
