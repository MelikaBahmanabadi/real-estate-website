import { Mail, Phone } from 'lucide-react';
import { team } from '../../data/site';
import { formatPhoneHref } from '../../lib/format';
import { imageSrcSet, imageUrl } from '../../lib/images';
import { SectionLabel } from '../ui/SectionLabel';
import { ButtonLink } from '../ui/Button';
import { Reveal } from '../ui/Reveal';

export function TeamSection({ showCta = true }: { showCta?: boolean }) {
  return (
    <section aria-labelledby="team-heading" className="section bg-white">
      <div className="shell">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <Reveal>
            <SectionLabel>Our Team</SectionLabel>
            <h2 id="team-heading" className="display mt-4">
              The advisors
            </h2>
          </Reveal>
          <Reveal delay={80}>
            <p className="max-w-sm text-[15px] leading-[1.75] text-muted">
              A small, senior team. The advisor you meet is the advisor who negotiates, closes and
              remains your point of contact for years afterwards.
            </p>
          </Reveal>
        </div>

        <div className="mt-11 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-8">
          {team.map((member, index) => (
            <Reveal key={member.name} delay={index * 70}>
              <article className="group">
                <div className="media media-zoom aspect-[3/4]">
                  <img
                    src={imageUrl(member.image, 700)}
                    srcSet={imageSrcSet(member.image, [400, 600, 800])}
                    sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw"
                    alt={`Portrait of ${member.name}, ${member.role}`}
                    width={700}
                    height={933}
                    loading="lazy"
                    decoding="async"
                    className="grayscale-[35%] transition-all duration-[1200ms] ease-editorial group-hover:grayscale-0"
                  />
                </div>

                <div className="mt-5 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-[17px] font-medium tracking-[-0.01em] text-navy">
                      {member.name}
                    </h3>
                    <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-champagne-deep">
                      {member.role}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-1.5 transition-opacity duration-300 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100">
                    <a
                      href={`mailto:${member.email}`}
                      aria-label={`Email ${member.name}`}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-navy/15 text-navy transition-colors duration-300 hover:border-navy hover:bg-navy hover:text-white"
                    >
                      <Mail aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={1.6} />
                    </a>
                    <a
                      href={formatPhoneHref(member.phone)}
                      aria-label={`Call ${member.name}`}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-navy/15 text-navy transition-colors duration-300 hover:border-navy hover:bg-navy hover:text-white"
                    >
                      <Phone aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={1.6} />
                    </a>
                  </div>
                </div>

                <p className="mt-3 text-[13px] leading-relaxed text-muted">{member.bio}</p>
              </article>
            </Reveal>
          ))}
        </div>

        {showCta ? (
          <div className="mt-12 flex justify-center">
            <ButtonLink to="/team" variant="outline" withArrow>
              Meet the Team
            </ButtonLink>
          </div>
        ) : null}
      </div>
    </section>
  );
}
