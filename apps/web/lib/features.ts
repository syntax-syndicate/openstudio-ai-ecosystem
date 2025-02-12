import {
  ClockIcon,
} from 'lucide-react';

export type Feature = {
  icon: typeof ClockIcon;
  name: string;
  href: string;
  description: string;
  formerly: string;
  short: string;
};

export const features: Record<string, Feature> = {
  
};

// export const integrations: Feature = {
  
// };
