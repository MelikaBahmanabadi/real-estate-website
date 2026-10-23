import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { services } from '../../data/site';
import { SectionLabel } from '../ui/SectionLabel';
import { ButtonLink } from '../ui/Button';
import { Reveal } from '../ui/Reveal';

export function ServicesSection() {
  return (
    <section aria-labelledby="services-heading" className="section bg-white">
      <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <Reveal>
              <SectionLabel>Services</SectionLabel>
              <h2 id="services-heading" className="display mt-5">
                Representation,
                <br />
                end to end.
              </h2>
              <p className="body-copy mt-6 max-w-sm">
                Six disciplines, one point of contact. We stay involved long after the
                transaction closes — because a home is not a quarterly holding.
              </p>
              <ButtonLink to="/services" variant="outline" className="mt-8" withArrow>
                All Services
              </ButtonLink>
            </Reveal>
          </div>
        </div>

        <div className="lg:col-span-8">
          <ul className="border-t border-line">
            {services.map((service, index) => (
              <li key={service.title} className="border-b border-line">
                <Reveal delay={index * 50}>
                  <Link
                    to="/services"
                    className="group flex items-start gap-4 py-6 transition-colors duration-300 sm:gap-8 sm:py-7"
                  >
                    <span className="mt-1 w-7 shrink-0 text-[11px] font-semibold tracking-[0.12em] text-champagne">
                      {service.index}
                    </span>
                    <span className="flex-1">
                      <span className="flex items-start justify-between gap-4">
                        <span className="text-[19px] font-medium leading-snug text-navy transition-colors duration-300 group-hover:text-champagne-deep sm:text-[21px]">
                          {service.title}
                        </span>
                        <ArrowUpRight
                          aria-hidden="true"
                          className="mt-1 h-4 w-4 shrink-0 text-muted/50 transition-all duration-500 ease-editorial group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-navy"
                          strokeWidth={1.6}
                        />
                      </span>
                      <span className="mt-2 block max-w-md text-[14px] leading-relaxed text-muted">
                        {service.summary}
                      </span>
                    </span>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
