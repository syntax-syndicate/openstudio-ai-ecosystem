import type { Metadata } from 'next';
import PrivacyContent from './content';

const title = 'Privacy Policy - Open Studio';
const description = 'Privacy Policy - Open Studio';

export const metadata: Metadata = {
  title,
  description,
};

export default function Page() {
  return <PrivacyContent />;
}
