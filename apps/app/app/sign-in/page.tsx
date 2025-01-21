import { handleAuthedState } from '@/lib/auth';
import { Link } from '@repo/design-system/components/link';
import { Logo } from '@repo/design-system/components/logo';
import { Prose } from '@repo/design-system/components/prose';

import { createMetadata } from '@repo/seo/metadata';
import type { Metadata } from 'next';
import Balancer from 'react-wrap-balancer';
import { LoginForm } from './components/form';

const title = 'Sign in';
const description = 'Sign in to your account.';

export const metadata: Metadata = createMetadata({ title, description });

const SignInPage = async () => {
  await handleAuthedState();

  return (
    <div className="grid h-screen w-screen divide-x lg:grid-cols-2">
      <div className="flex items-center justify-center">
        <div className="w-full max-w-[400px] space-y-8">
          <Logo className="mx-auto h-12 w-12" />
          <LoginForm />
          <Prose>
            <p className="text-center text-muted-foreground text-sm">
              <Balancer>
                By signing in, you agree to our{' '}
                <Link href="https://www.openstudio.tech/legal/terms">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="https://www.openstudio.tech/legal/privacy">
                  Privacy Policy
                </Link>
                .
              </Balancer>
            </p>
          </Prose>
        </div>
      </div>
      <div className="hidden h-full w-full items-start justify-center overflow-y-auto bg-background px-24 py-24 lg:flex">
        <div className="flex w-full flex-col gap-8"></div>
      </div>
    </div>
  );
};

export default SignInPage;
