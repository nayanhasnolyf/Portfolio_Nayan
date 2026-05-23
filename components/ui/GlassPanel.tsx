'use client';

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
  type HTMLMotionProps,
  type MotionStyle,
} from 'framer-motion';
import { useCallback, useRef } from 'react';
import { useCursorGravity } from '@/components/interaction/CursorGravity';

type AeroGlassVariant = 'panel' | 'window' | 'dock' | 'sidebar' | 'widget' | 'modal';
type AeroGlassTone = 'default' | 'strong' | 'frost';

type AeroGlassProps = HTMLMotionProps<'div'> & {
  children: React.ReactNode;
  variant?: AeroGlassVariant;
  tone?: AeroGlassTone;
  floating?: boolean;
  hover?: boolean;
  gravity?: boolean;
};

const toneClassNames: Record<AeroGlassTone, string> = {
  default: 'aero-glass-tone-default',
  strong: 'aero-glass-tone-strong',
  frost: 'aero-glass-tone-frost',
};

export function AeroGlass({
  children,
  className = '',
  variant = 'panel',
  tone = 'default',
  floating = false,
  hover = true,
  gravity = true,
  transition,
  style,
  ...props
}: AeroGlassProps) {
  const prefersReducedMotion = useReducedMotion();
  const {
    ref,
    style: gravityStyle,
  } = useAeroGlassGravity({ variant, enabled: gravity && !prefersReducedMotion });
  const classNames = [
    'aero-glass',
    `aero-glass-${variant}`,
    toneClassNames[tone],
    floating ? 'aero-glass-floating' : '',
    hover ? 'aero-glass-interactive' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      whileHover={
        hover && !prefersReducedMotion
          ? { scale: variant === 'dock' ? 1.003 : 1.0015 }
          : undefined
      }
      transition={
        transition ?? {
          default: {
            type: 'spring',
            stiffness: 74,
            damping: 26,
            mass: 1.05,
          },
        }
      }
      style={{ ...style, ...gravityStyle }}
      className={classNames}
      {...props}
    >
      <span className="aero-glass-reflection" aria-hidden="true" />
      <span className="aero-glass-caustic" aria-hidden="true" />
      {children}
    </motion.div>
  );
}

function useAeroGlassGravity({
  variant,
  enabled,
}: {
  variant: AeroGlassVariant;
  enabled: boolean;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { cursorX, cursorY, prefersReducedMotion } = useCursorGravity();

  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const reflectionX = useMotionValue(0);
  const reflectionY = useMotionValue(0);
  const distortion = useMotionValue(0);

  const springTiltX = useSpring(tiltX, { stiffness: 42, damping: 32, mass: 1.35 });
  const springTiltY = useSpring(tiltY, { stiffness: 42, damping: 32, mass: 1.35 });
  const springReflectionX = useSpring(reflectionX, { stiffness: 30, damping: 34, mass: 1.8 });
  const springReflectionY = useSpring(reflectionY, { stiffness: 30, damping: 34, mass: 1.8 });
  const springDistortion = useSpring(distortion, { stiffness: 28, damping: 36, mass: 2 });

  const reflectionXValue = useMotionTemplate`${springReflectionX}%`;
  const reflectionYValue = useMotionTemplate`${springReflectionY}%`;
  const distortionValue = useMotionTemplate`${springDistortion}px`;

  const radius = {
    panel: 340,
    window: 430,
    dock: 260,
    sidebar: 360,
    widget: 330,
    modal: 410,
  }[variant];

  const updateGravity = useCallback(() => {
    if (!enabled || prefersReducedMotion || !ref.current) {
      tiltX.set(0);
      tiltY.set(0);
      reflectionX.set(0);
      reflectionY.set(0);
      distortion.set(0);
      return;
    }

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = cursorX.get() - centerX;
    const deltaY = cursorY.get() - centerY;
    const distance = Math.hypot(deltaX, deltaY);

    if (distance > radius) {
      tiltX.set(0);
      tiltY.set(0);
      reflectionX.set(0);
      reflectionY.set(0);
      distortion.set(0);
      return;
    }

    const safeDistance = Math.max(distance, 1);
    const normalX = deltaX / safeDistance;
    const normalY = deltaY / safeDistance;
    const falloff = 1 - distance / radius;
    const influence = falloff * falloff;

    tiltX.set(-normalY * influence * 0.24);
    tiltY.set(normalX * influence * 0.3);
    reflectionX.set(normalX * influence * 9);
    reflectionY.set(normalY * influence * 6);
    distortion.set(influence * 0.28);
  }, [
    cursorX,
    cursorY,
    distortion,
    enabled,
    prefersReducedMotion,
    radius,
    reflectionX,
    reflectionY,
    tiltX,
    tiltY,
  ]);

  useMotionValueEvent(cursorX, 'change', updateGravity);
  useMotionValueEvent(cursorY, 'change', updateGravity);

  const style = {
    rotateX: springTiltX,
    rotateY: springTiltY,
    '--aero-gravity-reflect-x': reflectionXValue,
    '--aero-gravity-reflect-y': reflectionYValue,
    '--aero-gravity-distortion': distortionValue,
  } as MotionStyle;

  return { ref, style };
}

type GlassPanelProps = Omit<AeroGlassProps, 'variant'>;

export function GlassPanel(props: GlassPanelProps) {
  return <AeroGlass variant="panel" {...props} />;
}

export function AeroWindow(props: GlassPanelProps) {
  return <AeroGlass variant="window" {...props} />;
}

export function AeroDock(props: GlassPanelProps) {
  return <AeroGlass variant="dock" {...props} />;
}

export function AeroSidebar(props: GlassPanelProps) {
  return <AeroGlass variant="sidebar" {...props} />;
}

export function AeroWidget(props: GlassPanelProps) {
  return <AeroGlass variant="widget" {...props} />;
}

export function AeroModal(props: GlassPanelProps) {
  return <AeroGlass variant="modal" {...props} />;
}
