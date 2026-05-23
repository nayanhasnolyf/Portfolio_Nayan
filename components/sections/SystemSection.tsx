import { RevealScope } from '@/components/interaction/RevealScope';
import { ScrollTilt } from '@/components/interaction/ScrollTilt';
import { CodeforcesCard } from '@/components/ui/CodeforcesCard';
import { AeroGlass } from '@/components/ui/GlassPanel';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SkillIconCluster } from '@/components/ui/SkillIconCluster';
import { capabilities, certifications } from '@/lib/content';

export function SystemSection() {
  return (
    <RevealScope>
      <section id="system" className="grid gap-6 scroll-mt-28 md:gap-12 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
        <div className="relative min-h-0 md:min-h-[480px]">
          <SectionHeading
            eyebrow="Technical system"
            title="I don't just write code. I architect systems."
            description="Electronics Engineering · BIT Bangalore · 2023–2027"
          />
          <SkillIconCluster />
        </div>
        <div className="grid gap-4">
          {capabilities.map((capability, index) => (
            <ScrollTilt key={capability.title}>
              <AeroGlass
                variant={index === 0 ? 'sidebar' : 'widget'}
                tone={index === 0 ? 'frost' : 'default'}
                className="p-5 sm:p-6"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  <div className="reveal-child grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-cyan-100/15 bg-cyan-100/[0.075] text-sm font-semibold text-cyan-100/85 shadow-inner-soft">
                    0{index + 1}
                  </div>
                  <div>
                    <h3 className="reveal-child text-xl font-semibold text-white">
                      {capability.title}
                    </h3>
                    <p className="reveal-child body-copy mt-2">
                      {capability.description}
                    </p>
                  </div>
                </div>
              </AeroGlass>
            </ScrollTilt>
          ))}
          <CodeforcesCard />
          <ScrollTilt>
            <AeroGlass variant="window" tone="strong" className="p-5 sm:p-6">
              <div className="flex flex-col gap-5">
                <div>
                  <p className="reveal-child section-label font-semibold">
                    Certifications
                  </p>
                  <h3 className="reveal-child mt-3 text-xl font-semibold text-white">
                    Recent learning tracks
                  </h3>
                </div>
                <div className="grid gap-3">
                  {certifications.map((certification) => (
                    <div
                      key={certification.title}
                      className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                    >
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                        <p className="reveal-child font-medium text-slate-100">
                          {certification.title}
                        </p>
                        <p className="reveal-child body-copy">
                          {certification.date}
                        </p>
                      </div>
                      <p className="reveal-child body-copy mt-1">
                        {certification.issuer}
                      </p>
                      <p className="reveal-child body-copy mt-2">
                        {certification.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </AeroGlass>
          </ScrollTilt>
        </div>
      </section>
    </RevealScope>
  );
}
