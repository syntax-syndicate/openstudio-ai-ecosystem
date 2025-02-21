import { handleAuthedState } from '@/lib/auth';
import { Logo } from '@repo/design-system/components/logo';
import { createMetadata } from '@repo/seo/metadata';
import type { Metadata } from 'next';
import { SignupForm } from './components/form';
import { BuilderVision } from '@/components/builder-vision';
import { Prose } from '@repo/design-system/components/prose';
import { Balancer } from 'react-wrap-balancer';
import Link from 'next/link';

const title = 'Sign Up';
const description = 'Sign up to your account';

export const metadata: Metadata = createMetadata({
  title,
  description,
});

const SignUpPage = async () => {
  await handleAuthedState();

  return (
    <div className="grid h-screen w-screen lg:grid-cols-2">
      <div className="flex items-center justify-center">
        <div className="w-full max-w-[400px] space-y-8">
          <Logo className="mx-auto h-12 w-12" />
          <SignupForm />
          <Prose>
            <p className="text-center text-muted-foreground text-sm">
              <Balancer>
                By signing in, you agree to our{' '}
                <Link href="https://www.openstudio.tech/legal/terms" className='text-white'>
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="https://www.openstudio.tech/legal/privacy" className='text-white'>
                  Privacy Policy
                </Link>
                .
              </Balancer>
            </p>
          </Prose>
        </div>
      </div>
      <div className="hidden h-full w-full items-start justify-center overflow-y-auto bg-background px-24 py-24 lg:flex">
        <div className="flex w-full flex-col gap-8">
          <BuilderVision />
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
