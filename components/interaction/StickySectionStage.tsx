'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { subscribeScrollBus } from '@/hooks/useScrollBus';

type StickySectionStageProps = {
  children: ReactNode;
};

export function StickySectionStage({ children }: StickySectionStageProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState<'before' | 'active' | 'after'>('before');

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return undefined;
    }

    return subscribeScrollBus(({ y }) => {
      const rect = element.getBoundingClientRect();
      const sectionTop = rect.top + y;
      const sectionBottom = sectionTop + rect.height;
      const viewportAnchor = y + window.innerHeight * 0.1;

      if (sectionBottom <= viewportAnchor) {
        setState('after');
        return;
      }

      if (sectionTop <= y + window.innerHeight * 0.9 && sectionBottom > viewportAnchor) {
        setState('active');
        return;
      }

      setState('before');
    });
  }, []);

  return (
    <div ref={ref} className={`sticky-section-stage sticky-section-stage-${state}`}>
      <div className="sticky-section-panel">
        {children}
      </div>
    </div>
  );
}
