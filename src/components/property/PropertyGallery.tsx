import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';
import { useLockBodyScroll } from '../../hooks';
import { imageUrl } from '../../lib/images';

interface PropertyGalleryProps {
  images: string[];
  name: string;
}

export function PropertyGallery({ images, name }: PropertyGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useLockBodyScroll(lightboxOpen);

  const showPrevious = () => setActiveIndex((index) => (index - 1 + images.length) % images.length);
  const showNext = () => setActiveIndex((index) => (index + 1) % images.length);

  useEffect(() => {
    if (!lightboxOpen) return;
    closeRef.current?.focus();

    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') setLightboxOpen(false);
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        setActiveIndex((index) => (index - 1 + images.length) % images.length);
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        setActiveIndex((index) => (index + 1) % images.length);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxOpen, images.length]);

  return (
    <div>
      <button
        type="button"
        onClick={() => setLightboxOpen(true)}
        aria-label={`Open full-screen gallery for ${name}`}
        className="group relative block w-full overflow-hidden rounded-card bg-ivory-deep"
      >
        <div className="aspect-[16/11] w-full sm:aspect-[16/9]">
          <img
            key={images[activeIndex]}
            src={imageUrl(images[activeIndex])}
            sizes="(min-width: 1024px) 62vw, 100vw"
            alt={`${name} — photograph ${activeIndex + 1} of ${images.length}`}
            width={1600}
            height={1000}
            loading="eager"
            decoding="async"
            className="h-full w-full animate-fade-in object-cover transition-transform duration-[1400ms] ease-editorial group-hover:scale-[1.015]"
          />
        </div>
        <span className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full border border-white/30 bg-navy/55 px-4 py-2.5 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-md transition-colors duration-300 group-hover:bg-navy/75">
          <Expand aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={1.7} />
          View gallery
        </span>
      </button>

      <ul className="no-scrollbar mt-3 flex gap-2.5 overflow-x-auto pb-1 sm:mt-4 sm:gap-3">
        {images.map((image, index) => (
          <li key={image} className="w-[19%] min-w-[74px] flex-none">
            <button
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Show photograph ${index + 1} of ${images.length}`}
              aria-current={index === activeIndex}
              className={`block w-full overflow-hidden rounded-[4px] transition-all duration-300 ${
                index === activeIndex
                  ? 'outline outline-2 outline-offset-2 outline-champagne'
                  : 'opacity-70 outline outline-1 -outline-offset-1 outline-black/5 hover:opacity-100'
              }`}
            >
              <img
                src={imageUrl(image)}
                alt={`${name} thumbnail ${index + 1}`}
                width={320}
                height={240}
                loading="lazy"
                decoding="async"
                className="aspect-[4/3] w-full object-cover"
              />
            </button>
          </li>
        ))}
      </ul>

      {lightboxOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${name} image gallery`}
          className="fixed inset-0 z-[80] flex flex-col bg-navy-deep/95 backdrop-blur-sm"
          onClick={(event) => {
            if (event.target === event.currentTarget) setLightboxOpen(false);
          }}
        >
          <div className="flex items-center justify-between px-5 py-4 text-white sm:px-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/60">
              {activeIndex + 1} / {images.length}
            </p>
            <button
              ref={closeRef}
              type="button"
              onClick={() => setLightboxOpen(false)}
              aria-label="Close gallery"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-white transition-colors duration-300 hover:bg-white hover:text-navy"
            >
              <X aria-hidden="true" className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>

          <div className="flex flex-1 items-center justify-center px-4 pb-6 sm:px-10">
            <button
              type="button"
              onClick={showPrevious}
              aria-label="Previous photograph"
              className="mr-2 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/25 text-white transition-colors duration-300 hover:bg-white hover:text-navy sm:h-12 sm:w-12"
            >
              <ChevronLeft aria-hidden="true" className="h-5 w-5" strokeWidth={1.5} />
            </button>
            <img
              key={images[activeIndex]}
              src={imageUrl(images[activeIndex])}
              alt={`${name} — photograph ${activeIndex + 1} of ${images.length}`}
              className="max-h-[78vh] w-auto max-w-full animate-fade-in rounded-[4px] object-contain"
            />
            <button
              type="button"
              onClick={showNext}
              aria-label="Next photograph"
              className="ml-2 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/25 text-white transition-colors duration-300 hover:bg-white hover:text-navy sm:h-12 sm:w-12"
            >
              <ChevronRight aria-hidden="true" className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
