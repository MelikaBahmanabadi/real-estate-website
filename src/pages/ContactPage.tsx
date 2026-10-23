import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { PageMasthead } from '../components/ui/PageMasthead';
import { InquiryForm } from '../components/forms/InquiryForm';
import { SectionLabel } from '../components/ui/SectionLabel';
import { site } from '../data/site';
import { formatPhoneHref } from '../lib/format';
import { imageSrcSet, imageUrl } from '../lib/images';
import { usePageTitle } from '../hooks';

const OFFICE_IMAGE = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab';

export default function ContactPage() {
  usePageTitle('Contact');

  return (
    <>
      <PageMasthead
        label="Contact"
        title="Let’s talk about the right home."
        intro="Whether you are buying, selling or simply weighing a decision, a conversation costs nothing. An advisor will respond within one business day."
      />

      <section aria-labelledby="enquiry-heading" className="section bg-white">
        <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <SectionLabel>Enquiry</SectionLabel>
            <h2 id="enquiry-heading" className="display mt-4 text-[clamp(1.7rem,2.8vw,2.4rem)]">
              Send us a message
            </h2>
            <p className="body-copy mt-4 max-w-md">
              Share a little about what you are looking for. All enquiries are handled in
              confidence.
            </p>
            <div className="mt-8 max-w-xl">
              <InquiryForm kind="contact" />
            </div>
          </div>

          <aside className="lg:col-span-5">
            <div className="rounded-card border border-line bg-ivory p-6 sm:p-8">
              <h2 className="text-[11px] font-semibold uppercase tracking-label text-champagne-deep">
                Direct lines
              </h2>
              <ul className="mt-6 space-y-6">
                <li className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-navy">
                    <Phone aria-hidden="true" className="h-4 w-4" strokeWidth={1.6} />
                  </span>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
                      Telephone
                    </p>
                    <a
                      href={formatPhoneHref(site.phone)}
                      className="mt-1 inline-flex min-h-8 items-center text-[15px] text-navy transition-colors hover:text-champagne-deep"
                    >
                      {site.phone}
                    </a>
                    <br />
                    <a
                      href={formatPhoneHref(site.phoneAlt)}
                      className="inline-flex min-h-8 items-center text-[15px] text-navy transition-colors hover:text-champagne-deep"
                    >
                      {site.phoneAlt}
                    </a>
                  </div>
                </li>

                <li className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-navy">
                    <Mail aria-hidden="true" className="h-4 w-4" strokeWidth={1.6} />
                  </span>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
                      Email
                    </p>
                    <a
                      href={`mailto:${site.email}`}
                      className="mt-1 inline-flex min-h-8 items-center text-[15px] text-navy transition-colors hover:text-champagne-deep"
                    >
                      {site.email}
                    </a>
                  </div>
                </li>

                <li className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-navy">
                    <MapPin aria-hidden="true" className="h-4 w-4" strokeWidth={1.6} />
                  </span>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
                      Office
                    </p>
                    <p className="mt-1 text-[15px] leading-relaxed text-navy">
                      {site.address.line1}
                      <br />
                      {site.address.line2}
                    </p>
                  </div>
                </li>

                <li className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-navy">
                    <Clock aria-hidden="true" className="h-4 w-4" strokeWidth={1.6} />
                  </span>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
                      Hours
                    </p>
                    {site.hours.map((entry) => (
                      <p key={entry.days} className="mt-1 flex flex-wrap gap-x-2 text-[14px] text-navy">
                        <span className="text-muted">{entry.days}</span>
                        <span>{entry.time}</span>
                      </p>
                    ))}
                  </div>
                </li>
              </ul>
            </div>

            <p className="mt-6 text-[13px] leading-relaxed text-muted">
              Prefer a private introduction? Ask your advisor about the properties we hold
              off-market.
            </p>
          </aside>
        </div>
      </section>

      <section aria-label="Our office" className="shell pb-20 sm:pb-24">
        <div className="media aspect-[21/9] sm:aspect-[21/7]">
          <img
            src={imageUrl(OFFICE_IMAGE, 1600)}
            srcSet={imageSrcSet(OFFICE_IMAGE, [800, 1200, 1600])}
            sizes="(min-width: 1400px) 1400px, 100vw"
            alt="The Horizon Properties office building in Austin"
            width={1600}
            height={640}
            loading="lazy"
            decoding="async"
          />
          <span className="absolute bottom-4 left-4 rounded-[2px] bg-navy/70 px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm sm:bottom-6 sm:left-6">
            Westlake Avenue · Austin
          </span>
        </div>
      </section>
    </>
  );
}
