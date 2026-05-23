'use client';

import { useEffect, type RefObject } from 'react';

export function useReveal<T extends HTMLElement>(ref: RefObject<T>, delayOffset = 0) {
  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return undefined;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let timeoutId: number | undefined;

    const reveal = () => {
      timeoutId = window.setTimeout(() => {
        element.classList.add('revealed');
      }, delayOffset);
    };

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      reveal();

      return () => {
        if (timeoutId) {
          window.clearTimeout(timeoutId);
        }
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          reveal();
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.15,
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();

      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [delayOffset, ref]);
}
