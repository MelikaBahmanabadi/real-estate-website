import { imageSrcSet, imageUrl } from '../../lib/images';

const HERO_IMAGE = 'https://images.unsplash.com/photo-1613490493576-7fde63acd811';

export function Hero() {
  return (
    <section
      aria-label="Horizon Properties introduction"
      className="relative isolate flex h-[min(100svh,940px)] min-h-[640px] w-full items-center overflow-hidden bg-navy"
    >
      <img
        src={imageUrl(HERO_IMAGE, 2000)}
        srcSet={imageSrcSet(HERO_IMAGE, [800, 1200, 1600, 2000, 2400])}
        sizes="100vw"
        alt="A modern glass villa with an infinity pool at blue hour"
        width={2000}
        height={1250}
        decoding="async"
        className="absolute inset-0 -z-20 h-full w-full animate-hero-zoom object-cover object-[50%_58%]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-b from-navy/65 via-navy/25 to-navy/70"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-navy/10" />

      <div className="shell relative w-full pb-[6vh] pt-[calc(var(--header-height)+48px)] text-center">
        <h1 className="mx-auto max-w-5xl animate-fade-up text-[clamp(1.95rem,6.1vw,5.5rem)] font-semibold leading-[1.04] tracking-[-0.03em] text-white [animation-delay:120ms]">
          Discover Exceptional
          <br className="hidden sm:block" /> Homes &amp; Investments
        </h1>

        <p className="mx-auto mt-6 max-w-xl animate-fade-up text-[15px] leading-[1.75] text-white/85 [animation-delay:300ms] sm:mt-7 sm:text-[17px]">
          Premium properties in prime locations. Find your dream home or the perfect investment
          with confidence.
        </p>
      </div>

      <div className="absolute inset-x-0 bottom-7 hidden flex-col items-center gap-3 sm:flex">
        <span className="text-[9.5px] font-medium uppercase tracking-[0.36em] text-white/55">
          Scroll
        </span>
        <span aria-hidden="true" className="h-10 w-px bg-gradient-to-b from-white/50 to-white/0" />
      </div>
    </section>
  );
}
