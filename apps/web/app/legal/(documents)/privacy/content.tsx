'use client';

import { LegalPage } from '@/app/components/LegalPage';
import Content from './content.mdx';

export default function PrivacyContent() {
  return (
    <LegalPage date="2025-02-20" title="Privacy Policy" content={<Content />} />
  );
}
