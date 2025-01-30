import { currentUser } from '@repo/backend/auth/utils';
import { Prose } from '@repo/design-system/components/prose';
import type { Metadata } from 'next';
import MDX from '../minime/components/markdown/mdx';
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
        <MDX
          source={`Welcome to Open Studio (Never Complete) - Open for scope and flexibility Let's keep it this way for now.
          - First App - ChatHub (a drop of open studio's oceantic vision) - Nothing new Just explore for now with DeepSeek R1
          - Second App Coming Up Soon - MiniMe - A simple way to present your professional profile with your own simple website (default to username.openstudio.co.in - option to configure your own domain) (About, Articles (with newsletter subscription), Projects, etc) 
          - Many more apps coming soon - Rapidly iterating on the apps and features
          - Planning to add all of projects: (https://www.youtube.com/@kuluruvineeth)
          - What do you guys think?
          - Really value your feedback🙏
          - Open issues for new features, existing bugs or anything you really want it to be part of : (https://github.com/kuluruvineeth/openstudio-beta)`}
        />
      </div>
    </Prose>
  );
};

export default Home;
