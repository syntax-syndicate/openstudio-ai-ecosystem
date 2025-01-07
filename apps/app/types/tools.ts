import type { usePreferenceContext } from '@/context';
import type { TApiKeys, TPreferences } from '@/types';
import type { ReactNode } from 'react';

export const toolKeys = ['calculator', 'web_search'];

export type TToolResponse = {
  toolName: string;
  toolLoading?: boolean;
  toolArgs?: any;
  toolResponse?: any;
  toolRenderArgs?: any;
};
export type TToolConfig = {
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
  //TODO: Later add Hugeicons props
  //   icon: FC<Omit<HugeiconsProps, "ref"> & RefAttributes<SVGSVGElement>>;
  //   smallIcon: FC<Omit<HugeiconsProps, "ref"> & RefAttributes<SVGSVGElement>>;
  icon: any;
  smallIcon: any;
};
export type TToolArg = {
  updatePreferences: ReturnType<
    typeof usePreferenceContext
  >['updatePreferences'];
  preferences: TPreferences;
  apiKeys: TApiKeys;
  sendToolResponse: (response: TToolResponse) => void;
};
export type TToolKey = (typeof toolKeys)[number];
export type IconSize = 'sm' | 'md' | 'lg';
