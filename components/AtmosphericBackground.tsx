'use client';

import {
  motion,
  useMotionTemplate,
  useTransform,
} from 'framer-motion';
import { type CSSProperties } from 'react';
import { useCursorGravity } from '@/components/interaction/CursorGravity';

const particles = [
  { x: '12%', y: '24%', size: 5, delay: '0s', duration: '28s' },
  { x: '27%', y: '74%', size: 3, delay: '-8s', duration: '34s' },
  { x: '43%', y: '38%', size: 4, delay: '-15s', duration: '31s' },
  { x: '68%', y: '18%', size: 6, delay: '-4s', duration: '36s' },
  { x: '82%', y: '62%', size: 3, delay: '-18s', duration: '30s' },
  { x: '91%', y: '32%', size: 4, delay: '-11s', duration: '38s' },
];

export default function AtmosphericBackground() {
  const {
    fieldX,
    fieldY,
    delayedX,
    delayedY,
    ambientX,
    ambientY,
    prefersReducedMotion,
  } = useCursorGravity();

  const primaryDriftX = useTransform(fieldX, (value) => value * 0.16);
  const primaryDriftY = useTransform(fieldY, (value) => value * 0.13);
  const delayedDriftX = useTransform(delayedX, (value) => value * -0.11);
  const delayedDriftY = useTransform(delayedY, (value) => value * 0.08);
  const glassDriftX = useTransform(ambientX, (value) => value * 0.06);
  const glassDriftY = useTransform(ambientY, (value) => value * -0.07);
  const particleDriftX = useTransform(delayedX, (value) => value * 0.055);
  const particleDriftY = useTransform(delayedY, (value) => value * 0.045);

  const lightX = useTransform(fieldX, (value) => 50 + value * 0.32);
  const lightY = useTransform(fieldY, (value) => 42 + value * 0.32);
  const cursorLight = useMotionTemplate`radial-gradient(circle at ${lightX}% ${lightY}%, rgba(186, 230, 253, 0.105), rgba(125, 211, 252, 0.042) 18%, transparent 43%)`;

  return (
    <div className="atmosphere-root" aria-hidden="true">
      <div className="atmosphere-base" />
      <motion.div
        className="atmosphere-cursor-light"
        style={{ background: cursorLight }}
      />
      <motion.div
        className="atmosphere-layer atmosphere-layer-1"
        animate={prefersReducedMotion ? undefined : { backgroundPosition: ['0% 50%', '100% 48%', '0% 50%'] }}
        transition={{ duration: 64, repeat: Infinity, ease: 'easeInOut' }}
        style={{ x: primaryDriftX, y: primaryDriftY }}
      />
      <motion.div
        className="atmosphere-layer atmosphere-layer-2"
        animate={prefersReducedMotion ? undefined : { backgroundPosition: ['100% 35%', '10% 60%', '100% 35%'] }}
        transition={{ duration: 76, repeat: Infinity, ease: 'easeInOut' }}
        style={{ x: delayedDriftX, y: delayedDriftY }}
      />
      <motion.div
        className="atmosphere-layer atmosphere-layer-3"
        animate={prefersReducedMotion ? undefined : { opacity: [0.42, 0.58, 0.42] }}
        transition={{ duration: 34, repeat: Infinity, ease: 'easeInOut' }}
        style={{ x: glassDriftX, y: glassDriftY }}
      />
      <motion.div
        className="atmosphere-particles"
        style={{ x: particleDriftX, y: particleDriftY }}
      >
        {particles.map((particle) => (
          <span
            key={`${particle.x}-${particle.y}`}
            className="atmosphere-particle"
            style={
              {
                '--particle-x': particle.x,
                '--particle-y': particle.y,
                '--particle-size': `${particle.size}px`,
                '--particle-delay': particle.delay,
                '--particle-duration': particle.duration,
              } as CSSProperties
            }
          />
        ))}
      </motion.div>
      <div className="atmosphere-fog" />
      <div className="atmosphere-readability" />
    </div>
  );
}
