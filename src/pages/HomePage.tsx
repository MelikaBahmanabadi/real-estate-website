import { Hero } from '../components/sections/Hero';
import { AboutSection } from '../components/sections/AboutSection';
import { FeaturedProperties } from '../components/sections/FeaturedProperties';
import { ServicesSection } from '../components/sections/ServicesSection';
import { WhyChooseSection } from '../components/sections/WhyChooseSection';
import { TeamSection } from '../components/sections/TeamSection';
import { CtaSection } from '../components/sections/CtaSection';
import { usePageTitle } from '../hooks';

export default function HomePage() {
  usePageTitle('');

  return (
    <>
      <Hero />
      <AboutSection />
      <FeaturedProperties />
      <ServicesSection />
      <WhyChooseSection />
      <TeamSection />
      <CtaSection />
    </>
  );
}
