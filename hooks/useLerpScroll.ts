'use client';

import { useEffect, useRef } from 'react';
import { publishScrollBus } from '@/hooks/useScrollBus';

type VirtualScrollState = {
  currentY: number;
  targetY: number;
  maxY: number;
};

const LERP_FACTOR = 0.12;
const PARTICLE_REFRESH_PULL_THRESHOLD = 60;
const virtualScrollState: VirtualScrollState = {
  currentY: 0,
  targetY: 0,
  maxY: 0,
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function publishVirtualScroll() {
  publishScrollBus(virtualScrollState.currentY, virtualScrollState.maxY);
}

export function getVirtualScrollState() {
  return virtualScrollState;
}

export function setVirtualScrollTarget(targetY: number) {
  virtualScrollState.targetY = clamp(targetY, 0, virtualScrollState.maxY);
  publishVirtualScroll();
}

export function scrollToVirtualElement(id: string) {
  const element = document.getElementById(id);

  if (!element) {
    return;
  }

  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function useLerpScroll() {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const content = contentRef.current;

    if (!content) {
      return undefined;
    }

    let frameId = 0;
    let resizeObserver: ResizeObserver | null = null;
    let lastTouchY: number | null = null;
    let pullStartY: number | null = null;
    let hasTriggeredParticleRefresh = false;
    let scrollStopTimeout: number | null = null;

    const markScrolling = () => {
      document.body.classList.add('is-scrolling');

      if (scrollStopTimeout !== null) {
        window.clearTimeout(scrollStopTimeout);
      }

      scrollStopTimeout = window.setTimeout(() => {
        document.body.classList.remove('is-scrolling');
        scrollStopTimeout = null;
      }, 150);
    };

    const measure = () => {
      virtualScrollState.maxY = Math.max(content.scrollHeight - window.innerHeight, 0);
      virtualScrollState.targetY = clamp(virtualScrollState.targetY, 0, virtualScrollState.maxY);
      virtualScrollState.currentY = clamp(virtualScrollState.currentY, 0, virtualScrollState.maxY);
      publishVirtualScroll();
    };

    const render = () => {
      const distance = virtualScrollState.targetY - virtualScrollState.currentY;

      virtualScrollState.currentY += distance * LERP_FACTOR;

      if (Math.abs(distance) < 0.08) {
        virtualScrollState.currentY = virtualScrollState.targetY;
      }

      content.style.transform = `translate3d(0, -${virtualScrollState.currentY.toFixed(2)}px, 0)`;
      publishVirtualScroll();
      frameId = window.requestAnimationFrame(render);
    };

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      markScrolling();
      setVirtualScrollTarget(virtualScrollState.targetY + event.deltaY);
    };

    const handleTouchStart = (event: TouchEvent) => {
      lastTouchY = event.touches[0]?.clientY ?? null;
      pullStartY = lastTouchY;
      hasTriggeredParticleRefresh = false;
    };

    const handleTouchMove = (event: TouchEvent) => {
      const touchY = event.touches[0]?.clientY;

      if (touchY === undefined || lastTouchY === null) {
        return;
      }

      event.preventDefault();
      markScrolling();

      if (
        virtualScrollState.currentY <= 0.5 &&
        virtualScrollState.targetY <= 0.5 &&
        pullStartY !== null &&
        touchY - pullStartY > PARTICLE_REFRESH_PULL_THRESHOLD &&
        !hasTriggeredParticleRefresh
      ) {
        hasTriggeredParticleRefresh = true;
        window.dispatchEvent(new CustomEvent('portfolio:refresh-particles'));
      }

      setVirtualScrollTarget(virtualScrollState.targetY + lastTouchY - touchY);
      lastTouchY = touchY;
    };

    const handleTouchEnd = () => {
      lastTouchY = null;
      pullStartY = null;
      hasTriggeredParticleRefresh = false;
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const scrollStep = window.innerHeight * 0.86;
      const keyTargets: Record<string, number> = {
        ArrowDown: 80,
        ArrowUp: -80,
        PageDown: scrollStep,
        PageUp: -scrollStep,
        Home: -virtualScrollState.maxY,
        End: virtualScrollState.maxY,
      };

      const delta = event.key === ' ' ? scrollStep : keyTargets[event.key];

      if (delta === undefined) {
        return;
      }

      event.preventDefault();
      markScrolling();
      setVirtualScrollTarget(virtualScrollState.targetY + delta);
    };

    const handleAnchorClick = (event: MouseEvent) => {
      if (event.defaultPrevented) {
        return;
      }

      const target = event.target instanceof Element ? event.target : null;
      const anchor = target?.closest<HTMLAnchorElement>('a[href^="#"]');
      const hash = anchor?.getAttribute('href');

      if (!anchor || !hash || hash === '#') {
        return;
      }

      const targetId = decodeURIComponent(hash.slice(1));

      if (!document.getElementById(targetId)) {
        return;
      }

      event.preventDefault();
      markScrolling();
      scrollToVirtualElement(targetId);
      window.history.replaceState(null, '', hash);
    };

    measure();
    resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(content);

    window.addEventListener('resize', measure);
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleAnchorClick);
    frameId = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(frameId);
      resizeObserver?.disconnect();
      window.removeEventListener('resize', measure);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleAnchorClick);
      if (scrollStopTimeout !== null) {
        window.clearTimeout(scrollStopTimeout);
      }

      document.body.classList.remove('is-scrolling');
      content.style.transform = '';
    };
  }, []);

  return { viewportRef, contentRef };
}
