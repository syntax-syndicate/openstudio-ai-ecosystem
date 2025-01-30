import { handleAuthedState } from '@/lib/auth';
import { Logo } from '@repo/design-system/components/logo';
import { createMetadata } from '@repo/seo/metadata';
import type { Metadata } from 'next';
import { SignupForm } from './components/form';

const title = 'Sign Up';
const description = 'Sign up to your account';

export const metadata: Metadata = createMetadata({
  title,
  description,
});

const SignUpPage = async () => {
  await handleAuthedState();

  return (
    <div className="grid h-screen w-screen divide-x lg:grid-cols-2">
      <div className="flex items-center justify-center">
        <div className="w-full max-w-[400px] space-y-8">
          <Logo className="mx-auto h-12 w-12" />
          <SignupForm />
          {/* <Prose>
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
          </Prose> */}
        </div>
      </div>
      <div className="hidden h-full w-full items-start justify-center overflow-hidden bg-background lg:flex">
        <div className="-m-12 columns-3"></div>
      </div>
    </div>
  );
};

export default SignUpPage;
