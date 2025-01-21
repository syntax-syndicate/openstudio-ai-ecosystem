import { ExplainationCard } from '@/app/(organization)/chat/components/welcome-message/explaination-card';
import { AiImageIcon, BrainIcon, Globe02Icon } from '@hugeicons/react';
import { StaggerContainer } from '@repo/design-system/components/ui/stagger-container';
import { cn } from '@repo/design-system/lib/utils';

type PluginItemProps = {
  icon: any;
  text: string;
  color: string;
  explanation: string;
  initialRotate: 1 | -3 | -1;
  hoverRotate: -5 | 6 | 3;
};

const PluginItem = ({
  icon: Icon,
  text,
  color,
  explanation,
  initialRotate,
  hoverRotate,
}: PluginItemProps) => {
  return (
    <ExplainationCard explanation={explanation}>
      <div
        className={cn(
          'mx-1 flex flex-row items-center gap-1 rounded-full border border-zinc-500/20 bg-white px-2 py-0.5 font-medium text-sm shadow-sm md:px-2 md:py-1 dark:bg-zinc-800',
          'transition-all duration-300 ease-in-out',
          'transition-transform hover:z-10 hover:scale-105',

          {
            '!text-purple-500 dark:!text-purple-400': color === 'purple',
            '!text-blue-500 dark:!text-blue-400': color === 'blue',
            '!text-rose-400 dark:!text-rose-300': color === 'rose',
          },
          {
            'rotate-1': initialRotate === 1,
            '-rotate-3': initialRotate === -3,
            '-rotate-1': initialRotate === -1,
          },
          {
            'hover:-rotate-5': hoverRotate === -5,
            'hover:rotate-6': hoverRotate === 6,
            'hover:rotate-3': hoverRotate === 3,
          }
        )}
      >
        <Icon size={14} strokeWidth={2} />
        {text}
      </div>
    </ExplainationCard>
  );
};

export const PluginCopy = () => {
  return (
    <StaggerContainer>
      Boost your productivity with advanced plugins and customized{' '}
      <PluginItem
        icon={BrainIcon}
        text="memory"
        explanation="Adaptive memory system that learns from every interaction to provide increasingly personalized assistance."
        color="purple"
        initialRotate={1}
        hoverRotate={6}
      />
      : from{' '}
      <PluginItem
        icon={Globe02Icon}
        text="web search"
        explanation="Navigate the internet's vast resources to find precise, relevant information instantly."
        color="blue"
        initialRotate={-1}
        hoverRotate={-5}
      />{' '}
      to{' '}
      <PluginItem
        icon={AiImageIcon}
        text="image generation"
        explanation="Create stunning visuals with AI-powered image generation, tailored to your specifications."
        color="rose"
        initialRotate={1}
        hoverRotate={3}
      />
      , crafted to your exact specifications.
    </StaggerContainer>
  );
};
