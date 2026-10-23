import { stats, whyChoose } from '../../data/site';
import { SectionLabel } from '../ui/SectionLabel';
import { Reveal } from '../ui/Reveal';
import { imageSrcSet, imageUrl } from '../../lib/images';

const IMAGE = 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde';

export function WhyChooseSection() {
  return (
    <section aria-labelledby="why-heading" className="section bg-navy text-white">
      <div className="shell">
        <div className="grid gap-14 lg:grid-cols-12 lg:items-center lg:gap-16">
          <Reveal className="lg:col-span-5">
            <div className="relative">
              <div className="media aspect-[4/5]">
                <img
                  src={imageUrl(IMAGE, 1000)}
                  srcSet={imageSrcSet(IMAGE, [600, 900, 1200])}
                  sizes="(min-width: 1024px) 38vw, 90vw"
                  alt="The glazed façade of a modern residence reflecting evening light"
                  width={1000}
                  height={1250}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="absolute -bottom-6 right-0 w-52 rounded-card bg-white p-5 text-navy shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)] sm:right-6 sm:w-56">
                <p className="text-[30px] font-semibold leading-none tracking-[-0.03em]">
                  22<span className="ml-1 text-[15px] font-medium tracking-normal text-champagne">yrs</span>
                </p>
                <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
                  Of quiet advisory
                </p>
              </div>
            </div>
          </Reveal>

          <div className="lg:col-span-7">
            <Reveal delay={100}>
              <SectionLabel tone="light">Why Horizon</SectionLabel>
              <h2
                id="why-heading"
                className="mt-5 text-[clamp(1.9rem,3.6vw,3.1rem)] font-semibold leading-[1.1] tracking-[-0.025em] text-white"
              >
                An advisory practice,
                <br />
                not a listing portal.
              </h2>
              <p className="mt-5 max-w-xl text-[15.5px] leading-[1.8] text-white/60">
                We represent a small number of homes at a time so that each receives the attention
                its architecture deserves — and so that every client speaks to the same person
                throughout.
              </p>
            </Reveal>

            <ul className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2">
              {whyChoose.map((item, index) => (
                <li key={item.title}>
                  <Reveal delay={140 + index * 60}>
                    <span className="text-[10px] font-semibold tracking-[0.18em] text-champagne-soft">
                      {item.index}
                    </span>
                    <h3 className="mt-2 text-[16.5px] font-medium tracking-[-0.01em] text-white">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-[13.5px] leading-relaxed text-white/50">{item.body}</p>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-y-9 border-t border-white/10 pt-10 sm:grid-cols-4">
          {stats.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 60}>
              <div>
                <p className="text-[clamp(1.8rem,3vw,2.6rem)] font-semibold leading-none tracking-[-0.03em] text-white">
                  {stat.value}
                  <span className="ml-0.5 text-[0.5em] font-medium text-champagne">
                    {stat.suffix}
                  </span>
                </p>
                <p className="mt-3 text-[10px] font-medium uppercase tracking-[0.18em] text-white/45">
                  {stat.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
