import { showBetaFeature } from '@repo/feature-flags';
import { createMetadata } from '@repo/seo/metadata';
import type { Metadata } from 'next';
import { DemoVideo } from './components/demo-video';
import { Hero } from './components/hero';

export const dynamic = 'force-dynamic';

const meta = {
  title: 'An Evolving Open-Source AI Ecosystem',
  description:
    'OpenStudio is an evolving AI ecosystem—start with ChatHub for research and conversations, then leverage verticalized agents like OpenStudio Tube to get the work done for YouTube.',
};

export const metadata: Metadata = createMetadata(meta);

const Home = async () => {
  const betaFeature = await showBetaFeature();

  return (
    <>
      <Hero id="hero" latestUpdate={undefined} />
      <DemoVideo latestUpdate={undefined} />
    </>
  );
};

export default Home;
