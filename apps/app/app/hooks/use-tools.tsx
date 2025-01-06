import { usePreferenceContext, useSettingsContext } from '@/app/context';
import { dalleTool } from '@/app/tools/dalle';
import { duckduckGoTool } from '@/app/tools/duckduckgo';
import { googleSearchTool } from '@/app/tools/google';
import { memoryTool } from '@/app/tools/memory';
import {
  BrainIcon,
  GlobalSearchIcon,
  Image01Icon,
} from '@hugeicons/react';
import type { FC, ReactNode, RefAttributes } from 'react';
import type { TApiKeys, TPreferences, TToolResponse } from '.';

export const toolKeys = ['calculator', 'web_search'];

export type TToolResponseArgs = {
  toolName: string;
  toolArgs: any;
  toolResult: any;
};

export type TToolArg = {
  preferences: TPreferences;
  apiKeys: TApiKeys;
  sendToolResponse: (response: TToolResponse) => void;
};

export type TToolKey = (typeof toolKeys)[number];
export type IconSize = 'sm' | 'md' | 'lg';
export type TTool = {
  key: TToolKey;
  description: string;
  name: string;
  loadingMessage?: string;
  resultMessage?: string;
  isBeta?: boolean;
  renderUI?: (args: any) => ReactNode;
  showInMenu?: boolean;
  validate?: () => Promise<boolean>;
  validationFailedAction?: () => void;
  tool: (args: TToolArg) => any;
  //TODO: add hugeiconsprops type
  icon: any;
  smallIcon: any;
};

export const useTools = () => {
  const { preferences, apiKeys } = usePreferenceContext();
  const { open } = useSettingsContext();

  const tools: TTool[] = [
    {
      key: 'web_search',
      description: 'Search on web',
      tool:
        preferences?.defaultWebSearchEngine === 'google'
          ? googleSearchTool
          : duckduckGoTool,
      name: 'Web Search',
      isBeta: true,
      showInMenu: true,
      validate: async () => {
        if (
          preferences?.defaultWebSearchEngine === 'google' &&
          (!preferences?.googleSearchApiKey ||
            !preferences?.googleSearchEngineId)
        ) {
          return false;
        }
        return true;
      },
      validationFailedAction: () => {
        open('web-search');
      },
      loadingMessage:
        preferences?.defaultWebSearchEngine === 'google'
          ? 'Searching on Google...'
          : 'Searching on DuckDuckGo...',
      resultMessage:
        preferences?.defaultWebSearchEngine === 'google'
          ? 'Results from Google search'
          : 'Result from DuckDuckGo search',
      icon: GlobalSearchIcon,
      smallIcon: GlobalSearchIcon,
    },
    {
      key: 'image_generation',
      description: 'Generate images',
      tool: dalleTool,
      name: 'Image Generation',
      isBeta: true,
      showInMenu: true,
      validate: async () => {
        return true;
      },
      validationFailedAction: () => {
        open('web-search');
      },
      renderUI: ({ image }) => {
        return (
          <img
            src={image}
            alt=""
            className="h-[400px] w-[400px] rounded-2xl border"
          />
        );
      },
      loadingMessage: 'Generating Image ...',
      resultMessage: 'Generated Image',
      icon: Image01Icon,
      smallIcon: Image01Icon,
    },
    {
      key: 'memory',
      description: 'AI will remeber things about you',
      tool: memoryTool,
      name: 'Memory',
      isBeta: true,
      showInMenu: true,
      validate: async () => {
        return true;
      },
      validationFailedAction: () => {
        open('web-search');
      },
      renderUI: ({ image }) => {
        return (
          <img
            src={image}
            alt=""
            className="h-[400px] w-[400px] rounded-2xl border"
          />
        );
      },
      loadingMessage: 'Saving to the memory...',
      resultMessage: 'Updated memory',
      icon: BrainIcon,
      smallIcon: BrainIcon,
    },
  ];

  const getToolByKey = (key: TToolKey) => {
    return tools.find((tool) => tool.key.includes(key));
  };

  const getToolInfoByKey = (key: TToolKey) => {
    return tools.find((tool) => tool.key.includes(key));
  };
  return {
    tools,
    getToolByKey,
    getToolInfoByKey,
  };
};
