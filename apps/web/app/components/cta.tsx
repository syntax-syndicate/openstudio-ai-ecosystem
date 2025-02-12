import { CTAButton } from '@/app/(home)/components/cta-button';
import { Container } from '@repo/design-system/components/container';
import Balancer from 'react-wrap-balancer';

export const CallToAction = () => (
  <section className="relative overflow-hidden">
    <Container className="border-x p-4">
      <div className="grid gap-4 rounded-xl border bg-background p-8 shadow-sm sm:grid-cols-2 sm:gap-8 sm:p-16">
        <h2 className="mt-0 mb-4 font-semibold text-3xl tracking-tighter sm:text-5xl">
          <Balancer>OpenStudio – The App of Apps</Balancer>
        </h2>
        <div className="flex flex-col items-start gap-4">
          <p className="text-muted-foreground sm:text-xl">
            <Balancer>
              An AI-driven ecosystem—starting with ChatHub for research and
              OpenStudio Tube for YouTube creators. Unlock more with less
              effort.
            </Balancer>
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <CTAButton size="lg" />
            {/* <Link href="/pricing">
              <Button size="lg" variant="outlined">
                See pricing
              </Button>
            </Link> */}
          </div>
        </div>
      </div>
    </Container>
  </section>
);
