import { KeyRound } from 'lucide-react';
import { ButtonLink } from '../ui/Button';
import { Reveal } from '../ui/Reveal';

export function CtaSection() {
  return (
    <section aria-labelledby="cta-heading" className="pb-20 pt-4 sm:pb-24 lg:pb-32">
      <div className="shell">
        <Reveal>
          <div className="flex flex-col gap-8 rounded-[12px] border border-line bg-ivory px-6 py-10 sm:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-14 lg:py-12">
            <div className="flex items-start gap-6">
              <span
                aria-hidden="true"
                className="hidden h-16 w-16 shrink-0 items-center justify-center rounded-full bg-navy text-champagne sm:flex"
              >
                <KeyRound className="h-6 w-6" strokeWidth={1.4} />
              </span>
              <div>
                <h2
                  id="cta-heading"
                  className="text-[clamp(1.45rem,2.6vw,2.15rem)] font-semibold leading-[1.2] tracking-[-0.02em] text-navy"
                >
                  Ready to Find Your Perfect Property?
                </h2>
                <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muted">
                  Let our experts guide you to the right home or investment.
                </p>
              </div>
            </div>

            <ButtonLink to="/contact" className="shrink-0" withArrow>
              Get In Touch
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
