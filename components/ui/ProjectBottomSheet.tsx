'use client';

import { useEffect, useRef, useState, type TouchEvent } from 'react';
import type { RankedProject } from '@/lib/githubProjects';

type ProjectBottomSheetProps = {
  project: RankedProject | null;
  onClose: () => void;
};

const EXIT_MS = 350;

export function ProjectBottomSheet({ project, onClose }: ProjectBottomSheetProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [dragY, setDragY] = useState(0);
  const touchStartYRef = useRef<number | null>(null);
  const closeTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!project) {
      return undefined;
    }

    const frameId = window.requestAnimationFrame(() => setIsVisible(true));

    return () => {
      window.cancelAnimationFrame(frameId);

      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, [project]);

  if (!project) {
    return null;
  }

  const requestClose = () => {
    setIsVisible(false);
    setDragY(0);
    touchStartYRef.current = null;

    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
    }

    closeTimerRef.current = window.setTimeout(() => {
      onClose();
      closeTimerRef.current = null;
    }, EXIT_MS);
  };

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartYRef.current = event.touches[0]?.clientY ?? null;
  };

  const handleTouchMove = (event: TouchEvent<HTMLDivElement>) => {
    if (touchStartYRef.current === null) {
      return;
    }

    const nextDragY = Math.max((event.touches[0]?.clientY ?? touchStartYRef.current) - touchStartYRef.current, 0);
    setDragY(nextDragY);
  };

  const handleTouchEnd = () => {
    if (dragY > 80) {
      requestClose();
      return;
    }

    setDragY(0);
    touchStartYRef.current = null;
  };

  const sheetTranslate = isVisible ? `${dragY}px` : '100%';

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-[350ms] ease-out md:hidden"
      style={{ opacity: isVisible ? 1 : 0 }}
      onClick={requestClose}
    >
      <div
        className="project-bottom-sheet-panel glass-panel fixed bottom-0 left-0 right-0 max-h-[85vh] transition-transform duration-[350ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ transform: `translateY(${sheetTranslate})` }}
        role="dialog"
        aria-modal="true"
        aria-label={`${project.title} project details`}
        onClick={(event) => event.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
      >
        <div className="mx-auto mb-4 mt-3 h-1 w-10 rounded-full bg-white/20" />
        <div className="max-h-[calc(85vh-2rem)] overflow-y-auto overscroll-contain px-5 pb-8">
          <p className="section-label font-semibold">Project overview</p>
          <div className="mt-3 flex items-start justify-between gap-4">
            <div>
              <h3 className="text-2xl font-bold leading-tight text-white">{project.title}</h3>
              <p className="body-copy mt-2">{project.category}</p>
            </div>
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.045] text-sm font-bold text-cyan-100/80">
              #{project.rank}
            </span>
          </div>

          <p className="mt-5 text-sm leading-relaxed text-slate-100/85">
            {project.description}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {project.details.map((detail) => (
              <span
                key={detail}
                className="rounded-full border border-white/10 bg-white/[0.052] px-3 py-1.5 text-xs font-semibold text-slate-200/80"
              >
                {detail}
              </span>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(event) => event.stopPropagation()}
              className="inline-flex min-h-10 items-center rounded-full border border-white/10 bg-white/[0.052] px-4 text-sm font-bold text-cyan-50/90 transition hover:border-white/20 hover:bg-white/10"
            >
              Repository
            </a>
            {project.liveUrl ? (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(event) => event.stopPropagation()}
                className="inline-flex min-h-10 items-center rounded-full border border-white/10 bg-white/[0.052] px-4 text-sm font-bold text-cyan-50/90 transition hover:border-white/20 hover:bg-white/10"
              >
                Live
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
