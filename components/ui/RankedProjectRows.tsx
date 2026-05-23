'use client';

import { ChevronRight } from 'lucide-react';
import { useEffect, useState, type MouseEvent } from 'react';
import type { RankedProject } from '@/lib/githubProjects';
import { ProjectBottomSheet } from '@/components/ui/ProjectBottomSheet';

type RankedProjectRowsProps = {
  projects: RankedProject[];
};

export function RankedProjectRows({ projects }: RankedProjectRowsProps) {
  const [selectedProject, setSelectedProject] = useState<RankedProject | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateIsMobile = () => {
      const nextIsMobile = window.innerWidth < 768;
      setIsMobile(nextIsMobile);

      if (!nextIsMobile) {
        setSelectedProject(null);
      }
    };

    updateIsMobile();
    window.addEventListener('resize', updateIsMobile);

    return () => window.removeEventListener('resize', updateIsMobile);
  }, []);

  const handleProjectClick = (event: MouseEvent<HTMLAnchorElement>, project: RankedProject) => {
    if (window.innerWidth >= 768) {
      return;
    }

    event.preventDefault();
    setSelectedProject(project);
  };

  return (
    <>
      <div className="grid gap-3">
        {projects.map((project) => (
          <a
            key={project.repoUrl}
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ranked-project-row"
            onClick={(event) => handleProjectClick(event, project)}
          >
            <span className="reveal-child ranked-project-rank">#{project.rank}</span>
            <span className="min-w-0">
              <span className="reveal-child block truncate font-medium text-slate-100">
                {project.title}
              </span>
              <span className="reveal-child body-copy mt-1 block truncate">
                {project.category}
              </span>
            </span>
            <span className="reveal-child ranked-project-score">{project.score}</span>
            <span className="reveal-child ranked-project-status">
              {project.status}
            </span>
            <ChevronRight
              size={18}
              className="reveal-child justify-self-end text-white/35 md:hidden"
              aria-hidden="true"
            />
          </a>
        ))}
      </div>

      {isMobile ? (
        <ProjectBottomSheet
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      ) : null}
    </>
  );
}
