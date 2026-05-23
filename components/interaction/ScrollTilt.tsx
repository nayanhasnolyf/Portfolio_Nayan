'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { subscribeScrollBus } from '@/hooks/useScrollBus';

type ScrollTiltProps = {
  children: ReactNode;
  className?: string;
};

export function ScrollTilt({ children, className = '' }: ScrollTiltProps) {
  const tiltRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let previousY = 0;
    let previousTime = performance.now();
    let settleId: number | null = null;

    const unsubscribe = subscribeScrollBus(({ y }) => {
      const currentTime = performance.now();
      const elapsed = Math.max(currentTime - previousTime, 1);
      const velocity = Math.min(Math.max((y - previousY) / elapsed, -1), 1);

      if (tiltRef.current) {
        const tilt = velocity * 1.5;
        tiltRef.current.style.transform = `rotateX(${tilt.toFixed(3)}deg)`;
      }

      previousY = y;
      previousTime = currentTime;

      if (settleId !== null) {
        window.clearTimeout(settleId);
      }

      settleId = window.setTimeout(() => {
        if (tiltRef.current) {
          tiltRef.current.style.transform = 'rotateX(0deg)';
        }
      }, 120);
    });

    return () => {
      unsubscribe();

      if (settleId !== null) {
        window.clearTimeout(settleId);
      }
    };
  }, []);

  return (
    <div className={`scroll-tilt-perspective ${className}`.trim()}>
      <div ref={tiltRef} className="scroll-tilt-panel">
        {children}
      </div>
    </div>
  );
}
