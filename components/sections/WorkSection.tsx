import { RevealScope } from '@/components/interaction/RevealScope';
import { ScrollTilt } from '@/components/interaction/ScrollTilt';
import { AeroGlass } from '@/components/ui/GlassPanel';
import { GitHubGraph } from '@/components/ui/GitHubGraph';
import { RankedProjectRows } from '@/components/ui/RankedProjectRows';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { FeaturedWorkTiles } from '@/components/sections/FeaturedWorkTiles';
import { getRankedProjects } from '@/lib/githubProjects';

export async function WorkSection() {
  const projects = await getRankedProjects();
  const featuredProjects = projects.slice(0, 3);
  const topRankedProjects = projects.slice(0, 5);

  return (
    <RevealScope>
      <section id="work" className="projects-section scroll-mt-28">
        <div className="projects-atmosphere" aria-hidden="true" />
        <div className="relative z-10 grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
          <SectionHeading
            eyebrow="Ranked work"
            title="What I've actually built."
            description="Ranked by complexity, real-world use, and collaboration. Top three are featured — rest are below."
          />
        </div>

        <div className="relative z-10 mt-8">
          <FeaturedWorkTiles projects={featuredProjects} />
        </div>

        <ScrollTilt className="relative z-10 mt-8">
          <AeroGlass variant="window" tone="default" className="p-4 sm:p-5 lg:p-6">
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="reveal-child section-label font-semibold">
                    All projects
                  </p>
                  <h3 className="reveal-child mt-2 text-2xl font-semibold tracking-tight text-white">
                    Ranked by impact, not stars.
                  </h3>
                </div>
                <a
                  href="https://github.com/nayanhasnolyf?tab=repositories"
                  target="_blank"
                  rel="noreferrer"
                  className="reveal-child projects-link w-fit"
                >
                  View GitHub
                </a>
              </div>

              <RankedProjectRows projects={topRankedProjects} />

              <div className="grid pt-2">
                <GitHubGraph />
              </div>
            </div>
          </AeroGlass>
        </ScrollTilt>
      </section>
    </RevealScope>
  );
}
