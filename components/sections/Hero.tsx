'use client';

import { motion } from 'framer-motion';
import { Mail, RotateCcw } from 'lucide-react';
import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { createPortal } from 'react-dom';
import { siGithub } from 'simple-icons';
import { profile, story } from '@/lib/content';

const roleTags = ['React + Node.js', 'FastAPI + PostgreSQL', 'AI Workflows'];
const LONG_PRESS_DURATION_MS = 600;
const LINKEDIN_ICON_PATH =
  'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z';

type RadialMenuState = {
  x: number;
  y: number;
  visible: boolean;
};

export function Hero() {
  const [isStoryVisible, setIsStoryVisible] = useState(false);
  const [isStorySheetVisible, setIsStorySheetVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [dragStartY, setDragStartY] = useState<number | null>(null);
  const [dragY, setDragY] = useState(0);
  const [radialMenu, setRadialMenu] = useState<RadialMenuState>({ x: 0, y: 0, visible: false });
  const longPressTimerRef = useRef<number | null>(null);
  const radialMenuTriggeredRef = useRef(false);
  const heroFrontRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setIsMounted(true);

    return () => {
      if (longPressTimerRef.current !== null) {
        window.clearTimeout(longPressTimerRef.current);
      }
    };
  }, []);

  const openStory = () => {
    if (radialMenuTriggeredRef.current) {
      radialMenuTriggeredRef.current = false;
      return;
    }

    if (window.matchMedia('(max-width: 767px)').matches) {
      setDragY(0);
      setIsStorySheetVisible(true);
      return;
    }

    setIsStoryVisible(true);
  };

  const closeStorySheet = () => {
    setIsStorySheetVisible(false);
    setDragY(0);
    setDragStartY(null);
  };

  const clearLongPressTimer = () => {
    if (longPressTimerRef.current !== null) {
      window.clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const handleHeroTouchStart = (event: TouchEvent) => {
    if (!window.matchMedia('(max-width: 767px)').matches) {
      return;
    }

    const touch = event.touches[0];

    if (!touch) {
      return;
    }

    clearLongPressTimer();

    longPressTimerRef.current = window.setTimeout(() => {
      radialMenuTriggeredRef.current = true;
      setRadialMenu({
        x: touch.clientX,
        y: touch.clientY,
        visible: true,
      });

      if (navigator.vibrate) {
        navigator.vibrate(10);
      }

      longPressTimerRef.current = null;
    }, LONG_PRESS_DURATION_MS);
  };

  const handleHeroTouchMove = () => {
    clearLongPressTimer();
  };

  const handleHeroTouchEnd = () => {
    clearLongPressTimer();
  };

  useEffect(() => {
    const heroFront = heroFrontRef.current;

    if (!heroFront) {
      return undefined;
    }

    heroFront.addEventListener('touchstart', handleHeroTouchStart, { passive: true });
    heroFront.addEventListener('touchmove', handleHeroTouchMove, { passive: true });
    heroFront.addEventListener('touchend', handleHeroTouchEnd, { passive: true });
    heroFront.addEventListener('touchcancel', handleHeroTouchEnd, { passive: true });

    return () => {
      heroFront.removeEventListener('touchstart', handleHeroTouchStart);
      heroFront.removeEventListener('touchmove', handleHeroTouchMove);
      heroFront.removeEventListener('touchend', handleHeroTouchEnd);
      heroFront.removeEventListener('touchcancel', handleHeroTouchEnd);
    };
  });

  const openRadialLink = (href: string) => {
    if (href.startsWith('mailto:')) {
      window.location.href = href;
      radialMenuTriggeredRef.current = false;
      setRadialMenu((current) => ({ ...current, visible: false }));
      return;
    }

    window.open(href, '_blank', 'noopener,noreferrer');
    radialMenuTriggeredRef.current = false;
    setRadialMenu((current) => ({ ...current, visible: false }));
  };

  const handleSheetPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (dragStartY === null) {
      return;
    }

    setDragY(Math.max(event.clientY - dragStartY, 0));
  };

  const handleSheetPointerEnd = () => {
    if (dragY > 120) {
      closeStorySheet();
      return;
    }

    setDragY(0);
    setDragStartY(null);
  };

  const storyContent = (
    <>
      <p className="hero-story-eyebrow">My story</p>
      <h2>Building across product, AI, and systems.</h2>
      <div className="hero-story-copy">
        <p>{story.intro}</p>
        {story.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <p>{story.currentFocus}</p>
      </div>

      <div className="hero-story-highlights">
        {story.highlights.map((highlight) => (
          <div key={highlight} className="hero-story-note">
            {highlight}
          </div>
        ))}
      </div>
    </>
  );

  return (
    <section
      id="hero"
      className="hero-stage relative min-h-[calc(100vh-7rem)] overflow-hidden rounded-[2rem] py-8 sm:py-10 lg:min-h-[calc(100vh-8rem)] lg:py-12"
    >
      <div className="hero-bloom" aria-hidden="true" />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 62, damping: 24, mass: 1.05 }}
        className="relative z-10 flex min-h-[inherit] items-center justify-center"
      >
        <div
          className={`hero-flip-card ${isStoryVisible ? 'hero-flip-card-flipped' : ''}`}
        >
          <div className="hero-flip-inner">
            <div
              ref={heroFrontRef}
              className="hero-flip-face hero-flip-front"
            >
              <div className="hero-availability mx-auto mt-6 max-w-fit text-xs md:mt-4 md:text-sm">
                <span className="hero-availability-dot" aria-hidden="true" />
                <span>
                  Open to <span className="hidden md:inline">software engineering </span>
                  opportunities
                </span>
              </div>

              <div className="hero-name-block">
                <div className="hero-role-line">
                  <span aria-hidden="true" />
                  <p>{profile.role}</p>
                  <span aria-hidden="true" />
                </div>
                <h1>{profile.name}</h1>
                <button
                  type="button"
                  className="hero-flip-hint"
                  aria-label="Read Nayan's story"
                  onClick={openStory}
                >
                  <RotateCcw size={12} aria-hidden="true" />
                  Click to read my story
                </button>
              </div>

              <p className="hero-summary">
                I build things that work in production — financial platforms,
                AI pipelines, and hardware accelerators. Currently at BIT,
                shipping real systems between lectures.
              </p>

              <div className="hero-role-tags">
                {roleTags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>

            <div className="hero-flip-face hero-flip-back">
              <button
                type="button"
                className="hero-story-back-button"
                aria-label="Back to hero"
                onClick={() => setIsStoryVisible(false)}
              >
                <RotateCcw size={14} aria-hidden="true" />
                Back
              </button>
              <div
                className="hero-story-content"
                onWheel={(event) => event.stopPropagation()}
                onTouchMove={(event) => event.stopPropagation()}
              >
                {storyContent}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      {isMounted
        ? createPortal(
            <>
              <div
                className={`hero-story-sheet-backdrop ${isStorySheetVisible ? 'hero-story-sheet-backdrop-visible' : ''}`}
                aria-hidden={!isStorySheetVisible}
                onClick={closeStorySheet}
              >
                <div
                  className="hero-story-sheet"
                  role="dialog"
                  aria-modal="true"
                  aria-label="Nayan's story"
                  style={{
                    transform: `translateY(${isStorySheetVisible ? dragY : 100}%)`,
                  }}
                  onClick={(event) => event.stopPropagation()}
                  onPointerMove={handleSheetPointerMove}
                  onPointerUp={handleSheetPointerEnd}
                  onPointerCancel={handleSheetPointerEnd}
                >
                  <button
                    type="button"
                    className="hero-story-sheet-handle"
                    aria-label="Drag down to close story"
                    onPointerDown={(event) => {
                      event.currentTarget.setPointerCapture(event.pointerId);
                      setDragStartY(event.clientY);
                    }}
                  >
                    <span />
                  </button>
                  <div
                    className="hero-story-sheet-content"
                    onWheel={(event) => event.stopPropagation()}
                    onTouchMove={(event) => event.stopPropagation()}
                  >
                    {storyContent}
                  </div>
                </div>
              </div>
              {radialMenu.visible ? (
                <div
                  className="hero-radial-menu-backdrop"
                  onClick={() => {
                    radialMenuTriggeredRef.current = false;
                    setRadialMenu((current) => ({ ...current, visible: false }));
                  }}
                >
                  <div
                    className="hero-radial-menu"
                    style={{
                      left: radialMenu.x,
                      top: radialMenu.y,
                    }}
                  >
                    <button
                      type="button"
                      className="hero-radial-pill hero-radial-pill-linkedin"
                      onClick={(event) => {
                        event.stopPropagation();
                        openRadialLink(profile.linkedin);
                      }}
                    >
                      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                        <path d={LINKEDIN_ICON_PATH} />
                      </svg>
                      LinkedIn
                    </button>
                    <button
                      type="button"
                      className="hero-radial-pill hero-radial-pill-github"
                      onClick={(event) => {
                        event.stopPropagation();
                        openRadialLink(profile.github);
                      }}
                    >
                      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                        <path d={siGithub.path} />
                      </svg>
                      GitHub
                    </button>
                    <button
                      type="button"
                      className="hero-radial-pill hero-radial-pill-email"
                      onClick={(event) => {
                        event.stopPropagation();
                        openRadialLink(`mailto:${profile.email}`);
                      }}
                    >
                      <Mail size={14} aria-hidden="true" />
                      Email
                    </button>
                  </div>
                </div>
              ) : null}
            </>,
            document.body,
          )
        : null}
    </section>
  );
}
