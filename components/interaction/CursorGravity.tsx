'use client';

import {
  createContext,
  useContext,
  useEffect,
  type ReactNode,
} from 'react';
import {
  type MotionValue,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'framer-motion';

type CursorGravityContextValue = {
  cursorX: MotionValue<number>;
  cursorY: MotionValue<number>;
  fieldX: MotionValue<number>;
  fieldY: MotionValue<number>;
  delayedX: MotionValue<number>;
  delayedY: MotionValue<number>;
  ambientX: MotionValue<number>;
  ambientY: MotionValue<number>;
  prefersReducedMotion: boolean;
};

const CursorGravityContext = createContext<CursorGravityContextValue | null>(null);

export function CursorGravityProvider({ children }: { children: ReactNode }) {
  const prefersReducedMotion = useReducedMotion() ?? false;

  const rawCursorX = useMotionValue(0);
  const rawCursorY = useMotionValue(0);
  const rawFieldX = useMotionValue(0);
  const rawFieldY = useMotionValue(0);

  const cursorX = useSpring(rawCursorX, { stiffness: 42, damping: 36, mass: 1.25 });
  const cursorY = useSpring(rawCursorY, { stiffness: 42, damping: 36, mass: 1.25 });
  const fieldX = useSpring(rawFieldX, { stiffness: 26, damping: 34, mass: 1.55 });
  const fieldY = useSpring(rawFieldY, { stiffness: 26, damping: 34, mass: 1.55 });
  const delayedX = useSpring(rawFieldX, { stiffness: 12, damping: 36, mass: 2.5 });
  const delayedY = useSpring(rawFieldY, { stiffness: 12, damping: 36, mass: 2.5 });
  const ambientX = useSpring(rawFieldX, { stiffness: 6, damping: 32, mass: 3.6 });
  const ambientY = useSpring(rawFieldY, { stiffness: 6, damping: 32, mass: 3.6 });

  useEffect(() => {
    const setCenter = () => {
      rawCursorX.set(window.innerWidth / 2);
      rawCursorY.set(window.innerHeight / 2);
      rawFieldX.set(0);
      rawFieldY.set(0);
    };

    if (prefersReducedMotion) {
      setCenter();
      return undefined;
    }

    setCenter();

    const handlePointerMove = (event: PointerEvent) => {
      const normalizedX = event.clientX / window.innerWidth - 0.5;
      const normalizedY = event.clientY / window.innerHeight - 0.5;

      rawCursorX.set(event.clientX);
      rawCursorY.set(event.clientY);
      rawFieldX.set(normalizedX * 26);
      rawFieldY.set(normalizedY * 20);
    };

    const handlePointerLeave = () => {
      setCenter();
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave, { passive: true });
    window.addEventListener('blur', setCenter);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('blur', setCenter);
    };
  }, [prefersReducedMotion, rawCursorX, rawCursorY, rawFieldX, rawFieldY]);

  return (
    <CursorGravityContext.Provider
      value={{
        cursorX,
        cursorY,
        fieldX,
        fieldY,
        delayedX,
        delayedY,
        ambientX,
        ambientY,
        prefersReducedMotion,
      }}
    >
      {children}
    </CursorGravityContext.Provider>
  );
}

export function useCursorGravity() {
  const context = useContext(CursorGravityContext);

  if (!context) {
    throw new Error('useCursorGravity must be used inside CursorGravityProvider');
  }

  return context;
}
