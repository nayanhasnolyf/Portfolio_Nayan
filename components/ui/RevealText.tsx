'use client';

import { useEffect, useRef, useState } from 'react';

type RevealTextProps = {
  text: string;
  delay?: number;
};

export function RevealText({ text, delay = 0 }: RevealTextProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const words = text.split(' ');

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return undefined;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) {
          return;
        }

        setIsVisible(true);
        observer.unobserve(entry.target);
      },
      { threshold: 0.3 },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <span ref={ref} className="reveal-text" aria-label={text}>
      {words.map((word, index) => (
        <span key={`${word}-${index}`} className="reveal-text-word" aria-hidden="true">
          <span
            className="reveal-text-word-inner"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(110%)',
              transitionDelay: `${delay + index * 60}ms`,
            }}
          >
            {word}
          </span>
        </span>
      ))}
    </span>
  );
}
