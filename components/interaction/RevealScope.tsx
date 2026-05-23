'use client';

import { useRef, type ReactNode } from 'react';
import { useReveal } from '@/hooks/useReveal';

type RevealScopeProps = {
  children: ReactNode;
  className?: string;
  delayOffset?: number;
};

export function RevealScope({ children, className = '', delayOffset = 0 }: RevealScopeProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useReveal(ref, delayOffset);

  return (
    <div ref={ref} className={`reveal-scope ${className}`.trim()}>
      {children}
    </div>
  );
}
