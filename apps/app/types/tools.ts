import type { TModelItem } from '@/types';
import type { DynamicStructuredTool } from '@langchain/core/tools';
import type { ReactNode } from 'react';

export const toolKeys = ['calculator', 'web_search'];

export type ToolExecutionFunction = (
  args: ToolExecutionContext
) => DynamicStructuredTool;

export type ToolExecutionContext = {
  apiKeys: Record<string, string>;
  updateToolExecutionState: (state: ToolExecutionState) => void;
  preferences: Record<string, any>;
  updatePreferences?: (preferences: Record<string, any>) => void;
  model: TModelItem;
};

export type ToolExecutionState = {
  toolName: string;
  executionArgs: Record<string, any>;
  renderData?: Record<string, any>;
  executionResult?: any;
  isLoading: boolean;
};

export type ToolValidationContext = {
  apiKeys: Record<string, string>;
  preferences: Record<string, any>;
};

export type ToolDefinition = {
  key: ToolKey;
  description: string;
  displayName: string;
  executionFunction: ToolExecutionFunction;
  loadingMessage?: string;
  successMessage?: string;
  isBeta?: boolean;
  isEnforced?: boolean;
  renderComponent?: (args: any) => ReactNode;
  isVisibleInMenu?: boolean;
  validateAvailability?: (context: ToolValidationContext) => Promise<boolean>;
  onValidationFailed?: () => void;
  //TODO: Add these back in
  // icon: FC<Omit<HugeiconsProps, "ref"> & RefAttributes<SVGSVGElement>>;
  // compactIcon: FC<Omit<HugeiconsProps, "ref"> & RefAttributes<SVGSVGElement>>;
  icon: any;
  compactIcon: any;
};

export type ToolKey = (typeof toolKeys)[number];
export type IconSize = 'sm' | 'md' | 'lg';
