'use client';

import { LegalPage } from '@/app/components/LegalPage';
import Content from './content.mdx';

export default function AcceptableUseContent() {
  return (
    <LegalPage
      date="2025-02-11"
      title="Acceptable Use Policy"
      content={<Content />}
    />
  );
}
