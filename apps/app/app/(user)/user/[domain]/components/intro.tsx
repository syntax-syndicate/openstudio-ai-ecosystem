import type { User } from '@repo/backend/auth';
import Subscribe from '../articles/components/subscribe';
import CommandMenuToggle from './toggle';

export default function Intro({
  user,
}: {
  user: Pick<User, 'user_metadata'>;
}) {
  return (
    <dl className="section-container mb-6 flex-row items-center justify-between">
      <dt className="section-title flex-col items-start">
        <h1 className="text-lg">{user.user_metadata.username}</h1>
        <h2 className="text-gray-4 text-sm">{user.user_metadata.title}</h2>
      </dt>
      <dd className="section-content flex-row gap-2 py-0">
        <CommandMenuToggle />
        <Subscribe
          username={user.user_metadata.username}
          newsletter={user.user_metadata.newsletter}
          compact
        />
      </dd>
    </dl>
  );
}
