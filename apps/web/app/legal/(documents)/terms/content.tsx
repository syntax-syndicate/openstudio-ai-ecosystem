'use client';

import { LegalPage } from '@/app/components/LegalPage';
import Content from './content.mdx';

export default function TermsContent() {
  return (
    <LegalPage
      date="2025-02-11"
      title="Terms of Service"
      content={<Content />}
    />
  );
}
