'use client';

import { useEffect, useRef, useState } from 'react';
import type { RankedProject } from '@/lib/githubProjects';
import { subscribeScrollBus } from '@/hooks/useScrollBus';

type FeaturedWorkTilesProps = {
  projects: RankedProject[];
};

type FeaturedProjectCopy = {
  impact: string;
  primaryStack: string;
  description: string;
};

const featuredProjectCopy: Record<string, FeaturedProjectCopy> = {
  Spndx: {
    impact: 'Real-time portfolio tracking with AI commentary',
    primaryStack: 'React + Node',
    description:
      'Spndx helps people track money, transactions, and portfolio movement in one live dashboard, with AI commentary that turns financial data into clearer decisions. Built with React/Vite, Express, PostgreSQL, Recharts, internationalization, and Gemini.',
  },
  MolGenix: {
    impact: 'Drug discovery backend for academic ML research',
    primaryStack: 'FastAPI',
    description:
      'MolGenix gives researchers a backend workflow for exploring disease targets, molecule generation, screening, ADMET prediction, docking, vector search, and report generation. Built with FastAPI, PostgreSQL, RDKit, and DeepChem.',
  },
  'RISC-V Systolic Array Accelerator': {
    impact: 'Hardware ML accelerator designed in Verilog',
    primaryStack: 'Verilog',
    description:
      'This accelerator explores how matrix workloads can run through a reusable 4x4 output-stationary systolic array connected to a RISC-V style system interface. Built in synthesizable Verilog with MMIO blocks, testbenches, and waveform verification.',
  },
};

function getFeaturedCopy(project: RankedProject) {
  return (
    featuredProjectCopy[project.title] ?? {
      impact: project.category,
      primaryStack: project.details[0] ?? project.status,
      description: project.description,
    }
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function FeaturedWorkTiles({ projects }: FeaturedWorkTilesProps) {
  const [flippedProject, setFlippedProject] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const translateRef = useRef(0);

  useEffect(() => {
    return subscribeScrollBus(({ y }) => {
      const track = trackRef.current;
      const section = track?.closest('section');

      if (track && section) {
        if (window.innerWidth < 768) {
          translateRef.current = 0;
          track.style.transform = 'translateX(0px)';
          return;
        }

        const sectionRect = section.getBoundingClientRect();
        const sectionTop = sectionRect.top + y;
        const sectionHeight = Math.max(sectionRect.height, 1);
        const progress = clamp((y - sectionTop) / sectionHeight, 0, 1);
        const targetTranslate = progress * -40;

        translateRef.current += (targetTranslate - translateRef.current) * 0.08;
        track.style.transform = `translateX(${translateRef.current.toFixed(2)}px)`;
      }
    });
  }, []);

  useEffect(() => {
    const track = trackRef.current;

    if (!track) {
      return undefined;
    }

    let frameId = 0;

    const updateActiveIndex = () => {
      const cards = Array.from(track.querySelectorAll<HTMLElement>('.featured-work-card'));
      const trackCenter = track.scrollLeft + track.clientWidth / 2;
      let nextIndex = 0;
      let smallestDistance = Number.POSITIVE_INFINITY;

      cards.forEach((card, index) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const distance = Math.abs(cardCenter - trackCenter);

        if (distance < smallestDistance) {
          smallestDistance = distance;
          nextIndex = index;
        }
      });

      setActiveIndex(nextIndex);
      frameId = 0;
    };

    const requestUpdate = () => {
      if (frameId) {
        return;
      }

      frameId = window.requestAnimationFrame(updateActiveIndex);
    };

    updateActiveIndex();
    track.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }

      track.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
    };
  }, [projects.length]);

  return (
    <div className="featured-work-grid">
      <div className="featured-work-mask">
        <div
          ref={trackRef}
          className="featured-work-track"
          onWheel={(event) => {
            if (window.innerWidth < 768 && Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
              event.stopPropagation();
            }
          }}
          onTouchMove={(event) => {
            if (window.innerWidth < 768) {
              event.stopPropagation();
            }
          }}
        >
          {projects.map((project) => {
            const isFlipped = flippedProject === project.repoUrl;
            const copy = getFeaturedCopy(project);

            return (
              <div
                key={project.repoUrl}
                role="button"
                tabIndex={0}
                className={`featured-work-card ${isFlipped ? 'featured-work-card-flipped' : ''}`}
                onClick={() => setFlippedProject(isFlipped ? null : project.repoUrl)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    setFlippedProject(isFlipped ? null : project.repoUrl);
                  }
                }}
                aria-pressed={isFlipped}
                aria-label={`${isFlipped ? 'Hide' : 'Show'} description for ${project.title}`}
              >
                <span className="featured-work-card-inner">
                  <span className="featured-work-face featured-work-face-front">
                    <span className="featured-work-topline">
                      <span className="featured-work-rank-score">
                        <span>#{project.rank}</span>
                        <span>{project.score}</span>
                      </span>
                      <span className="featured-work-primary-stack">{copy.primaryStack}</span>
                    </span>
                    <span>
                      <span className="featured-work-title">{project.title}</span>
                      <span className="featured-work-category">{copy.impact}</span>
                    </span>
                    <span className="featured-work-tags">
                      {project.details.slice(0, 4).map((detail) => (
                        <span key={detail}>{detail}</span>
                      ))}
                    </span>
                  </span>

                  <span className="featured-work-face featured-work-face-back">
                    <span>
                      <span className="featured-work-kicker section-label font-semibold">Project overview</span>
                      <span className="featured-work-description">{copy.description}</span>
                    </span>
                    <span className="featured-work-actions">
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(event) => event.stopPropagation()}
                      >
                        Repository
                      </a>
                      {project.liveUrl ? (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(event) => event.stopPropagation()}
                        >
                          Live
                        </a>
                      ) : null}
                    </span>
                  </span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="featured-work-dots" aria-hidden="true">
        {projects.map((project, index) => (
          <span
            key={project.repoUrl}
            className={index === activeIndex ? 'featured-work-dot featured-work-dot-active' : 'featured-work-dot'}
          />
        ))}
      </div>
    </div>
  );
}
