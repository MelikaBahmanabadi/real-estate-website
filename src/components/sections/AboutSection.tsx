import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { SectionLabel } from '../ui/SectionLabel';
import { ButtonLink } from '../ui/Button';
import { Reveal } from '../ui/Reveal';
import { imageSrcSet, imageUrl } from '../../lib/images';

const MAIN_IMAGE = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c';
const SIDE_IMAGE = 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c';

interface AboutSectionProps {
  heading?: string;
  body?: string;
}

export function AboutSection({
  heading = 'Who We Are',
  body = 'At Horizon Properties, we connect people with extraordinary homes and smart investments. Integrity, transparency, and client satisfaction are at the heart of everything we do.',
}: AboutSectionProps) {
  return (
    <section aria-labelledby="about-heading" className="section bg-white">
      <div className="shell grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-5">
          <SectionLabel>About Us</SectionLabel>
          <h2 id="about-heading" className="display mt-5">
            {heading}
          </h2>
          <p className="body-copy mt-6 max-w-md">{body}</p>
          <p className="body-copy mt-4 max-w-md">
            Two decades of quiet, considered representation — one advisor from the first
            conversation to the day the keys change hands.
          </p>
          <ButtonLink to="/about" className="mt-9" withArrow>
            Learn More
          </ButtonLink>
        </Reveal>

        <Reveal className="lg:col-span-7" delay={120}>
          <div className="grid grid-cols-[1.55fr_0.8fr] gap-3 sm:gap-4">
            <div className="relative">
              <div className="media media-zoom aspect-[4/5]">
                <img
                  src={imageUrl(MAIN_IMAGE, 1000)}
                  srcSet={imageSrcSet(MAIN_IMAGE, [600, 900, 1200])}
                  sizes="(min-width: 1024px) 38vw, 64vw"
                  alt="A contemporary two-storey residence at dusk"
                  width={1000}
                  height={1250}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <Link
                to="/about"
                aria-label="Learn more about Horizon Properties"
                className="group/arrow absolute -right-5 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white text-navy shadow-[0_16px_40px_-20px_rgba(10,18,42,0.55)] transition-colors duration-300 hover:bg-navy hover:text-white sm:-right-6 sm:h-12 sm:w-12"
              >
                <ArrowRight
                  aria-hidden="true"
                  className="h-4 w-4 transition-transform duration-500 ease-editorial group-hover/arrow:translate-x-0.5"
                  strokeWidth={1.6}
                />
              </Link>
            </div>

            <div className="flex flex-col justify-end pb-6 sm:pb-10">
              <div className="media media-zoom aspect-[3/4]">
                <img
                  src={imageUrl(SIDE_IMAGE, 600)}
                  srcSet={imageSrcSet(SIDE_IMAGE, [400, 600, 800])}
                  sizes="(min-width: 1024px) 18vw, 30vw"
                  alt="Interior detail of a Horizon Properties residence"
                  width={600}
                  height={800}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <p className="mt-4 hidden text-[9.5px] font-medium uppercase leading-relaxed tracking-[0.2em] text-muted sm:block">
                Private residence
                <br />
                Malibu, California
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
