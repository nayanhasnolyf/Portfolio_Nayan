'use client';

import { useEffect, useState } from 'react';
import AtmosphericBackground from '@/components/AtmosphericBackground';
import { CursorGravityProvider } from '@/components/interaction/CursorGravity';
import { FloatingWindowProvider } from '@/components/interaction/FloatingWindow';
import { DockNavigation } from '@/components/layout/DockNavigation';
import { ParticleField } from '@/components/ui/ParticleField';
import { ScrollProgress } from '@/components/ui/ScrollProgress';

export function SiteShell({ children }: { children: React.ReactNode }) {
  const [isRefreshingParticles, setIsRefreshingParticles] = useState(false);

  useEffect(() => {
    let timeoutId: number | null = null;

    const showRefreshLabel = () => {
      setIsRefreshingParticles(true);

      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }

      timeoutId = window.setTimeout(() => {
        setIsRefreshingParticles(false);
        timeoutId = null;
      }, 1200);
    };

    window.addEventListener('portfolio:refresh-particles', showRefreshLabel);

    return () => {
      window.removeEventListener('portfolio:refresh-particles', showRefreshLabel);

      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
    };
  }, []);

  return (
    <CursorGravityProvider>
      <FloatingWindowProvider>
        <ScrollProgress />
        <div
          className={`particle-refresh-label ${isRefreshingParticles ? 'particle-refresh-label-visible' : ''}`}
          aria-live="polite"
        >
          ↻ refreshing particles...
        </div>
        <AtmosphericBackground />
        <ParticleField />
        <div className="virtual-scroll-viewport">
          <div className="virtual-scroll-content">
            <main className="page-scroll-container relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-24 px-4 pt-6 sm:px-6 sm:pt-8 lg:gap-32 lg:px-8 lg:pt-10">
              {children}
            </main>
          </div>
        </div>
        <DockNavigation />
      </FloatingWindowProvider>
    </CursorGravityProvider>
  );
}
