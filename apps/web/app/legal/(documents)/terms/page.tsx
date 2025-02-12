import type { Metadata } from 'next';
import TermsContent from './content';

const title = 'Terms of Service - Open Studio';
const description = 'Terms of Service - Open Studio';

export const metadata: Metadata = {
  title,
  description,
};

export default function Page() {
  return <TermsContent />;
}
