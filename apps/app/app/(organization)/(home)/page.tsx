import { currentUser } from '@repo/backend/auth/utils';
import { Prose } from '@repo/design-system/components/prose';
import type { Metadata } from 'next';
import { Greeting } from './components/greeting';

export const metadata: Metadata = {
  title: 'Home',
  description: 'The homepage for your organization.',
};

const Home = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }
  return (
    <Prose className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-6 py-16">
      <div className="space-y-2">
        <Greeting firstName={user.user_metadata?.first_name} />
        <p>
          Welcome to Open Studio (Never Complete) - An E-Commerce of Apps or App
          of Apps - A Gateway to AI Powered Applications.
        </p>
      </div>
    </Prose>
  );
};

export default Home;
