'use client';

import { useEffect, useRef } from 'react';
import { subscribeScrollBus } from '@/hooks/useScrollBus';

export function ScrollProgress() {
  const progressRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    return subscribeScrollBus(({ y, maxY }) => {
      const progress = Math.min(Math.max((y / Math.max(maxY, 1)) * 100, 0), 100);
      if (progressRef.current) {
        progressRef.current.style.width = `${progress}%`;
      }
    });
  }, []);

  return (
    <div className="scroll-progress-root" aria-hidden="true">
      <div ref={progressRef} className="scroll-progress-bar" />
    </div>
  );
}
