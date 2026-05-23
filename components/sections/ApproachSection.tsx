import { RevealScope } from '@/components/interaction/RevealScope';
import { ScrollTilt } from '@/components/interaction/ScrollTilt';
import { AeroGlass } from '@/components/ui/GlassPanel';
import { RevealText } from '@/components/ui/RevealText';
import { education, leadership, principles } from '@/lib/content';

export function ApproachSection() {
  return (
    <RevealScope>
      <section id="approach" className="space-y-8 scroll-mt-28">
        <div className="mx-auto max-w-3xl text-center">
          <p className="reveal-child section-label font-semibold">
            Foundation
          </p>
          <h2 className="reveal-child section-heading mt-3">
            <RevealText text="Built different." />
          </h2>
          <p className="reveal-child body-copy mx-auto mt-4 max-w-2xl text-pretty">
            NCC discipline, festival-scale coordination, and an engineering degree — applied to every project.
          </p>
        </div>
        <ScrollTilt>
          <AeroGlass variant="window" tone="strong" className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_0.85fr] lg:p-9">
            <div className="space-y-5">
              <p className="reveal-child body-copy">
                Currently pursuing {education.degree} at {education.institution},
                with a project portfolio spanning financial dashboards, AI drug discovery,
                and multi-agent research workflows.
              </p>
              <p className="reveal-child body-copy">
                Outside the codebase, NCC training and event leadership have shaped a
                steady approach to coordination, ownership, and execution under pressure.
              </p>
              <div className="grid gap-3">
                {leadership.map((item) => (
                  <p
                    key={item}
                    className="reveal-child body-copy rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                  >
                    {item}
                  </p>
                ))}
              </div>
            </div>
            <div className="grid gap-3">
              {principles.map((principle) => (
                <div
                  key={principle}
                  className="reveal-child rounded-xl border border-white/10 bg-white/5 px-4 py-4 text-sm font-medium text-white/70"
                >
                  {principle}
                </div>
              ))}
            </div>
          </AeroGlass>
        </ScrollTilt>
      </section>
    </RevealScope>
  );
}
