import { useCallback, useEffect, useRef, useState } from 'react';
import type { KeyboardEvent, PointerEvent } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Property } from '../../types';
import { PropertyCard } from './PropertyCard';

interface PropertyCarouselProps {
  properties: Property[];
  label?: string;
}

export function PropertyCarousel({ properties, label = 'Featured properties' }: PropertyCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, startX: 0, startScroll: 0, moved: 0 });
  const suppressClick = useRef(false);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateEdges = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setAtStart(track.scrollLeft <= 6);
    setAtEnd(track.scrollLeft + track.clientWidth >= track.scrollWidth - 6);
  }, []);

  useEffect(() => {
    updateEdges();
    const track = trackRef.current;
    if (!track || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(updateEdges);
    observer.observe(track);
    return () => observer.disconnect();
  }, [updateEdges, properties.length]);

  const scrollStep = () => {
    const track = trackRef.current;
    if (!track) return 0;
    const item = track.querySelector<HTMLElement>('[data-carousel-item]');
    const gap = Number.parseFloat(getComputedStyle(track).columnGap || '0') || 0;
    return (item?.offsetWidth ?? track.clientWidth * 0.8) + gap;
  };

  const move = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const max = track.scrollWidth - track.clientWidth;
    let target = track.scrollLeft + scrollStep() * direction;

    if (direction === 1 && target >= max - 8) target = 0;
    if (direction === -1 && target <= 8) target = max;

    track.scrollTo({ left: target, behavior: 'smooth' });
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    const track = trackRef.current;
    if (!track) return;
    drag.current = {
      active: true,
      startX: event.clientX,
      startScroll: track.scrollLeft,
      moved: 0,
    };
    try {
      track.setPointerCapture(event.pointerId);
    } catch {
      /* pointer not capturable (e.g. synthetic event) — dragging still works */
    }
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!track || !drag.current.active) return;
    const delta = event.clientX - drag.current.startX;
    if (Math.abs(delta) > 4) {
      drag.current.moved = Math.max(drag.current.moved, Math.abs(delta));
      track.scrollLeft = drag.current.startScroll - delta;
      track.classList.add('dragging');
      suppressClick.current = true;
    }
  };

  const endDrag = () => {
    const track = trackRef.current;
    drag.current.active = false;
    track?.classList.remove('dragging');
    window.setTimeout(() => {
      suppressClick.current = false;
    }, 80);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      move(1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      move(-1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      trackRef.current?.scrollTo({ left: 0, behavior: 'smooth' });
    } else if (event.key === 'End') {
      event.preventDefault();
      const track = trackRef.current;
      track?.scrollTo({ left: track.scrollWidth, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative">
      <p className="sr-only">
        Use the previous and next buttons, or scroll the strip horizontally, to browse properties.
      </p>

      <div
        ref={trackRef}
        role="region"
        aria-roledescription="carousel"
        aria-label={label}
        tabIndex={0}
        onScroll={updateEdges}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onKeyDown={onKeyDown}
        onClickCapture={(event) => {
          if (suppressClick.current) {
            event.preventDefault();
            event.stopPropagation();
            suppressClick.current = false;
          }
        }}
        className="no-scrollbar -my-2 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 sm:gap-5 lg:cursor-grab lg:gap-6 lg:active:cursor-grabbing"
      >
        {properties.map((property) => (
          <div
            key={property.id}
            data-carousel-item
            className="w-[80%] flex-none snap-start sm:w-[46%] lg:w-[27%] xl:w-[24.5%]"
          >
            <PropertyCard property={property} />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => move(-1)}
        aria-label="Previous properties"
        className={`absolute -left-2 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white/95 text-navy shadow-[0_10px_30px_-16px_rgba(10,18,42,0.5)] backdrop-blur-sm transition-all duration-300 hover:bg-navy hover:text-white lg:-left-5 lg:h-12 lg:w-12 ${
          atStart ? 'opacity-70' : 'opacity-100'
        }`}
      >
        <ChevronLeft aria-hidden="true" className="h-5 w-5" strokeWidth={1.5} />
      </button>

      <button
        type="button"
        onClick={() => move(1)}
        aria-label="Next properties"
        className={`absolute -right-2 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white/95 text-navy shadow-[0_10px_30px_-16px_rgba(10,18,42,0.5)] backdrop-blur-sm transition-all duration-300 hover:bg-navy hover:text-white lg:-right-5 lg:h-12 lg:w-12 ${
          atEnd ? 'opacity-70' : 'opacity-100'
        }`}
      >
        <ChevronRight aria-hidden="true" className="h-5 w-5" strokeWidth={1.5} />
      </button>
    </div>
  );
}
