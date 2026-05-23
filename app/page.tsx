import { ApproachSection } from '@/components/sections/ApproachSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { Hero } from '@/components/sections/Hero';
import { SystemSection } from '@/components/sections/SystemSection';
import { WorkSection } from '@/components/sections/WorkSection';
import { StickySectionStage } from '@/components/interaction/StickySectionStage';

export default function HomePage() {
  return (
    <>
      <Hero />
      <StickySectionStage>
        <WorkSection />
      </StickySectionStage>
      <StickySectionStage>
        <SystemSection />
      </StickySectionStage>
      <ApproachSection />
      <ContactSection />
    </>
  );
}
