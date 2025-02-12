'use client';

import { Button } from '@repo/design-system/components/ui/button';
import type { ButtonProps } from '@repo/design-system/components/ui/button';
import { ArrowRightIcon } from 'lucide-react';

export const CTAButton = ({ size, ...properties }: ButtonProps) => (
  <Button size={size} {...properties} suffixIcon={ArrowRightIcon}>
    <a href="https://app.openstudio.tech">
      <span className="relative z-10">Get started for free</span>
    </a>
  </Button>
);
