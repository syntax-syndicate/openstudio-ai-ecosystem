import type { Metadata } from 'next';
import AcceptableUseContent from './content';

export const dynamic = 'force-dynamic';

const title = 'Acceptable Use Policy - Open Studio';
const description = 'Acceptable Use Policy - Open Studio';

export const metadata: Metadata = {
  title,
  description,
};

export default function Page() {
  return <AcceptableUseContent />;
}
