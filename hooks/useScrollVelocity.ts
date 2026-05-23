'use client';

import { useEffect, useRef } from 'react';
import { subscribeScrollBus } from '@/hooks/useScrollBus';

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function useScrollVelocity() {
  const velocityRef = useRef(0);

  useEffect(() => {
    let previousScrollY = 0;
    let previousTime = performance.now();
    let settleId: number | null = null;

    const unsubscribe = subscribeScrollBus(({ y }) => {
      const currentTime = performance.now();
      const elapsed = Math.max(currentTime - previousTime, 1);
      const velocity = (y - previousScrollY) / elapsed;

      velocityRef.current = clamp(velocity, -1, 1);
      previousScrollY = y;
      previousTime = currentTime;

      if (settleId) {
        window.clearTimeout(settleId);
      }

      settleId = window.setTimeout(() => {
        velocityRef.current = 0;
      }, 120);
    });

    return () => {
      unsubscribe();

      if (settleId !== null) {
        window.clearTimeout(settleId);
      }
    };
  }, []);

  return velocityRef;
}
