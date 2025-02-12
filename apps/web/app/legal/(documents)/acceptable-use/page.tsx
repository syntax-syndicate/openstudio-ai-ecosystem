import type { Metadata } from 'next';
import AcceptableUseContent from './content';

const title = 'Acceptable Use Policy - Open Studio';
const description = 'Acceptable Use Policy - Open Studio';

export const metadata: Metadata = {
  title,
  description,
};

export default function Page() {
  return <AcceptableUseContent />;
}
