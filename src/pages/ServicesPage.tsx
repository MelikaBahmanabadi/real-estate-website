import { PageMasthead } from '../components/ui/PageMasthead';
import { CtaSection } from '../components/sections/CtaSection';
import { Reveal } from '../components/ui/Reveal';
import { SectionLabel } from '../components/ui/SectionLabel';
import { ButtonLink } from '../components/ui/Button';
import { usePageTitle } from '../hooks';
import { processSteps, services } from '../data/site';

export default function ServicesPage() {
  usePageTitle('Services');

  return (
    <>
      <PageMasthead
        label="Services"
        title="Everything a significant home requires."
        intro="Acquisition, sale, marketing, valuation and the quieter work in between — delivered by one senior advisor and a small, specialised team."
      />

      <section aria-labelledby="service-list-heading" className="section bg-white">
        <div className="shell">
          <h2 id="service-list-heading" className="sr-only">
            Our services
          </h2>
          <ul className="border-t border-line">
            {services.map((service, index) => (
              <li key={service.title} className="border-b border-line">
                <Reveal delay={index * 40}>
                  <div className="grid gap-4 py-8 sm:grid-cols-12 sm:gap-8 sm:py-10">
                    <div className="sm:col-span-1">
                      <span className="text-[11px] font-semibold tracking-[0.12em] text-champagne">
                        {service.index}
                      </span>
                    </div>
                    <div className="sm:col-span-4">
                      <h3 className="text-[21px] font-medium leading-snug text-navy sm:text-[24px]">
                        {service.title}
                      </h3>
                    </div>
                    <div className="sm:col-span-7">
                      <p className="text-[15px] leading-[1.7] text-navy/75">{service.summary}</p>
                      <p className="mt-2.5 max-w-xl text-[14px] leading-relaxed text-muted">
                        {service.detail}
                      </p>
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="process-heading" className="section border-t border-line bg-ivory">
        <div className="shell">
          <Reveal className="max-w-xl">
            <SectionLabel>How we work</SectionLabel>
            <h2 id="process-heading" className="display mt-4">
              Four steps, no noise.
            </h2>
          </Reveal>

          <ol className="mt-11 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
            {processSteps.map((step, index) => (
              <Reveal key={step.index} delay={index * 70}>
                <li className="border-t border-navy/15 pt-5">
                  <span className="text-[10px] font-semibold tracking-[0.18em] text-champagne-deep">
                    {step.index}
                  </span>
                  <h3 className="mt-2.5 text-[17px] font-medium text-navy">{step.title}</h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-muted">{step.body}</p>
                </li>
              </Reveal>
            ))}
          </ol>

          <Reveal delay={120}>
            <div className="mt-12 flex flex-wrap items-center gap-4">
              <ButtonLink to="/contact" withArrow>
                Start a Conversation
              </ButtonLink>
              <ButtonLink to="/properties" variant="outline">
                View the Portfolio
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
