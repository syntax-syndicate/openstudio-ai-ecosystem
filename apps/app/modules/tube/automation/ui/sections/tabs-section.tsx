'use client';

import { OnboardingModal } from '@/components/onboarding-modal';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsToolbar,
  TabsTrigger,
} from '@repo/design-system/components/ui/tabs';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { RulesPrompt } from '../components/rules-prompt';

export const AutomationTabsSection = () => {
  return (
    <Suspense fallback={<AutomationTabsSectionSkeleton />}>
      <ErrorBoundary fallback={<div>Error</div>}>
        <AutomationTabsSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

const AutomationTabsSectionSkeleton = () => {
  return <div>Loading...</div>;
};

const AutomationTabsSectionSuspense = () => {
  return (
    <Tabs defaultValue="prompt">
      <TabsToolbar>
        <div className="w-full overflow-x-auto">
          <TabsList>
            <TabsTrigger value="prompt">Prompt</TabsTrigger>
            <TabsTrigger value="rules">Rules</TabsTrigger>
            <TabsTrigger value="test">Test</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
          </TabsList>
        </div>

        <OnboardingModal
          title="How to get started with your Personal AI Assistant"
          description={
            <p>
              Watch the video below to learn how to get started with your
              Personal AI Assistant to automatically handle your Youtube Channel
              Comments to begin with.
            </p>
          }
          videoId="Z_2XLXBjqzI"
        />
      </TabsToolbar>

      <TabsContent value="prompt" className="px-2 sm:px-6">
        <RulesPrompt />
      </TabsContent>
      <TabsContent value="rules" className="px-2 sm:px-6">
        Rules
      </TabsContent>
      <TabsContent value="test" className="px-2 sm:px-6">
        Test
      </TabsContent>
      <TabsContent value="history" className="px-2 sm:px-6">
        History
      </TabsContent>
      <TabsContent value="pending" className="px-2 sm:px-6">
        Pending
      </TabsContent>
    </Tabs>
  );
};
