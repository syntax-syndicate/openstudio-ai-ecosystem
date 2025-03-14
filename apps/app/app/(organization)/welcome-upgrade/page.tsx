import { Pricing } from '@/components/billing/pricing';
import { FullPageLoader } from '@repo/design-system/components/ui/full-page-loader';
import { CheckCircleIcon } from 'lucide-react';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

export default function WelcomeUpgradePage() {
  return (
    <>
      <Suspense fallback={<FullPageLoader />}>
        <Pricing
          showSkipUpgrade
          header={
            <div className="mb-8 flex flex-col items-start">
              <div className="mx-auto text-center">
                <h2 className="font-cal text-base text-red-600 leading-7">
                  Spend 50% less time on mundane tasks
                </h2>
                <p className="mt-2 font-cal text-2xl text-gray-900 sm:text-3xl dark:text-white">
                  Join Open Studio
                  <br />
                  to be more productive!
                </p>
              </div>

              <div className="mx-auto mt-4 flex flex-col items-start gap-2">
                <TrialFeature>100% no-risk</TrialFeature>
                <TrialFeature>Get access to all apps</TrialFeature>
                <TrialFeature>Cancel anytime, hassle-free</TrialFeature>
              </div>
            </div>
          }
        />
      </Suspense>
    </>
  );
}

const TrialFeature = ({ children }: { children: React.ReactNode }) => (
  <p className="flex items-center text-gray-900 dark:text-white">
    <CheckCircleIcon className="mr-2 h-4 w-4 text-green-500" />
    {children}
  </p>
);
