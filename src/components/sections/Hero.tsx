import { useCallback, useRef } from 'react';
import { imageSrcSet, imageUrl } from '../../lib/images';
import { usePrefersReducedMotion } from '../../hooks';
import { useScrollScrubVideo } from '../../hooks/useScrollScrubVideo';

const HERO_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1613490493576-7fde63acd811';
const HERO_POSTER = '/hero/horizon-hero-poster.jpg';
const VIDEO_SOURCES = {
  desktop: '/hero/horizon-hero-desktop.mp4',
  mobile: '/hero/horizon-hero-mobile.mp4',
};

/** Scroll distance of the pinned hero: one viewport to read, two to travel. */
const SCRUB_HEIGHT_CLASS = 'h-[300vh]';

export function Hero() {
  const reducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);

  // Called inside the scrub loop — write styles directly, never through state.
  const handleProgress = useCallback((progress: number) => {
    const fade = Math.min(1, Math.max(0, (progress - 0.01) / 0.16));
    const text = textRef.current;
    if (text) {
      text.style.opacity = (1 - fade).toFixed(3);
      text.style.transform = `translate3d(0, ${(-24 * fade).toFixed(2)}px, 0)`;
    }
    const cue = cueRef.current;
    if (cue) cue.style.opacity = (1 - Math.min(1, progress / 0.05)).toFixed(3);
  }, []);

  const { videoRef, status, loadProgress } = useScrollScrubVideo({
    sectionRef,
    sources: VIDEO_SOURCES,
    enabled: !reducedMotion,
    onProgress: handleProgress,
  });

  const usesVideo = !reducedMotion;
  const loading = usesVideo && status === 'loading';
  const showFallback = !usesVideo || status === 'error';

  return (
    <section
      ref={sectionRef}
      aria-label="Horizon Properties introduction"
      className={`relative w-full bg-navy ${usesVideo ? SCRUB_HEIGHT_CLASS : ''}`}
    >
      <div
        className={`isolate flex w-full items-center overflow-hidden bg-navy ${
          usesVideo
            ? 'sticky top-0 h-[100svh]'
            : 'relative h-[min(100svh,940px)] min-h-[640px]'
        }`}
      >
        {showFallback ? (
          <img
            src={imageUrl(HERO_FALLBACK_IMAGE, 2000)}
            srcSet={imageSrcSet(HERO_FALLBACK_IMAGE, [800, 1200, 1600, 2000, 2400])}
            sizes="100vw"
            alt="A modern glass villa with an infinity pool at blue hour"
            width={2000}
            height={1250}
            decoding="async"
            className="absolute inset-0 -z-20 h-full w-full animate-hero-zoom object-cover object-[50%_58%]"
          />
        ) : (
          <>
            <img
              src={HERO_POSTER}
              alt=""
              aria-hidden="true"
              className={`absolute inset-0 -z-20 h-full w-full object-cover object-[50%_45%] transition-opacity duration-700 ease-editorial ${
                status === 'ready' ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <video
              ref={videoRef}
              aria-hidden="true"
              tabIndex={-1}
              muted
              playsInline
              preload="auto"
              disablePictureInPicture
              poster={HERO_POSTER}
              className="absolute inset-0 -z-20 h-full w-full object-cover object-[50%_45%] transition-opacity duration-700 ease-editorial"
              style={{ opacity: status === 'ready' ? 1 : 0 }}
            />
          </>
        )}

        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-b from-navy/55 via-navy/10 to-navy/60"
        />

        <div
          ref={textRef}
          className="shell relative w-full pb-[6vh] pt-[calc(var(--header-height)+48px)] text-center will-change-[opacity,transform]"
        >
          <h1 className="mx-auto max-w-5xl animate-fade-up text-[clamp(1.95rem,6.1vw,5.5rem)] font-semibold leading-[1.04] tracking-[-0.03em] text-white [animation-delay:120ms]">
            Discover Exceptional
            <br className="hidden sm:block" /> Homes &amp; Investments
          </h1>

          <p className="mx-auto mt-6 max-w-xl animate-fade-up text-[15px] leading-[1.75] text-white/85 [animation-delay:300ms] sm:mt-7 sm:text-[17px]">
            Premium properties in prime locations. Find your dream home or the perfect investment
            with confidence.
          </p>
        </div>

        <div
          ref={cueRef}
          className="absolute inset-x-0 bottom-7 hidden flex-col items-center gap-3 sm:flex"
        >
          {loading ? (
            <>
              <span className="text-[9.5px] font-medium uppercase tracking-[0.36em] text-white/55">
                Preparing the view
              </span>
              <span
                aria-hidden="true"
                className="relative h-px w-24 overflow-hidden bg-white/20"
              >
                <span
                  className="absolute inset-y-0 left-0 w-full origin-left bg-champagne transition-transform duration-300 ease-linear"
                  style={{ transform: `scaleX(${Math.max(loadProgress, 0.04)})` }}
                />
              </span>
            </>
          ) : (
            <>
              <span className="text-[9.5px] font-medium uppercase tracking-[0.36em] text-white/55">
                Scroll
              </span>
              <span
                aria-hidden="true"
                className="h-10 w-px bg-gradient-to-b from-white/50 to-white/0"
              />
            </>
          )}
        </div>
      </div>
    </section>
  );
}
