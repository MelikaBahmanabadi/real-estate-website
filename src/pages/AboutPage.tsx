import { PageMasthead } from '../components/ui/PageMasthead';
import { AboutSection } from '../components/sections/AboutSection';
import { CtaSection } from '../components/sections/CtaSection';
import { Reveal } from '../components/ui/Reveal';
import { SectionLabel } from '../components/ui/SectionLabel';
import { usePageTitle } from '../hooks';
import { values } from '../data/site';

export default function AboutPage() {
  usePageTitle('About Us');

  return (
    <>
      <PageMasthead
        label="About Us"
        title="A quiet practice, built on architecture."
        intro="Horizon Properties was founded on a simple conviction: significant homes deserve representation as considered as their design. We work with a limited number of clients each year, and we stay involved long after the sale."
      />

      <AboutSection heading="Who We Are" />

      <section aria-labelledby="principles-heading" className="section border-t border-line bg-ivory">
        <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-4">
            <SectionLabel>Principles</SectionLabel>
            <h2 id="principles-heading" className="display mt-4">
              What we
              <br />
              hold to.
            </h2>
            <p className="body-copy mt-5 max-w-sm">
              Four commitments that shape every listing we accept and every offer we negotiate.
            </p>
          </Reveal>

          <div className="grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:col-span-8">
            {values.map((value, index) => (
              <Reveal key={value.title} delay={index * 70}>
                <div className="border-t border-line pt-5">
                  <p className="text-[10px] font-semibold tracking-[0.18em] text-champagne">
                    0{index + 1}
                  </p>
                  <h3 className="mt-2 text-[18px] font-medium text-navy">{value.title}</h3>
                  <p className="mt-2 max-w-xs text-[14px] leading-relaxed text-muted">{value.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-navy py-16 text-center sm:py-20">
        <div className="shell">
          <blockquote className="mx-auto max-w-3xl">
            <p className="text-[clamp(1.35rem,2.8vw,2.1rem)] font-medium leading-[1.45] tracking-[-0.02em] text-white">
              “The best homes are never sold — they are placed with the right people. Our work is
              to know both well enough to make that introduction.”
            </p>
            <footer className="mt-6 text-[10.5px] font-semibold uppercase tracking-[0.22em] text-champagne-soft">
              Daniel Morgan · Managing Director
            </footer>
          </blockquote>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
